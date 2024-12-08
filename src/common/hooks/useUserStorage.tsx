import { useEffect, useState } from "react";
import { UserType } from "common/types";

export const useUserStorage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get("user", (result) => {
      setUser(result.user || null);
      setIsLoading(false);
    });
  }, []);

  const saveUser = (userData: UserType) => {
    chrome.storage.sync.set({ user: userData }, () => {
      setUser(userData);
    });
  };

  const saveToken = (token: string) => {
    chrome.storage.sync.set({ token }, () => {
      setToken(token);
    });
  };

  const clearUser = () => {
    chrome.storage.sync.set({ user: null }, () => {
      setUser(null);
    });
  };

  const clearToken = () => {
    chrome.storage.sync.set({ token: null }, () => {
      setToken(null);
      clearWebsite();
    });
  };

  const refreshWebsite = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url.includes("localhost:3001")) {
        chrome.tabs.reload(currentTab.id);
      }
    });
  };

  const clearWebsite = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url.includes("localhost:3001")) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: () => {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            window.location.href = "/login";
          },
        });
      }
    });
  };

  return {
    user,
    isLoading,
    saveUser,
    clearUser,
    refreshWebsite,
    clearToken,
    saveToken,
  };
};
