/*
* Crée le 19 mars 2025
* Écran de connexion
*/

import { auth, db } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where
} from "firebase/firestore";
import { checkPseudoExists, checkEmailExists, isValidRole } from "../utils/validators";
import UserRepository from "./UserRepository";
import { dbTables } from "../constants/dbInfo";
import roles from "../constants/roles";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

let promptAsyncGlobal;

const saveUserToFirestore = async (user, role) => {
  try {
    const userRef = doc(db, dbTables.USERS, user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const assignedRole = isValidRole(role) ? role : roles.explorateur;

      await setDoc(userRef, {
        idUtilisateur: user.uid,
        email: user.email.toLowerCase(),
        pseudo: user.displayName
          ? user.displayName.toLowerCase()
          : `user_${user.uid.substring(0, 5)}`,
        role: assignedRole,
        dateInscription: new Date(),
        photoProfil: user.photoURL
          ? `picture/userprofile/PP${user.displayName.toLowerCase()}.png`
          : null
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur Firebase :", error);
  }
};

const AuthRepository = {
  // Pour initialiser Google Auth dans un composant
  useGoogleAuthConfig: () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: "902366533112-e45edtiul28q0u72copcbv7co1queuli.apps.googleusercontent.com",
      androidClientId: "902366533112-v5dq57sffg0cr9u7gtsbhdp2oodgujra.apps.googleusercontent.com",
      iosClientId: "902366533112-6n8ea8i3vj7lmodiq49pk5ftgg6rfm3q.apps.googleusercontent.com",
      redirectUri: makeRedirectUri({ useProxy: true })
    });

    promptAsyncGlobal = promptAsync;
    return { request, response };
  },

  signInWithGoogle: async () => {
    try {
      const result = await promptAsyncGlobal();
      if (result?.type === "success") {
        const { id_token } = result.authentication;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        await saveUserToFirestore(userCredential.user);
        return { success: true, user: userCredential.user };
      } else {
        return { error: "Connexion Google annulée." };
      }
    } catch (error) {
      console.error("Erreur Google :", error);
      return { error: error.message || "Erreur inconnue" };
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { error: error.message };
    }
  },

  register: async (email, password, nom, prenom, pseudo, role = roles.contributeur, photoProfil = null) => {
    try {
      if (!isValidRole(role)) {
        return { error: "Le rôle est invalide. Choisissez entre 'contributeur', 'explorateur' ou 'moderateur'." };
      }
      if (await checkPseudoExists(pseudo)) {
        return { error: "Le pseudo est déjà utilisé. Veuillez en choisir un autre." };
      }
      if (await checkEmailExists(email)) {
        return { error: "L'email est déjà utilisé. Veuillez en choisir un autre." };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        idUtilisateur: user.uid,
        nom,
        prenom,
        pseudo,
        email,
        dateInscription: new Date(),
        role,
        photoProfil: photoProfil || null
      };

      const response = await UserRepository.addUser(userData);
      if (response.error) {
        console.error("Erreur addUser :", response.error);
      }

      return { success: true, user };
    } catch (error) {
      return { error: error.message, success: false };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  observeUser: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, dbTables.USERS, userId));
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
