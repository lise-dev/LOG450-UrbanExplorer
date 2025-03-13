/*
 * Crée le 12 mars 2025
 * Gestion des utilisateurs Firebase UrbanExplorer
 */

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Vérifier si un pseudo existe déjà en base
const checkPseudoExists = async (pseudo) => {
  try {
    const querySnapshot = await getDocs(collection(db, "utilisateurs"));
    return querySnapshot.docs.some(doc => doc.data().pseudo === pseudo);
  } catch (error) {
    console.error("Erreur lors de la vérification du pseudo :", error);
    return false;
  }
};

// Vérifier si un email est valide (doit contenir @ et .)
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Récupérer le rôle d'un utilisateur
const getUserRole = async (userId) => {
  try {
    const userRef = doc(db, "utilisateurs", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().role; // Retourne le rôle
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle utilisateur :", error);
    return null;
  }
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

  // Ajouter un utilisateur en utilisant `uid` de Firebase Auth
  addUser: async (userId, newUser) => {
    try {
      if (!isValidEmail(newUser.email)) {
        return { error: "L'adresse email est invalide. Veuillez entrer un email valide." };
      }

      const pseudoExists = await checkPseudoExists(newUser.pseudo);
      if (pseudoExists) {
        return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
      }

      const userRef = doc(db, "utilisateurs", userId);
      await setDoc(userRef, { idUtilisateur: userId, ...newUser });

      console.log(`Utilisateur ajouté avec l'ID : ${userId}`);
      return { success: true, userId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Modifier son propre compte
  editUser: async (userId, requesterId, updatedData) => {
    try {
      if (userId !== requesterId) {
        return { error: "Vous n'avez pas la permission de modifier ce compte." };
      }

      const userRef = doc(db, "utilisateurs", userId);

      // Vérifier si l'email est valide si mis à jour
      if (updatedData.email && !isValidEmail(updatedData.email)) {
        return { error: "L'adresse email est invalide." };
      }

      // Vérifier si le pseudo est unique
      if (updatedData.pseudo) {
        const pseudoExists = await checkPseudoExists(updatedData.pseudo);
        if (pseudoExists) {
          return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
        }
      }

      // Empêcher la modification de l'ID utilisateur
      delete updatedData.idUtilisateur;

      await updateDoc(userRef, updatedData);
      console.log(`Utilisateur ${userId} mis à jour avec succès.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error);
      return { error: "Une erreur est survenue lors de la modification." };
    }
  },

  // Supprimer un utilisateur (seulement si c'est lui-même ou un modérateur)
  deleteUser: async (userId, requesterId) => {
    try {
      if (userId !== requesterId) {
        // Vérifier si le demandeur est un modérateur
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
