import { FC, memo, useCallback, useState } from "react";
import { Box, Button, Container, Typography, Alert } from "@mui/material";
import { useUserStorage } from "common/hooks/useUserStorage";
import { SubtitleFont } from "shared/fonts";
import { capitalizeFirstLetter } from "common/helpers";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ResponseData } from "common/types";
import { debounce } from "common/helpers/debounce";
import { PagePath } from "shared/constants";
import { useNavigate } from "react-router-dom";
import { postLogout } from "api/requests/auth/postLogout";

export const DashboardPage: FC = memo(() => {
  const { user, clearUser } = useUserStorage();
  const navigate = useNavigate();

  const [dashboardError, setDashboardError] = useState<string>("");
  const [dashboardSuccess, setDashboardSuccess] = useState<string>("");

  const fetchFunc = useCallback(async () => {
    return await postLogout();
  }, []);

  const { mutate } = useMutation<AxiosResponse<ResponseData<{}>>>({
    mutationFn: () => debounce(fetchFunc(), 500),
    onSuccess: (axiosResponse) => {
      if (!axiosResponse) {
        setDashboardError("Internal server error");
        return;
      }

      const { error, data } = axiosResponse?.data ?? {};

      if (error && axiosResponse.status !== 403) {
        setDashboardError(data?.message || "Internal server error");
        return;
      }
      setDashboardError("");
      setDashboardSuccess("Logged out successfuly");

      setTimeout(() => {
        clearUser();
        navigate(PagePath.Login, { replace: true });
      }, 700);
    },
    onError: () => {
      setDashboardError("Internal server error");
    },
  });

  const handleSubmit = () => {
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
          background: "#D2E4FF",
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
            {capitalizeFirstLetter(user?.name)}, Your Phrases
          </Typography>
        </Box>
        <Box
          sx={{
            height: "100%",
            background: "rgb(210, 228, 255)",
            padding: "0 10px 10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {dashboardError && (
            <Alert
              sx={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              }}
              variant="filled"
              severity="error"
            >
              {dashboardError}
            </Alert>
          )}
          {dashboardSuccess && (
            <Alert
              sx={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              }}
              variant="filled"
              severity="success"
            >
              {dashboardSuccess}
            </Alert>
          )}
          <Box
            sx={{
              flex: 1,
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#4261af",
                "&:hover": {
                  backgroundColor: "rgb(48 71 130)",
                },
              }}
              variant="contained"
              // onClick={handleSubmit}
            >
              Show your phrases
            </Button>
            <Button
              sx={{
                marginTop: "0.5rem",
                borderColor: "#4261af",
                "&:hover": {
                  borderColor: "rgb(48 71 130)",
                },
              }}
              variant="outlined"
              onClick={handleSubmit}
            >
              Log out
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
});
