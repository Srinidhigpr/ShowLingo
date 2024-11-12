import { useEffect, useState } from "react";
import { UserType } from "common/types";

export const useUserStorage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get("user", (result) => {
      setUser(result.user || null);
      setIsLoading(false);
    });
  }, []);

  const saveUser = (userData) => {
    chrome.storage.sync.set({ user: userData }, () => {
      setUser(userData);
    });
  };

  const clearUser = () => {
    chrome.storage.sync.remove("user", () => {
      setUser(null);
    });
  };

  return { user, isLoading, saveUser, clearUser };
};
