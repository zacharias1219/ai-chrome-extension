const DEFAULT_KEY = "**********";
const GPT_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
const GROK_ENDPOINT = "https://api.x.ai/v1/chat/completions";

// Load the stored theme preference
chrome.storage.local.get("darkMode", (data) => {
  if (data.darkMode) {
    document.documentElement.classList.add("dark");
    toggleModeBtn.querySelector("span").innerHTML = "&#9728;";
  } else {
    document.documentElement.classList.remove("dark");
    toggleModeBtn.querySelector("span").innerHTML = "&#9790;";
  }
});

const toggleModeBtn = document.getElementById("toggleMode");
toggleModeBtn.addEventListener("click", () => {
  const darkModeEnabled = document.documentElement.classList.toggle("dark");
  const toggleSpan = toggleModeBtn.querySelector("span");

  // Change icon to corresponding mode
  toggleSpan.innerHTML = darkModeEnabled ? "&#9728;" : "&#9790;";
  chrome.storage.local.set({ darkMode: darkModeEnabled });
});

document.getElementById("saveButton").addEventListener("click", () => {
  const gptKey = document.getElementById("gptKey").value;
  const geminiKey = document.getElementById("geminiKey").value;
  const grokKey = document.getElementById("grokKey").value;

  const gptEndpoint =
    document.getElementById("gptEndpoint").value || GPT_ENDPOINT;
  const geminiEndpoint =
    document.getElementById("geminiEndpoint").value || GEMINI_ENDPOINT;
  const grokEndpoint =
    document.getElementById("grokEndpoint").value || GROK_ENDPOINT;

  const selectedAI = document.getElementById("toggle").value;

  if (
    !gptKey ||
    !geminiKey ||
    !gptEndpoint ||
    !geminiEndpoint ||
    !grokKey ||
    !grokEndpoint
  ) {
    alert("Please fill in all fields.");
    return;
  }

  chrome.storage.local.get("DATA", ({ DATA }) => {
    const newData = {
      gptKey: gptKey !== DEFAULT_KEY ? gptKey : DATA.gptKey,
      geminiKey: geminiKey !== DEFAULT_KEY ? geminiKey : DATA.geminiKey,
      grokKey: grokKey !== DEFAULT_KEY ? grokKey : DATA.grokKey,
      gptEndpoint,
      geminiEndpoint,
      grokEndpoint,
      selectedAI,
    };
    chrome.storage.local.set(
      {
        DATA: newData,
      },
      () => {
        alert("Configuration saved successfully.");
      }
    );
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const gptKey = document.getElementById("gptKey");
  const geminiKey = document.getElementById("geminiKey");
  const grokKey = document.getElementById("grokKey");

  const gptEndpoint = document.getElementById("gptEndpoint");
  const geminiEndpoint = document.getElementById("geminiEndpoint");
  const grokEndpoint = document.getElementById("grokEndpoint");

  const selectedAI = document.getElementById("toggle");

  chrome.storage.local.get("DATA", (result) => {
    const info = result.DATA;

    if (info.gptKey) {
      gptKey.value = DEFAULT_KEY;
      gptKey.type = "password";
    }
    if (info.geminiKey) {
      geminiKey.value = DEFAULT_KEY;
      geminiKey.type = "password";
    }
    if (info.grokKey) {
      grokKey.value = DEFAULT_KEY;
      grokKey.type = "password";
    }

    if (info.gptEndpoint) gptEndpoint.value = info.gptEndpoint;
    if (info.geminiEndpoint) geminiEndpoint.value = info.geminiEndpoint;
    if (info.grokEndpoint) grokEndpoint.value = info.grokEndpoint;

    if (info.selectedAI) selectedAI.value = info.selectedAI;
  });
});
