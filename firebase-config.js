import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtM9Dh38OvZehjDUWGf-RihnsQD06YGLc",
  authDomain: "myflixv1.firebaseapp.com",
  projectId: "myflixv1",
  storageBucket: "myflixv1.firebasestorage.app",
  messagingSenderId: "116001293537",
  appId: "1:116001293537:web:63bcfbabd01954f54263a0",
  measurementId: "G-9T1J226ZS1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
