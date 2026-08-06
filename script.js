"use strict";

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const message = document.querySelector("#message");
const showPasswordButton = document.querySelector("#show-password");
const createAccountButton = document.querySelector("#create-account");
const forgotPasswordButton = document.querySelector("#forgot-password");

function setMessage(text, type) {
  message.textContent = text;
  message.className = `message is-visible is-${type}`;
}

function clearMessage() {
  message.textContent = "";
  message.className = "message";
}

function setFieldError(input, errorElement, text) {
  input.classList.toggle("is-invalid", Boolean(text));
  input.setAttribute("aria-invalid", String(Boolean(text)));
  errorElement.textContent = text;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  let isValid = true;

  setFieldError(emailInput, emailError, "");
  setFieldError(passwordInput, passwordError, "");

  if (!email) {
    setFieldError(emailInput, emailError, "Enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Enter a valid email address.");
    isValid = false;
  }

  if (!password) {
    setFieldError(passwordInput, passwordError, "Enter your password.");
    isValid = false;
  } else if (password.length < 6) {
    setFieldError(
      passwordInput,
      passwordError,
      "Your password must be at least 6 characters."
    );
    isValid = false;
  }

  return isValid;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMessage();

  if (!validateForm()) {
    setMessage("Please fix the highlighted fields.", "error");
    return;
  }

  setMessage(
    "The login screen is working. Firebase authentication will be connected in the next step.",
    "success"
  );
});

showPasswordButton.addEventListener("click", () => {
  const isShowing = passwordInput.type === "text";

  passwordInput.type = isShowing ? "password" : "text";
  showPasswordButton.textContent = isShowing ? "Show" : "Hide";
  showPasswordButton.setAttribute("aria-pressed", String(!isShowing));
  showPasswordButton.setAttribute(
    "aria-label",
    isShowing ? "Show password" : "Hide password"
  );
});

createAccountButton.addEventListener("click", () => {
  clearMessage();
  setMessage(
    "Account creation will be added when Firebase is connected.",
    "success"
  );
});

forgotPasswordButton.addEventListener("click", () => {
  clearMessage();

  const email = emailInput.value.trim();

  if (!email) {
    setFieldError(
      emailInput,
      emailError,
      "Enter your email first so we know where to send the reset link."
    );
    emailInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Enter a valid email address.");
    emailInput.focus();
    return;
  }

  setFieldError(emailInput, emailError, "");
  setMessage(
    "Password reset will be enabled after Firebase is connected.",
    "success"
  );
});

emailInput.addEventListener("input", () => {
  if (emailInput.classList.contains("is-invalid")) {
    setFieldError(emailInput, emailError, "");
  }
});

passwordInput.addEventListener("input", () => {
  if (passwordInput.classList.contains("is-invalid")) {
    setFieldError(passwordInput, passwordError, "");
  }
});
