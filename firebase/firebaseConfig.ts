// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQlI3OwHU1HTMK5hKSanVs3GLveKctzLM",
  authDomain: "pr---desarrollo-m.firebaseapp.com",
  projectId: "pr---desarrollo-m",
  storageBucket: "pr---desarrollo-m.firebasestorage.app",
  messagingSenderId: "830044862821",
  appId: "1:830044862821:web:23d32eeca90258d8ea098c",
  measurementId: "G-ZMMTK49BDT"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
