// Track user activity on job-related websites
const jobSites = [
    'linkedin.com/jobs',
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'careers.'
  ];
  
  let lastActivity = new Date().getTime();
  
  // Check if current site is a job site
  function isJobSite() {
    return jobSites.some(site => window.location.href.includes(site));
  }
  
  // Update progress when user interacts with job sites
  if (isJobSite()) {
    document.addEventListener('input', updateActivity);
    document.addEventListener('click', updateActivity);
    document.addEventListener('scroll', updateActivity);
  }
  
  function updateActivity() {
    const now = new Date().getTime();
    
    // Only update if more than 5 seconds have passed
    if (now - lastActivity > 5000) {
      chrome.storage.local.get(['progress'], (result) => {
        let progress = result.progress || 0;
        progress = Math.min(progress + 1, 100);
        chrome.storage.local.set({ progress });
      });
      
      lastActivity = now;
    }
  }
  // Create and insert a floating timer
function createFloatingUI() {
  const timerContainer = document.createElement("div");
  timerContainer.id = "floating-timer-container";
  timerContainer.innerHTML = `
      <div id="floating-timer">
          <p id="floating-message">Take a break!</p>
          <span id="timer-display">05:00</span>
          <button id="stop-timer">Stop</button>
      </div>
  `;
  document.body.appendChild(timerContainer);

  // Add CSS styles
  const style = document.createElement("style");
  style.textContent = `
      #floating-timer-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          font-family: sans-serif;
          z-index: 9999;
      }
      #floating-timer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
      }
      #floating-message {
          font-size: 14px;
          font-weight: bold;
          color: #6366f1;
      }
      #timer-display {
          font-size: 18px;
          font-weight: bold;
      }
      #stop-timer {
          background-color: #ff4d4d;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
      }
  `;
  document.head.appendChild(style);

  // Handle stop button
  document.getElementById("stop-timer").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "stop_timer" });
      timerContainer.remove();
  });
}

// Start timer when receiving message from background
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "start_timer") {
      createFloatingUI();
      startCountdown(5 * 60); // 5-minute countdown
  }


// Function to start a countdown timer
function startCountdown(seconds) {
  const display = document.getElementById("timer-display");
  let timeLeft = seconds;

  const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      display.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      timeLeft--;

      if (timeLeft < 0) {
          clearInterval(timerInterval);
          chrome.runtime.sendMessage({ type: "timer_done" });
      }
  }, 1000);
}

});