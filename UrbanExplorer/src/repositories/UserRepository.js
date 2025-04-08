/*
 * Crée le 12 mars 2025
 * Gestion des UTILISATEURS Firebase UrbanExplorer
 */

import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { checkPseudoExists, isValidEmail, isValidRole, isValidText}  from "../utils/validators"; 
import { dbTables } from "../constants/dbInfo";
import roles from "../constants/roles";

// Récupérer le rôle d'un utilisateur
const getUserRole = async (userId) => {
  if (!userId) return null;
  const userRef = doc(db, dbTables.USERS, userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().role : null;
};

// Mettre à jour les références `idUtilisateur` dans les autres collections
const updateUserReferences = async (userId) => {
  const collectionsToUpdate = ["avis", "signalements", "notifications", "favoris", "photos", "recompenses", "sanctions"];
  for (const collectionName of collectionsToUpdate) {
    const querySnap = await getDocs(query(collection(db, collectionName), where("idUtilisateur", "==", userId)));
    querySnap.forEach(async (docSnapshot) => {
      await updateDoc(doc(db, collectionName, docSnapshot.id), { idUtilisateur: "Utilisateur supprimé" });
    });
  }
};

// Mettre à jour les références dans les spots créés par l'utilisateur
const updateSpotsReferences = async (userId) => {
  const spotsQuery = query(collection(db, dbTables.SPOTS), where("ajoutePar", "==", userId));
  const spotsSnapshot = await getDocs(spotsQuery);
  spotsSnapshot.forEach(async (spot) => {
    await updateDoc(doc(db, dbTables.SPOTS, spot.id), { ajoutePar: "Utilisateur supprimé" });
  });
};

// Forcer les entrées en minuscule, valider les champs et empêcher `null`
const formatUserData = async (userData) => {
  if (!userData.email || !isValidEmail(userData.email)) {
    return { error: "L'adresse email est invalide ou manquante." };
  }

  if (!userData.pseudo || !isValidText(userData.pseudo)) {
    return { error: "Le pseudo est invalide ou manquant. Il doit contenir uniquement des lettres et chiffres." };
  }

  if (!userData.role || !isValidRole(userData.role)) {
    return { error: "Le rôle est invalide. Il doit être 'contributeur', 'explorateur' ou 'moderateur'." };
  }

  if (!userData.nom || !isValidText(userData.nom)) {
    return { error: "Le nom est invalide ou manquant." };
  }

  if (!userData.prenom || !isValidText(userData.prenom)) {
    return { error: "Le prénom est invalide ou manquant." };
  }

  // if (!userData.photoProfil) {
  //   return { error: "La photo de profil est obligatoire." };
  // }

  // Vérifier si le pseudo est unique avant insertion/modification
  const pseudoExists = await checkPseudoExists(userData.pseudo, userData.idUtilisateur);
  if (pseudoExists) {
    return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
  }

  return {
    idUtilisateur: userData.idUtilisateur || `user_${Date.now()}`,
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email.toLowerCase(),
    pseudo: userData.pseudo.toLowerCase(),
    role: userData.role,
    dateInscription: userData.dateInscription || new Date(),
    photoProfil: userData.photoProfil,
  };
};

// Repository pour les utilisateurs
const UserRepository = {
  // Récupérer tous les utilisateurs
  getUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, dbTables.USERS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      return [];
    }
  },

  // Ajouter un utilisateur pour les tests
  addUser: async (userData) => {
    try {
      // Vérification des champs obligatoires
      if (!userData.nom || !isValidText(userData.nom)) {
        return { error: "Le champ 'nom' est obligatoire et doit contenir uniquement des lettres et chiffres." };
      }

      if (!userData.prenom || !isValidText(userData.prenom)) {
        return { error: "Le champ 'prenom' est obligatoire et doit contenir uniquement des lettres et chiffres." };
      }

      if (!userData.email || !isValidEmail(userData.email)) {
        return { error: "L'adresse email est invalide ou manquante." };
      }

      if (!userData.pseudo || !isValidText(userData.pseudo)) {
        return { error: "Le pseudo est invalide ou manquant. Il doit contenir uniquement des lettres et chiffres." };
      }

      if (!userData.role || !isValidRole(userData.role)) {
        return { error: "Le rôle est invalide. Il doit être 'contributeur', 'explorateur' ou 'moderateur'." };
      }

      // if (!userData.photoProfil) {
      //   return { error: "La photo de profil est obligatoire." };
      // }

      // Vérifier si le pseudo est unique avant l'ajout
      const pseudoExists = await checkPseudoExists(userData.pseudo);
      if (pseudoExists) {
        return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
      }

      // Générer un ID utilisateur unique si absent
      const userId = userData.idUtilisateur || `user_${Date.now()}`;

      // Création de l'objet utilisateur avec formatage
      const formattedUser = {
        idUtilisateur: userId,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email.toLowerCase(),
        pseudo: userData.pseudo.toLowerCase(),
        role: userData.role,
        dateInscription: userData.dateInscription || new Date(),
        photoProfil: userData.photoProfil,
      };

      // Ajout dans Firestore
      const userRef = doc(db, dbTables.USERS, userId);
      await setDoc(userRef, formattedUser);

      console.log(`Utilisateur ajouté avec l'ID : ${userId}`);
      return { success: true, userId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Modifier son propre compte uniquement
  editUser: async (userId, requesterId, updatedData) => {
    if (!userId || !requesterId) return { error: "Vous devez être connecté pour modifier votre compte." };
    if (userId !== requesterId) return { error: "Vous n'avez pas la permission de modifier ce compte." };

    try {
      const formattedData = await formatUserData(updatedData);
      if (formattedData.error) return formattedData; 

      const userRef = doc(db, dbTables.USERS, userId);
      await updateDoc(userRef, formattedData);
      console.log(`Utilisateur ${userId} mis à jour avec succès.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error);
      return { error: "Une erreur est survenue lors de la modification." };
    }
  },

  // Supprimer un utilisateur (seulement lui-même ou un modérateur)
  deleteUser: async (userId, requesterId) => {
    if (!userId || !requesterId) return { error: "Vous devez être connecté pour supprimer un compte." };

    try {
      if (userId !== requesterId) {
        const requesterRole = await getUserRole(requesterId);
        if (requesterRole !== roles.moderateur) {
          return { error: "Vous n'avez pas la permission de supprimer ce compte." };
        }
      }

      await updateUserReferences(userId); 
      await updateSpotsReferences(userId);

      const userRef = doc(db, dbTables.USERS, userId);
      await deleteDoc(userRef);
      console.log(`Utilisateur ${userId} supprimé avec mise à jour des références.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return { error: "Impossible de supprimer cet utilisateur." };
    }
  }
};

export default UserRepository;

