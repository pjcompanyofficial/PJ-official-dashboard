// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYCMvd3MLf4oYiz1LAq2SkjaawJrYF8t4",
  authDomain: "pj-official-dashboard.firebaseapp.com",
  projectId: "pj-official-dashboard",
  storageBucket: "pj-official-dashboard.firebasestorage.app",
  messagingSenderId: "929357284971",
  appId: "1:929357284971:web:2f6edf9f8789c3a8d2132e",
  measurementId: "G-G219ZMGK5W"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
