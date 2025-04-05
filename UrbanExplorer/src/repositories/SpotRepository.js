/*
 * Crée le 12 mars 2025
 * Gestion des SPOTS Firebase UrbanExplorer
 */

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { isValidCoordinates, isValidText, getUserRole}  from "../utils/validators"; 
import { dbTables } from "../constants/dbInfo";

// Générer un ID spot formaté automatiquement (spot_001, spot_002)
const generateSpotId = async () => {
  const querySnapshot = await getDocs(collection(db, dbTables.SPOTS));
  const spotCount = querySnapshot.size + 1;
  return `spot_${String(spotCount).padStart(3, "0")}`;
};

// Supprimer les avis, signalements, favoris et photos liés à un spot supprimé
const deleteRelatedSpotData = async (spotId) => {
  const collectionsToDeleteFrom = ["avis", "signalements", "favoris", "photos"];
  for (const collectionName of collectionsToDeleteFrom) {
    const querySnap = await getDocs(query(collection(db, collectionName), where("idSpot", "==", spotId)));
    querySnap.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, collectionName, docSnapshot.id));
    });
  }
};

// Mettre à jour le champ `ajoutePar` à `"Utilisateur supprimé"` si l'utilisateur est supprimé
const updateSpotsOnUserDeletion = async (userId) => {
  const spotsQuery = query(collection(db, dbTables.SPOTS), where("ajoutePar", "==", userId));
  const spotsSnapshot = await getDocs(spotsQuery);
  spotsSnapshot.forEach(async (spot) => {
    await updateDoc(doc(db, dbTables.SPOTS, spot.id), { ajoutePar: "Utilisateur supprimé" });
  });
};

// Repository pour les spots
const SpotRepository = {
  // Récupérer tous les spots 
  getSpots: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, dbTables.SPOTS));
      return querySnapshot.docs.map(doc => ({ idSpot: doc.id, ...doc.data() }));;
    } catch (error) {
      console.error("Erreur lors de la récupération des spots :", error);
      return [];
    }
  },

  // Ajouter un spot (seulement contributeur ou modérateur)
  addSpot: async (newSpot, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour ajouter un spot." };

    try {
      const userRole = await getUserRole(userId);
      if (!userRole) return { error: "Utilisateur introuvable. Veuillez vous reconnecter." };
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission d'ajouter un spot." };
      }

      if (!isValidText(newSpot.nom) || !isValidText(newSpot.type) || !isValidCoordinates(newSpot.coordonnees)) {
        return { error: "Nom, type et coordonnées sont obligatoires et doivent être valides." };
      }

      const spotId = await generateSpotId();
      const formattedSpot = {
        idSpot: spotId,
        nom: newSpot.nom.toLowerCase(),
        coordonnees: newSpot.coordonnees,
        type: newSpot.type.toLowerCase(),
        description: newSpot.description ? newSpot.description.toLowerCase() : null, 
        ajoutePar: userId,
        dateAjout: new Date(),
      };

      const spotRef = doc(db, dbTables.SPOTS, spotId);
      await setDoc(spotRef, formattedSpot);

      console.log(`Spot ajouté avec l'ID : ${spotId}`);
      return { success: true, spotId };
    } catch (error) {
      console.error("Erreur lors de l'ajout du spot :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Supprimer un spot (propriétaire du spot ou modérateur)
  deleteSpot: async (spotId, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour supprimer un spot." };

    try {
      const spotRef = doc(db, dbTables.SPOTS, spotId);
      const spotSnapshot = await getDoc(spotRef);

      if (!spotSnapshot.exists()) {
        return { error: "Spot non trouvé." };
      }

      const spotData = spotSnapshot.data();
      const userRole = await getUserRole(userId);

      if (spotData.ajoutePar !== userId && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission de supprimer ce spot." };
      }

      await deleteRelatedSpotData(spotId);
      await deleteDoc(spotRef);
      console.log(`Spot ${spotId} supprimé avec toutes ses données associées.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression du spot :", error);
      return { error: "Impossible de supprimer ce spot." };
    }
  },

  // Mettre à jour les spots si un utilisateur est supprimé
  updateSpotsOnUserDeletion: updateSpotsOnUserDeletion
};

export default SpotRepository;
