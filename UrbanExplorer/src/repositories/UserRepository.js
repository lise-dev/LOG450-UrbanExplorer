/*
 * Crée le 12 mars 2025
 * Gestion des utilisateurs Firebase UrbanExplorer
 */

import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Vérifier si un pseudo existe déjà en base
const checkPseudoExists = async (pseudo) => {
  try {
    const querySnapshot = await getDocs(collection(db, "utilisateurs"));
    return querySnapshot.docs.some(doc => doc.data().pseudo === pseudo.toLowerCase());
  } catch (error) {
    console.error("Erreur lors de la vérification du pseudo :", error);
    return false;
  }
};

// Vérifier si un email est valide
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Vérifier si un texte ne contient que des lettres et chiffres
const isValidText = (text) => {
  const regex = /^[a-zA-Z0-9\s]+$/; 
  return text && regex.test(text);
};

// Récupérer le rôle d'un utilisateur
const getUserRole = async (userId) => {
  if (!userId) return null;
  try {
    const userRef = doc(db, "utilisateurs", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle utilisateur :", error);
    return null;
  }
};

// Forcer les entrées en minuscule, valider les champs et empêcher `null`
const formatUserData = async (userData) => {
  if (!userData.email || !isValidEmail(userData.email)) {
    return { error: "L'adresse email est invalide ou manquante." };
  }

  if (!userData.pseudo || !isValidText(userData.pseudo)) {
    return { error: "Le pseudo est invalide ou manquant. Il doit contenir uniquement des lettres et chiffres." };
  }

  if (!userData.role || !isValidText(userData.role)) {
    return { error: "Le rôle est invalide ou manquant." };
  }

  // Vérifier si le pseudo est unique avant insertion/modification
  const pseudoExists = await checkPseudoExists(userData.pseudo);
  if (pseudoExists) {
    return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
  }

  return {
    email: userData.email.toLowerCase(),
    pseudo: userData.pseudo.toLowerCase(),
    role: userData.role.toLowerCase(),
    dateInscription: userData.dateInscription || new Date(),
  };
};

// Repository pour les utilisateurs
const UserRepository = {
  // Récupérer tous les utilisateurs
  getUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "utilisateurs"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      return [];
    }
  },

  // Modifier son propre compte uniquement
  editUser: async (userId, requesterId, updatedData) => {
    if (!userId || !requesterId) return { error: "Vous devez être connecté pour modifier votre compte." };
    if (userId !== requesterId) return { error: "Vous n'avez pas la permission de modifier ce compte." };

    try {
      const formattedData = await formatUserData(updatedData);
      if (formattedData.error) return formattedData; 

      const userRef = doc(db, "utilisateurs", userId);
      await updateDoc(userRef, formattedData);
      console.log(`Utilisateur ${userId} mis à jour avec succès.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error);
      return { error: "Une erreur est survenue lors de la modification." };
    }
  },

  // Supprimer un utilisateur (seulement si c'est lui-même ou un modérateur)
  deleteUser: async (userId, requesterId) => {
    if (!userId || !requesterId) return { error: "Vous devez être connecté pour supprimer un compte." };

    try {
      if (userId !== requesterId) {
        const requesterRole = await getUserRole(requesterId);
        if (requesterRole !== "moderateur") {
          return { error: "Vous n'avez pas la permission de supprimer ce compte." };
        }
      }

      const userRef = doc(db, "utilisateurs", userId);
      await deleteDoc(userRef);
      console.log(`Utilisateur ${userId} supprimé.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return { error: "Impossible de supprimer cet utilisateur." };
    }
  }
};

export default UserRepository;
