import { FC, memo, useState, useCallback, useEffect } from "react";
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
  const { user, clearUser, clearToken } = useUserStorage();
  const navigate = useNavigate();

  const [text, setText] = useState<string>("");
  const [dashboardError, setDashboardError] = useState<string>("");
  const [dashboardSuccess, setDashboardSuccess] = useState<string>("");

  useEffect(() => {
    const messageListener = (message) => {
      if (message.type === "audioResult") {
        setDashboardSuccess(message.text);
        setText(message.text);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const startRecognition = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (tabId) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: startVideo,
        });
      }
    });
  };

  const stopRecognition = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (tabId) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: stopVideo,
        });
      }
    });
  };

  const startVideo = () => {
    const video = document.querySelector("video");
    if (video && video.paused) {
      video.play();
    }
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = window.navigator.language;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.addEventListener("result", (event) => {
      const result: string =
        event.results[event.results.length - 1][0].transcript;
      chrome.runtime.sendMessage({ text: result, type: "audioResult" });
    });
    recognition.start();
  };

  const stopVideo = () => {
    const video = document.querySelector("video");
    if (video && video.played) {
      video.pause();
    }
    // const recognition = new (window.SpeechRecognition ||
    //   window.webkitSpeechRecognition)();
    // recognition.lang = window.navigator.language;
    // recognition.interimResults = true;
    // recognition.continuous = true;
    // recognition.stop();
  };

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
      setDashboardSuccess("Logged out successfully");

      setTimeout(() => {
        clearUser();
        clearToken();
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
        >
          <textarea value={text} readOnly rows={8} />
          <br />
          <button onClick={startRecognition}>Start</button>
          <button onClick={stopRecognition}>Stop</button>
        </Box>
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
  );
});
