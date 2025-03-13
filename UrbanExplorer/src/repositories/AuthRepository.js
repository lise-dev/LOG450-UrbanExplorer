/*
* Crée le 12 mars 2025
* Gestion d'authentification
*/

import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const AuthRepository = {
  // Créer un compte utilisateur
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
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

  // Suivre l'état de connexion de l'utilisateur
  observeUser: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

export default AuthRepository;
