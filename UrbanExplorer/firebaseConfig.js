import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGS5TrS9JTdByClaDb7TG_aTs5TPP_EYk",
  authDomain: "urbanexplorer-bb1f9.firebaseapp.com",
  projectId: "urbanexplorer-bb1f9",
  storageBucket: "urbanexplorer-bb1f9.firebasestorage.app",
  messagingSenderId: "932567680672",
  appId: "1:932567680672:android:c8bae1b297b2a31ed2ebc5",
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
// const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
