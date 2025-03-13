/*
* Crée le 12 mars 2025
* Gestion des authentifications utilisateurs Firebase UrbanExplorer
*/

import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

const checkPseudoExists = async (pseudo) => {
  try {
    const querySnapshot = await getDocs(collection(db, "utilisateurs"));
    return querySnapshot.docs.some(doc => doc.data().pseudo === pseudo.toLowerCase());
  } catch (error) {
    console.error("Erreur lors de la vérification du pseudo :", error);
    return false;
  }
};

const checkEmailExists = async (email) => {
  try {
    const querySnapshot = await getDocs(collection(db, "utilisateurs"));
    return querySnapshot.docs.some(doc => doc.data().email === email.toLowerCase());
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email :", error);
    return false;
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidText = (text) => {
  const regex = /^[a-zA-Z0-9\s]+$/; 
  return text && regex.test(text);
};

const isValidRole = (role) => {
  const validRoles = ["contributeur", "explorateur", "moderateur"];
  return validRoles.includes(role.toLowerCase());
};


const formatUserData = async (userData) => {
  if (!userData.nom || !isValidText(userData.nom)) {
    return { error: "Le nom est obligatoire et doit contenir uniquement des lettres et chiffres." };
  }

  if (!userData.prenom || !isValidText(userData.prenom)) {
    return { error: "Le prénom est obligatoire et doit contenir uniquement des lettres et chiffres." };
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    return { error: "L'adresse email est invalide ou manquante." };
  }

  if (!userData.pseudo || !isValidText(userData.pseudo)) {
    return { error: "Le pseudo est invalide ou manquant. Il doit contenir uniquement des lettres et chiffres." };
  }

  if (!userData.role || !isValidRole(userData.role)) {
    return { error: "Le rôle est invalide. Choisissez entre 'contributeur', 'explorateur' ou 'moderateur'." };
  }

  const emailExists = await checkEmailExists(userData.email);
  if (emailExists) {
    return { error: "Cet email est déjà utilisé. Veuillez en choisir un autre." };
  }

  const pseudoExists = await checkPseudoExists(userData.pseudo);
  if (pseudoExists) {
    return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
  }

  return {
    nom: userData.nom.toLowerCase(),
    prenom: userData.prenom.toLowerCase(),
    email: userData.email.toLowerCase(),
    pseudo: userData.pseudo.toLowerCase(),
    role: userData.role.toLowerCase(),
    dateInscription: new Date(),
    photoProfil: userData.photoProfil ? `PP${userData.pseudo.toLowerCase()}.png` : null,
  };
};

// Repository pour l'authentification
const AuthRepository = {
  // Inscription : Créer un compte et enregistrer le profil utilisateur dans Firestore
  register: async (email, password, nom, prenom, pseudo, role = "explorateur", photoProfil = null) => {
    try {
      const formattedUser = await formatUserData({ email, pseudo, nom, prenom, role, photoProfil });
      if (formattedUser.error) return formattedUser; 

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "utilisateurs", user.uid), {
        idUtilisateur: user.uid, 
        ...formattedUser,
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
