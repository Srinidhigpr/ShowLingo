import { FC, memo, useCallback, useState } from "react";
import { Box, Button, Container, Typography, Alert } from "@mui/material";
import { PagePath } from "shared/constants";
import { useNavigate } from "react-router-dom";
import {
  ValidationErrorMessages,
  validateIsEmpty,
} from "../../common/utils/validations";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ResponseData } from "common/types";
import { AuthType } from "../../common/types";
import { debounce } from "../../common/helpers/debounce";
import { postLogin } from "api/requests/auth/postLogin";
import { useUserStorage } from "common/hooks/useUserStorage";
import { SubtitleFont } from "shared/fonts";
import { CustomInput } from "components/CustomInput";
import { postRegister } from "api/requests/auth/postRegister";

export const LoginPage: FC = memo(() => {
  const { user, saveUser } = useUserStorage();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [userNameError, setUserNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [loginError, setLoginError] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<string>("");

  const validatePassword = () => {
    const isValid = validateIsEmpty(password);
    if (!isValid) {
      setPasswordError(ValidationErrorMessages.FieldRequired);
    }
    return isValid;
  };

  const validateUserName = () => {
    const isValid = validateIsEmpty(userName);
    if (!isValid) {
      setUserNameError(ValidationErrorMessages.FieldRequired);
    }
    return isValid;
  };

  const validateAll = (): boolean => {
    const userNameValid = validateUserName();
    const passwordValid = validatePassword();
    return userNameValid && passwordValid;
  };

  const fetchFunc = useCallback(async () => {
    const params = {
      name: userName,
      password,
    };

    return await postLogin(params);
  }, [userName, password]);

  const registerFunc = async () => {
    const params = {
      name: userName,
      password,
    };

    return await postRegister(params);
  };

  const { mutate: mutateRegister } = useMutation<
    AxiosResponse<ResponseData<AuthType>>
  >({
    mutationFn: () => debounce(registerFunc(), 500),
    onSuccess: (axiosResponse) => {
      if (!axiosResponse) {
        setLoginError("Internal server error");
        return;
      }

      const { error, data } = axiosResponse?.data ?? {};

      if (error) {
        setLoginError(data?.message || "Internal server error");
        return;
      }

      saveUser(data?.user);
      setLoginError("");
      setLoginSuccess(data?.message);

      setTimeout(() => {
        navigate(PagePath.Dashboard, { replace: true });
      }, 700);
    },
    onError: () => {
      setLoginError("Internal server error");
    },
  });

  const { mutate } = useMutation<AxiosResponse<ResponseData<AuthType>>>({
    mutationFn: () => debounce(fetchFunc(), 500),
    onSuccess: (axiosResponse) => {
      if (!axiosResponse) {
        setLoginError("Internal server error");
        return;
      }

      const { error, data } = axiosResponse?.data ?? {};

      if (error) {
        if (
          axiosResponse.status === 403 &&
          data?.message === "You do not have an account"
        ) {
          mutateRegister();
          return;
        }
        setLoginError(data?.message || "Internal server error");
        return;
      }

      saveUser(data?.user);
      setLoginError("");
      setLoginSuccess(data?.message);

      setTimeout(() => {
        navigate(PagePath.Dashboard, { replace: true });
      }, 700);
    },
    onError: () => {
      setLoginError("Internal server error");
    },
  });

  const handleSubmit = () => {
    if (user) {
      setLoginError(
        "You are already logged in. To continue, please log out via your profile page"
      );
      return;
    }
    if (!validateAll()) return;

    mutate();
  };

  return (
    <>
      <Container
        sx={{
          margin: "0",
          padding: "0",
          height: "450px",
          width: "350px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#9DB5F3",
            height: "70px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "white",
              fontFamily: SubtitleFont,
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            Welcome
          </Typography>
        </Box>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "0 10px 10px",
            background: "#D2E4FF",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CustomInput
              placeholder="Name"
              onFocus={() => {
                setUserNameError("");
              }}
              onBlur={validateUserName}
              onChange={(newUserName) => setUserName(newUserName as string)}
              error={userNameError}
              value={userName}
              type="userName"
            />
            <CustomInput
              boxSx={{
                marginTop: "1rem",
              }}
              placeholder="Password"
              onFocus={() => {
                setPasswordError("");
              }}
              onBlur={validatePassword}
              onChange={(newPassword) => setPassword(newPassword as string)}
              error={passwordError}
              value={password}
              type="password"
            />
            {loginError && (
              <Alert
                sx={{
                  marginTop: "1rem",
                }}
                variant="filled"
                severity="error"
              >
                {loginError}
              </Alert>
            )}
            {loginSuccess && (
              <Alert
                sx={{
                  marginTop: "1rem",
                }}
                variant="filled"
                severity="success"
              >
                {loginSuccess}
              </Alert>
            )}
          </Box>
          <Button
            sx={{
              backgroundColor: "#4261af",
              "&:hover": {
                backgroundColor: "rgb(48 71 130)",
              },
            }}
            variant="contained"
            onClick={handleSubmit}
          >
            Log in
          </Button>
        </Box>
      </Container>
    </>
  );
});
