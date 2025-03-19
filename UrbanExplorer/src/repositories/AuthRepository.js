/*
* Crée le 12 mars 2025
* Gestion des authentifications utilisateurs Firebase UrbanExplorer
*/

import { auth, db, googleProvider } from "../../firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// Vérifier si un pseudo existe déjà
const checkPseudoExists = async (pseudo) => {
  const pseudoQuery = query(collection(db, "utilisateurs"), where("pseudo", "==", pseudo.toLowerCase()));
  const querySnapshot = await getDocs(pseudoQuery);
  return !querySnapshot.empty;
};

// Vérifier si un email existe déjà
const checkEmailExists = async (email) => {
  const emailQuery = query(collection(db, "utilisateurs"), where("email", "==", email.toLowerCase()));
  const querySnapshot = await getDocs(emailQuery);
  return !querySnapshot.empty;
};

// Vérifier si le rôle est valide
const isValidRole = (role) => {
  return ["contributeur", "explorateur", "moderateur"].includes(role.toLowerCase());
};

// Fonction pour enregistrer un utilisateur dans Firestore après une connexion externe
const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, "utilisateurs", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        idUtilisateur: user.uid,
        email: user.email.toLowerCase(),
        pseudo: user.displayName ? user.displayName.toLowerCase() : `user_${user.uid.substring(0, 5)}`,
        role: "contributeur",
        dateInscription: new Date(),
        photoProfil: user.photoURL ? `picture/userprofile/PP${user.displayName.toLowerCase()}.png` : null
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur Firebase :", error);
  }
};

// Repository pour l'authentification
const AuthRepository = {
  // Connexion avec Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToFirestore(user);
      return { success: true, user };
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
      return { error: error.message };
    }
  },

  // Connexion avec Email/Mot de passe
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Inscription avec Email/Mot de passe
  register: async (email, password, nom, prenom, pseudo, role = "contributeur", photoProfil = null) => {
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

      await setDoc(doc(db, "utilisateurs", user.uid), {
        idUtilisateur: user.uid,
        email: email.toLowerCase(),
        pseudo: pseudo.toLowerCase(),
        role: role.toLowerCase(),
        dateInscription: new Date(),
        photoProfil: photoProfil ? `picture/userprofile/PP${pseudo.toLowerCase()}.png` : null
      });

      return { success: true, user };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Surveiller l'état de connexion
  observeUser: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Récupérer le profil utilisateur
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
