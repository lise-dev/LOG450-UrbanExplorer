/*
* Crée le 12 mars 2025
* Gestion des authentifications utilisateurs Firebase UrbanExplorer
*/

import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthRepository = {
  // Inscription : Créer un compte et enregistrer le profil utilisateur dans Firestore
  register: async (email, password, pseudo, role = "explorateur") => {
    try {
      // Étape 1 : Création de l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Étape 2 : Enregistrement du profil utilisateur dans Firestore
      await setDoc(doc(db, "utilisateurs", user.uid), {
        idUtilisateur: user.uid,  // Lien avec Firebase Auth
        email,
        pseudo,
        role,
        dateInscription: new Date()
      });

      return { success: true, user };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Connexion utilisateur
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Déconnexion utilisateur
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Suivre l'état de connexion de l'utilisateur (retourne `null` si déconnecté)
  observeUser: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Récupérer les infos du profil utilisateur depuis Firestore
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "utilisateurs", userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { error: "Profil utilisateur introuvable." };
      }
    } catch (error) {
      return { error: "Erreur lors de la récupération du profil utilisateur." };
    }
  }
};

export default AuthRepository;
