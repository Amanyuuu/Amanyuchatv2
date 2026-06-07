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

document
.getElementById("googleLogin")
.addEventListener("click", async () => {

  try {
    await signInWithPopup(auth, provider);
  } catch(error) {
    console.error(error);
  }

});

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
document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

  alert("Logout clicked");

  try {
    await signOut(auth);
    alert("Firebase logout successful");
    location.reload();
  } catch(error) {
    console.error(error);
    alert(error.message);
  }

});
window.sendMessage = async function() {
  const text = document.getElementById("messageInput").value;

  if (!text) return;

  await addDoc(collection(db, "messages"), {
  username: currentUser.displayName,
  photo: currentUser.photoURL,
  uid: currentUser.uid,
  text,
  time: Date.now()
});

  document.getElementById("messageInput").value = "";
};

const q = query(collection(db, "messages"), orderBy("time"));

onSnapshot(q, (snapshot) => {
  const box = document.getElementById("messages");

  if (!box) return;

 box.innerHTML += `
<div class="message">
  <img src="${data.photo}" class="avatar">

  <div>
    <b>${data.username}</b><br>
    ${data.text}
  </div>
</div>
`;

  snapshot.forEach((doc) => {
    const data = doc.data();

    box.innerHTML += `
      <p><b>${data.username}</b>: ${data.text}</p>
    `;
  });

  box.scrollTop = box.scrollHeight;
});
