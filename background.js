chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
      progress: 0,
      moods: [],
      lastActivity: new Date().getTime()
    });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "start_break_timer") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: "start_timer" });
        });
    } else if (request.type === "stop_timer") {
        console.log("Timer stopped");
    } else if (request.type === "timer_done") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "Break Over!",
            message: "Time to get back to work!"
        });
    }
  });
  
  // Check for inactivity
  chrome.idle.setDetectionInterval(60); // 1 minute
  chrome.idle.onStateChanged.addListener((state) => {
    if (state === 'idle') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Taking a break?',
        message: "Remember: every small step counts! Need some motivation?"
      });
    }
  });


