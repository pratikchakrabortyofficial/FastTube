const $ = (selector) => document.querySelector(selector);
const form = $("#analyzeForm");
const input = $("#videoUrl");
const analyzeBtn = $("#analyzeBtn");
const statusBox = $("#status");
const mediaCard = $("#mediaCard");
const toast = $("#toast");

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}
function setStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}
function isYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return ["youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host)
      && (host !== "youtu.be" || url.pathname.length > 1);
  } catch { return false; }
}
function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "Not provided";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = input.value.trim();
  if (!isYouTubeUrl(url)) {
    setStatus("Please enter a valid YouTube video URL.", "error");
    return;
  }
  analyzeBtn.disabled = true;
  analyzeBtn.querySelector("span").textContent = "Checking link...";
  setStatus("Fetching public video information…");
  mediaCard.classList.add("hidden");
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not analyze this link.");
    $("#thumbnail").src = data.thumbnail || "";
    $("#mediaTitle").textContent = data.title || "Title unavailable";
    $("#mediaChannel").textContent = data.author || "Channel information unavailable";
    $("#mediaDuration").textContent = data.duration ? formatDuration(data.duration) : "Not provided by source";
    $("#sourceStatus").textContent = "Public details found";
    mediaCard.classList.remove("hidden");
    setStatus("Video details loaded. No authorized downloadable formats are configured.", "success");
    if (window.lucide) lucide.createIcons();
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.querySelector("span").textContent = "Analyze link";
  }
});

$("#pasteBtn").addEventListener("click", async () => {
  try {
    input.value = await navigator.clipboard.readText();
    input.focus();
    notify("Link pasted from clipboard");
  } catch {
    input.focus();
    notify("Clipboard permission unavailable — paste using Ctrl + V");
  }
});

$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  $("#themeToggle").innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}"></i>`;
  if (window.lucide) lucide.createIcons();
});

["#videoDownload", "#audioDownload"].forEach((selector) => {
  $(selector).addEventListener("click", () => {
    notify("No authorized download provider is connected yet.");
  });
});
$("#year").textContent = new Date().getFullYear();
if (window.lucide) lucide.createIcons();