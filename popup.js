let timer;
let breakActive = false;

const motivationalMessages = [
  "You're making progress, even if you can't see it yet!",
  "Every application brings you closer to your dream job!",
  "Your skills are valuable - the right company is out there!",
  "Stay focused and believe in yourself!",
  "You've got this! Keep pushing forward!",
  "Remember why you started - you're capable of amazing things!",
  "Each step forward is a step closer to success!",
  "Your dedication will pay off - keep going!",
];

document.addEventListener('DOMContentLoaded', () => {
  // Load saved progress
  chrome.storage.local.get(['progress'], (result) => {
    const progress = result.progress || 0;
    updateProgress(progress);
  });

  // New message button
  document.getElementById('new-message').addEventListener('click', () => {
    const message = getRandomMessage();
    document.getElementById('motivation-message').textContent = message;
  });

  // Break timer
  document.getElementById('break-timer').addEventListener('click', toggleBreakTimer);

  // Mood tracking
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mood = e.target.dataset.mood;
      trackMood(mood);
    });
  });
});

function getRandomMessage() {
  const index = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[index];
}

function updateProgress(value) {
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progress-text');
  
  progress.style.width = `${value}%`;
  progressText.textContent = `Progress: ${value}%`;
}

function toggleBreakTimer() {
  if (breakActive) {
    clearInterval(timer);
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('break-timer').textContent = 'Take a 5-min Break';
    breakActive = false;
  } else {
    let timeLeft = 5 * 60; // 5 minutes in seconds
    document.getElementById('timer').classList.remove('hidden');
    document.getElementById('break-timer').textContent = 'Cancel Break';
    breakActive = true;

    timer = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        document.getElementById('timer').classList.add('hidden');
        document.getElementById('break-timer').textContent = 'Take a 5-min Break';
        breakActive = false;
        showNotification('Break time is over! Ready to continue your journey?');
      }
    }, 1000);
  }
}

function trackMood(mood) {
  chrome.storage.local.get(['moods'], (result) => {
    const moods = result.moods || [];
    moods.push({
      mood,
      timestamp: new Date().toISOString()
    });
    chrome.storage.local.set({ moods });
  });

  // Show appropriate message based on mood
  let message = '';
  switch (mood) {
    case 'great':
      message = "That's awesome! Keep that positive energy going!";
      break;
    case 'okay':
      message = "Hang in there! You're doing better than you think!";
      break;
    case 'stressed':
      message = "Take a deep breath. Remember to be kind to yourself!";
      break;
  }
  document.getElementById('motivation-message').textContent = message;
}

function showNotification(message) {
  chrome.runtime.sendMessage({
    type: 'notification',
    message
  });
}

