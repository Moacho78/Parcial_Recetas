import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgHrk_c81Cw7w13vROdAPH9HsxMFM5qq8",
  authDomain: "realtime2025-2-ad6c1.firebaseapp.com",
  databaseURL: "https://realtime2025-2-ad6c1-default-rtdb.firebaseio.com",
  projectId: "realtime2025-2-ad6c1",
  storageBucket: "realtime2025-2-ad6c1.firebasestorage.app",
  messagingSenderId: "686525595459",
  appId: "1:686525595459:web:8284eb83ac8b667011b9f6",
  measurementId: "G-1BVLWPJ8K3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };