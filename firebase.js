import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMFEW01MGzec9KQXiXCX0fau40P5wJwU0",
  authDomain: "portafolio-df6a7.firebaseapp.com",
  projectId: "portafolio-df6a7",
  storageBucket: "portafolio-df6a7.firebasestorage.app",
  messagingSenderId: "843574506797",
  appId: "1:843574506797:web:404e8fb60747fef9a30fa4",
  measurementId: "G-EQEMKC229B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };