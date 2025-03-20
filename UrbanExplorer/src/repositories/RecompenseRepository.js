/*
* Crée le 15 mars 2025
* Gestion des RECOMPENSES Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { checkUserExists, isValidRewardType, isValidPoints, getUserRole}  from "../utils/validators"; 

// Générer un ID récompense formaté automatiquement (reward_001, reward_002...)
const generateRewardId = async () => {
  const querySnapshot = await getDocs(collection(db, "recompenses"));
  const rewardCount = querySnapshot.size + 1;
  return `reward_${String(rewardCount).padStart(3, "0")}`;
};

// Repository pour les récompenses
const RecompenseRepository = {
  // Récupérer toutes les récompenses d'un utilisateur
  getRecompenses: async (userId) => {
    if (!userId) return { error: "Vous devez être connecté pour voir vos récompenses." };

    try {
      const recompensesQuery = query(collection(db, "recompenses"), where("idUtilisateur", "==", userId));
      const querySnapshot = await getDocs(recompensesQuery);
      return querySnapshot.docs.map(doc => ({ idRecompense: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des récompenses :", error);
      return [];
    }
  },

  // Ajouter une récompense (modérateurs)
  addRecompense: async (moderatorId, userId, type, description, points) => {
    if (!moderatorId || !userId) return { error: "Les utilisateurs doivent être valides." };

    try {
      // Vérifier que le modérateur est bien un modérateur
      const moderatorRole = await getUserRole(moderatorId);
      if (moderatorRole !== "moderateur") {
        return { error: "Seuls les modérateurs peuvent attribuer une récompense." };
      }

      // Vérifier que l'utilisateur destinataire existe et est contributeur ou modérateur
      const userRole = await checkUserExists(userId);
      if (!userRole || (userRole !== "contributeur" && userRole !== "moderateur")) {
        return { error: "L'utilisateur doit être contributeur ou modérateur pour recevoir une récompense." };
      }

      if (!isValidRewardType(type)) {
        return { error: "Le type de récompense est invalide. Il doit être 'badge' ou 'points'." };
      }

      if (!description || typeof description !== "string" || description.trim().length === 0) {
        return { error: "La description est obligatoire et doit être valide." };
      }

      if (!isValidPoints(points)) {
        return { error: "Les points doivent être un nombre positif." };
      }

      const rewardId = await generateRewardId();
      const formattedRecompense = {
        idRecompense: rewardId,
        idModerateur: moderatorId,
        idUtilisateur: userId,
        type: type.toLowerCase(),
        description: description.toLowerCase(),
        points: points,
        timestamp: new Date(),
      };

      const recompenseRef = doc(db, "recompenses", rewardId);
      await setDoc(recompenseRef, formattedRecompense);

      console.log(`Récompense ajoutée avec l'ID : ${rewardId}`);
      return { success: true, rewardId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la récompense :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Supprimer une récompense (seulement par un modérateur)
  deleteRecompense: async (rewardId, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour supprimer une récompense." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "moderateur") {
        return { error: "Seuls les modérateurs peuvent supprimer une récompense." };
      }

      const recompenseRef = doc(db, "recompenses", rewardId);
      await deleteDoc(recompenseRef);
      console.log(`Récompense ${rewardId} supprimée.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de la récompense :", error);
      return { error: "Impossible de supprimer cette récompense." };
    }
  }
};

export default RecompenseRepository;
