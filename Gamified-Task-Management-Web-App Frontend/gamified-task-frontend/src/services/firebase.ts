import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7U-qZEKnVDr-CiXiihGrKiVTGWAhjhG8",
    authDomain: "gamifiedtaskapp.firebaseapp.com",
    projectId: "gamifiedtaskapp",
    storageBucket: "gamifiedtaskapp.firebasestorage.app",
    messagingSenderId: "919054449215",
    appId: "1:919054449215:web:a258ca310380fe44b3d68a"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Reference to the "tasks" collection in Firestore
export const tasksCollection = collection(db, "tasks");
