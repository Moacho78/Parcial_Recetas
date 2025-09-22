import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-Jz42fD4CXUwdyRuzyLCYk_gZ2b3xYKE",
  authDomain: "prueba20252.firebaseapp.com",
  projectId: "prueba20252",
  storageBucket: "prueba20252.firebasestorage.app",
  messagingSenderId: "524980571239",
  appId: "1:524980571239:web:e62e42fe6285a7359118c2",
  measurementId: "G-RR0P22RWF2",
  databaseurl:"https://prueba20252-default-rtdb.firebaseio.com/"
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

export { db };