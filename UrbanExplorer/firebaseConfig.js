import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// authentification utilisateur
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGS5TrS9JTdByClaDb7TG_aTs5TPP_EYk",
  authDomain: "urbanexplorer-bb1f9.firebaseapp.com",
  projectId: "urbanexplorer-bb1f9",
  storageBucket: "urbanexplorer-bb1f9.firebasestorage.app",
  messagingSenderId: "932567680672",
  appId: "1:932567680672:android:c8bae1b297b2a31ed2ebc5"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Authentification
const auth = getAuth(app);

export { db, auth };


