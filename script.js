const $ = (id) => document.getElementById(id);
let currentGreeting = { name: "", message: "Wishing you a day filled with happiness, laughter and beautiful memories. Have a wonderful birthday!", theme: "midnight" };
let audioContext = null;
let soundOn = false;

function applyTheme(theme) {
  document.body.classList.remove("theme-rose", "theme-ocean", "theme-gold");
  if (theme !== "midnight") document.body.classList.add(`theme-${theme}`);
}

function showGreeting(data) {
  currentGreeting = data;
  applyTheme(data.theme || "midnight");
  $("greetingTitle").textContent = data.name ? `Happy Birthday, ${data.name}!` : "Happy Birthday!";
  $("greetingMessage").textContent = data.message;
  $("letterMessage").textContent = data.message;
  $("builder").classList.add("hidden");
  $("surprise").classList.remove("hidden");
}

function encodeGreeting(data) {
  const url = new URL($("siteUrl").value.trim());
  url.searchParams.set("to", data.name);
  url.searchParams.set("message", data.message);
  url.searchParams.set("theme", data.theme);
  return url.toString();
}

$("greetingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  currentGreeting = {
    name: $("recipient").value.trim(),
    message: $("message").value.trim() || "Wishing you a wonderful birthday!",
    theme: $("theme").value
  };
  $("shareArea").classList.remove("hidden");
  showGreeting(currentGreeting);
  $("surprise").classList.add("hidden");
  $("builder").classList.remove("hidden");
  $("status").textContent = "Greeting created. Publish the page and enter its public URL to create a share link and QR code.";
});

$("makeQr").addEventListener("click", () => {
  const raw = $("siteUrl").value.trim();
  if (!raw) return $("status").textContent = "Enter your published website URL first.";
  let url;
  try { url = new URL(raw); } catch { return $("status").textContent = "That URL does not look valid."; }
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    return $("status").textContent = "For safe sharing, use a public HTTPS website URL.";
  }
  if (typeof QRCode === "undefined") return $("status").textContent = "QR library did not load. Check your internet connection and reload.";
  const link = encodeGreeting(currentGreeting);
  $("qrcode").innerHTML = "";
  new QRCode($("qrcode"), { text: link, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
  $("qrWrap").classList.remove("hidden");
  $("status").textContent = "QR code created. Test it with your phone before sharing.";
});

$("copyLink").addEventListener("click", async () => {
  try {
    const link = encodeGreeting(currentGreeting);
    await navigator.clipboard.writeText(link);
    $("status").textContent = "Greeting link copied.";
  } catch { $("status").textContent = "Copy was blocked by the browser. Create the QR code or copy the URL manually."; }
});

$("whatsapp").addEventListener("click", () => {
  const link = encodeGreeting(currentGreeting);
  const text = `I made a little birthday surprise for you! Open it here: ${link}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

$("downloadQr").addEventListener("click", () => {
  const canvas = $("qrcode").querySelector("canvas");
  const img = $("qrcode").querySelector("img");
  const data = canvas ? canvas.toDataURL("image/png") : (img ? img.src : null);
  if (!data) return;
  const a = document.createElement("a");
  a.href = data; a.download = "birthday-surprise-qr.png"; a.click();
});

$("celebrate").addEventListener("click", () => {
  $("letter").classList.remove("hidden");
  playChime();
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.textContent = ["✦", "✧", "♡", "🎉"][i % 4];
    piece.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-30px;font-size:${18+Math.random()*22}px;z-index:10;pointer-events:none;animation:fall ${2+Math.random()*2}s linear forwards`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
});

$("backToBuilder").addEventListener("click", () => {
  $("surprise").classList.add("hidden");
  $("builder").classList.remove("hidden");
});

function playChime() {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime + index * .16);
      gain.gain.exponentialRampToValueAtTime(.12, audioContext.currentTime + index * .16 + .03);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + index * .16 + .45);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + index * .16);
      oscillator.stop(audioContext.currentTime + index * .16 + .5);
    });
  } catch {}
}

$("soundToggle").addEventListener("click", async () => {
  soundOn = !soundOn;
  $("soundToggle").textContent = soundOn ? "♫ Sound: On" : "♫ Sound: Off";
  $("soundToggle").setAttribute("aria-pressed", String(soundOn));
  if (soundOn) {
    try { audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); await audioContext.resume(); playChime(); } catch {}
  }
});

function addFallAnimation() {
  const style = document.createElement("style");
  style.textContent = "@keyframes fall{to{transform:translateY(110vh) rotate(500deg);opacity:0}}";
  document.head.appendChild(style);
}
addFallAnimation();

const params = new URLSearchParams(window.location.search);
if (params.has("message") || params.has("to")) {
  showGreeting({
    name: (params.get("to") || "").slice(0, 40),
    message: (params.get("message") || "Wishing you a wonderful birthday!").slice(0, 400),
    theme: ["midnight", "rose", "ocean", "gold"].includes(params.get("theme")) ? params.get("theme") : "midnight"
  });
}
