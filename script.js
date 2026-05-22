const intro = document.getElementById("intro");
const introContent = document.getElementById("introContent");
const page = document.getElementById("page");
const envelopeButton = document.getElementById("envelopeButton");

const audioPlayer = document.getElementById("audioPlayer");
const mainPlayBtn = document.getElementById("mainPlayBtn");
const pauseBtn = document.getElementById("pauseBtn");
const rewindBtn = document.getElementById("rewindBtn");
const forwardBtn = document.getElementById("forwardBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const audioHelp = document.getElementById("audioHelp");

let hasOpened = false;

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function createSparkles() {
  const totalSparkles = 24;

  for (let i = 0; i < totalSparkles; i += 1) {
    const sparkle = document.createElement("span");

    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${20 + Math.random() * 80}%`;

    const size = 5 + Math.random() * 8;

    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    sparkle.style.animationDuration = `${3 + Math.random() * 3}s`;

    document.body.appendChild(sparkle);
  }
}

function openEnvelope() {
  if (hasOpened) return;

  hasOpened = true;
  introContent.classList.add("opening");

  setTimeout(() => {
    introContent.classList.add("zooming");
  }, 980);

  setTimeout(() => {
    intro.classList.add("hidden");
    page.classList.add("visible");
    document.body.classList.remove("locked");
    createSparkles();
  }, 1700);
}

function updateButtons() {
  const icon = audioPlayer.paused ? "▶" : "Ⅱ";

  mainPlayBtn.textContent = icon;
  pauseBtn.textContent = icon;

  mainPlayBtn.setAttribute(
    "aria-label",
    audioPlayer.paused ? "Reproducir canción" : "Pausar canción"
  );

  pauseBtn.setAttribute(
    "aria-label",
    audioPlayer.paused ? "Reproducir" : "Pausar"
  );
}

function updateProgress() {
  const duration = audioPlayer.duration || 0;
  const current = audioPlayer.currentTime || 0;
  const percent = duration > 0 ? (current / duration) * 100 : 0;

  progressFill.style.width = `${percent}%`;
  currentTime.textContent = formatTime(current);
  durationTime.textContent = formatTime(duration);
}

async function toggleAudio() {
  try {
    if (audioPlayer.paused) {
      await audioPlayer.play();
      audioHelp.textContent = "";
    } else {
      audioPlayer.pause();
    }

    updateButtons();
  } catch (error) {
    audioHelp.innerHTML =
      'No se puede reproducir todavía. Comprueba que existe el archivo <strong>perfect.mp3</strong> en el repo.';
  }
}

function seekAudio(event) {
  const duration = audioPlayer.duration;

  if (!Number.isFinite(duration) || duration <= 0) return;

  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percent = Math.min(Math.max(clickX / rect.width, 0), 1);

  audioPlayer.currentTime = percent * duration;
  updateProgress();
}

function skipAudio(seconds) {
  const duration = audioPlayer.duration || 0;
  const nextTime = audioPlayer.currentTime + seconds;

  audioPlayer.currentTime = Math.min(Math.max(nextTime, 0), duration);
  updateProgress();
}

envelopeButton.addEventListener("click", openEnvelope);

mainPlayBtn.addEventListener("click", toggleAudio);
pauseBtn.addEventListener("click", toggleAudio);
rewindBtn.addEventListener("click", () => skipAudio(-10));
forwardBtn.addEventListener("click", () => skipAudio(10));
progressBar.addEventListener("click", seekAudio);

audioPlayer.addEventListener("loadedmetadata", updateProgress);
audioPlayer.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("play", updateButtons);
audioPlayer.addEventListener("pause", updateButtons);
audioPlayer.addEventListener("ended", updateButtons);

audioPlayer.addEventListener("error", () => {
  audioHelp.innerHTML =
    'No encuentro el audio. Sube un archivo llamado <strong>perfect.mp3</strong> al mismo sitio que el <strong>index.html</strong>.';
});

updateButtons();
updateProgress();