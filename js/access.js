// Change only this line when you want a different four-digit code.
const MYFLIX_ACCESS_CODE = "2026";

const ACCESS_KEY = "myflix-access-granted";
const gate = document.getElementById("accessGate");
const form = document.getElementById("accessForm");
const input = document.getElementById("accessCode");
const error = document.getElementById("accessError");

function openMyFlix() {
  sessionStorage.setItem(ACCESS_KEY, "yes");
  gate.classList.add("gate-closing");
  document.body.classList.remove("site-locked");
  window.setTimeout(() => gate.classList.add("hidden"), 350);
}

function lockMyFlix() {
  sessionStorage.removeItem(ACCESS_KEY);
  input.value = "";
  error.classList.add("hidden");
  gate.classList.remove("hidden", "gate-closing");
  document.body.classList.add("site-locked");
  window.setTimeout(() => input.focus(), 50);
}

if (sessionStorage.getItem(ACCESS_KEY) === "yes") {
  gate.classList.add("hidden");
} else {
  document.body.classList.add("site-locked");
  window.addEventListener("load", () => input.focus());
}

input.addEventListener("input", () => {
  input.value = input.value.replace(/\D/g, "").slice(0, 4);
  error.classList.add("hidden");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value === MYFLIX_ACCESS_CODE) {
    openMyFlix();
    return;
  }
  error.classList.remove("hidden");
  input.classList.remove("code-shake");
  void input.offsetWidth;
  input.classList.add("code-shake");
  input.select();
});

document.getElementById("lockButton")?.addEventListener("click", lockMyFlix);
