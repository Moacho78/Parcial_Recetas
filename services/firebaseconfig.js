import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // 👈 importa Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAyIX0RcU7k_-FL3nNEKMwtrryv8d0M4f8",
  authDomain: "gatrogo.firebaseapp.com",
  databaseURL: "https://gatrogo-default-rtdb.firebaseio.com",
  projectId: "gatrogo",
  storageBucket: "gatrogo.appspot.com",
  messagingSenderId: "205488824009",
  appId: "1:205488824009:web:62bdc5f1076c906fd73718"
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicializar Auth
const auth = getAuth(app);

// Inicializar Firestore
const db = getFirestore(app);  // 👈 este es el que necesitas


// Exportar auth y métodos
export { auth, db,signInWithEmailAndPassword, onAuthStateChanged };