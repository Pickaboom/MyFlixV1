import { auth, db } from "./firebase-config.js";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const page = document.body.dataset.page;

const qs = (selector) => document.querySelector(selector);
const message = qs("#message");

function showMessage(text, type = "error") {
  if (!message) return;
  message.textContent = text;
  message.className = `message visible ${type}`;
}

function clearMessage() {
  if (!message) return;
  message.textContent = "";
  message.className = "message";
}

function friendlyError(error) {
  const messages = {
    "auth/email-already-in-use": "That email address already has an account.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/missing-password": "Enter your password.",
    "auth/weak-password": "Choose a stronger password with at least six characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "The network request failed. Check your internet connection.",
    "permission-denied": "Firebase blocked this request. Check your Firestore rules."
  };
  return messages[error.code] || error.message || "Something went wrong.";
}

async function registrationIsOpen() {
  const settings = await getDoc(doc(db, "settings", "public"));
  return !settings.exists() || settings.data().registrationOpen !== false;
}

async function createUserDocument(user, displayName) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    role: "user",
    emailVerified: user.emailVerified,
    profileLimit: 2,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

if (page === "login") {
  const form = qs("#login-form");
  const email = qs("#email");
  const password = qs("#password");
  const remember = qs("#remember");
  const toggle = qs("#show-password");
  const reset = qs("#forgot-password");

  toggle?.addEventListener("click", () => {
    const hidden = password.type === "password";
    password.type = hidden ? "text" : "password";
    toggle.textContent = hidden ? "Hide" : "Show";
  });

  reset?.addEventListener("click", async () => {
    clearMessage();
    if (!email.value.trim()) {
      showMessage("Enter your email address first.");
      email.focus();
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.value.trim());
      showMessage("Password reset email sent. Check your inbox.", "success");
    } catch (error) {
      showMessage(friendlyError(error));
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Signing in…";
    try {
      await setPersistence(auth, remember.checked ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
      if (!credential.user.emailVerified) {
        location.href = "verify.html";
        return;
      }
      await createUserDocument(credential.user, credential.user.displayName || "MyFlix User");
      location.href = "profiles.html";
    } catch (error) {
      showMessage(friendlyError(error));
      button.disabled = false;
      button.textContent = "Sign in";
    }
  });
}

if (page === "register") {
  const form = qs("#register-form");
  const name = qs("#display-name");
  const email = qs("#email");
  const password = qs("#password");
  const confirm = qs("#confirm-password");

  registrationIsOpen().then((open) => {
    if (!open) {
      form.hidden = true;
      showMessage("Registration is currently closed by the Owner.");
    }
  }).catch((error) => showMessage(friendlyError(error)));

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    if (name.value.trim().length < 2) {
      showMessage("Enter a display name with at least two characters.");
      return;
    }
    if (password.value.length < 6) {
      showMessage("Your password must be at least six characters.");
      return;
    }
    if (password.value !== confirm.value) {
      showMessage("The passwords do not match.");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Creating account…";

    try {
      if (!(await registrationIsOpen())) throw new Error("Registration is currently closed.");
      const credential = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value);
      await updateProfile(credential.user, { displayName: name.value.trim() });
      await createUserDocument(credential.user, name.value.trim());
      await sendEmailVerification(credential.user);
      location.href = "verify.html";
    } catch (error) {
      showMessage(friendlyError(error));
      button.disabled = false;
      button.textContent = "Create account";
    }
  });
}

if (page === "verify") {
  const resend = qs("#resend-verification");
  const refresh = qs("#check-verification");
  const logout = qs("#sign-out");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }
    qs("#verification-email").textContent = user.email || "";
    if (user.emailVerified) location.href = "profiles.html";
  });

  resend?.addEventListener("click", async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      showMessage("A new verification email has been sent.", "success");
    } catch (error) {
      showMessage(friendlyError(error));
    }
  });

  refresh?.addEventListener("click", async () => {
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        await createUserDocument(auth.currentUser, auth.currentUser.displayName || "MyFlix User");
        location.href = "profiles.html";
      } else {
        showMessage("Your email is not verified yet. Check your inbox and spam folder.");
      }
    } catch (error) {
      showMessage(friendlyError(error));
    }
  });

  logout?.addEventListener("click", async () => {
    await signOut(auth);
    location.href = "index.html";
  });
}

if (page === "protected") {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }
    await reload(user);
    if (!user.emailVerified) {
      location.href = "verify.html";
      return;
    }
    const label = qs("#user-name");
    if (label) label.textContent = user.displayName || user.email;
    document.documentElement.classList.add("ready");
  });

  qs("#sign-out")?.addEventListener("click", async () => {
    await signOut(auth);
    location.href = "index.html";
  });
}
