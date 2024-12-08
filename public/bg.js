chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab?.url?.includes("localhost:3001")
  ) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        chrome.storage.sync.get("user", (result) => {
          if (result.user) {
            sessionStorage.setItem("user", JSON.stringify(result.user));

            chrome.storage.sync.get("token", (result) => {
              if (result.token) {
                sessionStorage.setItem("token", JSON.stringify(result.token));

                if (!window.location.pathname.includes("/home")) {
                  window.location.href = "/home";
                }
              }
            });
          }
        });
      },
    });
  }
});
