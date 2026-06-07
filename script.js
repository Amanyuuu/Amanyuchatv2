import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPSv_Ndj2EjMim4_qrBluy-vOfH9NNbR4",
  authDomain: "amanyuchat.firebaseapp.com",
  projectId: "amanyuchat",
  storageBucket: "amanyuchat.firebasestorage.app",
  messagingSenderId: "88080670616",
  appId: "1:88080670616:web:1d922f36851d8e2a1595ed",
  measurementId: "G-10JKHNH2C9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

// Google Login
document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login Error:", error);
  }
});

// Login State
onAuthStateChanged(auth, (user) => {

  if (user) {

    currentUser = user;

    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";

  } else {

    currentUser = null;

    document.getElementById("login").style.display = "block";
    document.getElementById("chat").style.display = "none";

  }

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }

});

// Send Message
window.sendMessage = async function () {

  if (!currentUser) return;

  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text) return;

  try {

    await addDoc(collection(db, "messages"), {
      username: currentUser.displayName,
      photo: currentUser.photoURL,
      uid: currentUser.uid,
      text: text,
      time: Date.now()
    });

    input.value = "";

  } catch (error) {

    console.error("Send Error:", error);

  }

};

// Enter Key Send
document.getElementById("messageInput")
.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {
    sendMessage();
  }

});

// Load Messages
const q = query(
  collection(db, "messages"),
  orderBy("time")
);

onSnapshot(q, (snapshot) => {

  const box = document.getElementById("messages");

  box.innerHTML = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    box.innerHTML += `
      <div class="message">
        <img
          src="${data.photo || "https://via.placeholder.com/40"}"
          class="avatar"
        >

        <div>
          <b>${data.username}</b><br>
          ${data.text}
        </div>
      </div>
    `;

  });

  box.scrollTop = box.scrollHeight;

});
