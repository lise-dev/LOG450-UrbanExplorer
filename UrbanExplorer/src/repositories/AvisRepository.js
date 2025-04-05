/*
* Crée le 12 mars 2025
* Gestion des AVIS utilisateurs Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { getUserRole, isValidNote, isValidText, getUserRole }  from "../utils/validators"; 
import { dbTables } from "../constants/dbInfo";

// Générer un ID avis formaté automatiquement 
const generateAvisId = async () => {
  const querySnapshot = await getDocs(collection(db, dbTables.AVIS));
  const avisCount = querySnapshot.size + 1;
  return `avis_${String(avisCount).padStart(3, "0")}`;
};

// Supprimer les signalements liés à un avis
const deleteSignalementsByAvis = async (avisId) => {
  const signalementsQuery = query(collection(db, dbTables.REPORTS), where("idContenu", "==", avisId));
  const signalementsSnapshot = await getDocs(signalementsQuery);
  signalementsSnapshot.forEach(async (signalement) => {
    await deleteDoc(doc(db, dbTables.REPORTS, signalement.id));
  });
};

// Repository pour les avis
const AvisRepository = {
  // Récupérer tous les avis
  getAvis: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, dbTables.AVIS));
      return querySnapshot.docs.map(doc => ({ idAvis: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
      return [];
    }
  },

  // Ajouter un avis (uniquement pour contributeur ou modérateur)
  addAvis: async (newAvis, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour ajouter un avis." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission d'ajouter un avis." };
      }

      const formattedAvis = {
        idUtilisateur: userId,
        idSpot: newAvis.idSpot,
        texte: newAvis.texte.toLowerCase(),
        note: newAvis.note,
        timestamp: new Date(),
      };

      const avisId = await generateAvisId();
      const avisRef = doc(db, dbTables.AVIS, avisId);
      await setDoc(avisRef, { idAvis: avisId, ...formattedAvis });

      console.log(`Avis ajouté avec l'ID : ${avisId}`);
      return { success: true, avisId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Modifier un avis (seulement si je suis le propriétaire ou un modérateur)
  editAvis: async (avisId, userId, updatedData) => {
    try {
      const avisRef = doc(db, dbTables.AVIS, avisId);
      const avisSnapshot = await getDoc(avisRef);

      if (!avisSnapshot.exists()) {
        return { error: "Avis non trouvé." };
      }

      const avisData = avisSnapshot.data();
      const userRole = await getUserRole(userId);

      if (avisData.idUtilisateur !== userId && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission de modifier cet avis." };
      }

      // Vérifications
      if (updatedData.texte && !isValidText(updatedData.texte)) {
        return { error: "Le texte de l'avis doit être valide." };
      }
      if (updatedData.note && !isValidNote(updatedData.note)) {
        return { error: "La note doit être entre 1 et 5." };
      }

      // Mise à jour
      await updateDoc(avisRef, {
        ...updatedData,
        texte: updatedData.texte ? updatedData.texte.toLowerCase() : avisData.texte,
        timestamp: new Date(),
      });

      console.log(`Avis ${avisId} mis à jour avec succès.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification de l'avis :", error);
      return { error: "Une erreur est survenue lors de la modification." };
    }
  },

  // Supprimer un avis et les signalements associés
  deleteAvis: async (avisId, userId) => {
    try {
      const avisRef = doc(db, dbTables.AVIS, avisId);
      const avisSnapshot = await getDoc(avisRef);
      
      if (!avisSnapshot.exists()) {
        return { error: "Avis non trouvé." };
      }

      const avisData = avisSnapshot.data();
      if (avisData.idUtilisateur !== userId) {
        return { error: "Vous n'avez pas la permission de supprimer cet avis." };
      }

      await deleteSignalementsByAvis(avisId);
      await deleteDoc(avisRef);
      console.log(`Avis ${avisId} supprimé.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
      return { error: "Impossible de supprimer cet avis." };
    }
  }
};

export default AvisRepository;
