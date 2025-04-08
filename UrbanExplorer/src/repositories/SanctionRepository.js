/*
* Crée le 19 mars 2025
* Gestion des SANCTIONS Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { checkUserExists, isValidSanctionLevel, isValidDate, getUserRole}  from "../utils/validators"; 
import roles from "../constants/roles";
import { Guid } from "js-guid";

// Générer un ID sanction formaté automatiquement (sanction_001, sanction_002...)
const generateSanctionId = async () => {
  return `sanction_${Guid.newGuid()}`;
};

// Supprimer toutes les sanctions d'un utilisateur supprimé
const deleteSanctionsByUser = async (userId) => {
  const sanctionsQuery = query(collection(db, "sanctions"), where("idUtilisateur", "==", userId));
  const sanctionsSnapshot = await getDocs(sanctionsQuery);
  sanctionsSnapshot.forEach(async (sanction) => {
    await deleteDoc(doc(db, "sanctions", sanction.id));
  });
};

// Repository pour les sanctions
const SanctionRepository = {
  // Récupérer toutes les sanctions d'un utilisateur ou toutes pour un modérateur
  getSanctions: async (userId) => {
    if (!userId) return { error: "Vous devez être connecté pour voir vos sanctions." };

    try {
      const userRole = await getUserRole(userId);
      const sanctionsQuery = userRole === roles.moderateur
        ? collection(db, "sanctions") // Récupérer toutes les sanctions pour un modérateur
        : query(collection(db, "sanctions"), where("idUtilisateur", "==", userId));

      const querySnapshot = await getDocs(sanctionsQuery);
      return querySnapshot.docs.map(doc => ({ idSanction: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des sanctions :", error);
      return [];
    }
  },

  // Ajouter une sanction (uniquement pour modérateurs)
  addSanction: async (moderatorId, userId, motif, niveau, dateExpiration) => {
    if (!moderatorId || !userId) return { error: "Les utilisateurs doivent être valides." };

    try {
      const moderatorRole = await getUserRole(moderatorId);
      if (moderatorRole !== roles.moderateur) {
        return { error: "Seuls les modérateurs peuvent attribuer une sanction." };
      }

      if (!(await checkUserExists(userId))) {
        return { error: "L'utilisateur sanctionné n'existe pas." };
      }

      if (!motif || typeof motif !== "string" || motif.trim().length === 0) {
        return { error: "Le motif est obligatoire et doit être valide." };
      }

      if (!isValidSanctionLevel(niveau)) {
        return { error: "Le niveau de sanction est invalide. Choisissez 'Avertissement', 'Suspension Temporaire' ou 'Bannissement'." };
      }

      if (!isValidDate(dateExpiration, niveau)) {
        return { error: "La date d'expiration est invalide. Elle est obligatoire sauf pour un bannissement." };
      }

      const sanctionId = await generateSanctionId();
      const formattedSanction = {
        idSanction: sanctionId,
        idModerateur: moderatorId,
        idUtilisateur: userId,
        motif: motif.toLowerCase(),
        niveau: niveau.toLowerCase(),
        dateExpiration: dateExpiration ? new Date(dateExpiration) : null,
        timestamp: new Date(),
      };

      const sanctionRef = doc(db, "sanctions", sanctionId);
      await setDoc(sanctionRef, formattedSanction);

      console.log(`Sanction ajoutée avec l'ID : ${sanctionId}`);
      return { success: true, sanctionId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la sanction :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  }
};

export default SanctionRepository;
