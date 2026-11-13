// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEM8rdehJptLvTWakv2\_0er-NbXZCqglc",
  authDomain: "asbily.firebaseapp.com",
  projectId: "asbily",
  storageBucket: "asbily.firebasestorage.app",
  messagingSenderId: "898010765732",
  appId: "1:898010765732:web:bc11682751caf218984931",
  measurementId: "G-BKZHRNSFY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
