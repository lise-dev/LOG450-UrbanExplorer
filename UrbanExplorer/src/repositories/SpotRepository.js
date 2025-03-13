/*
 * Crée le 12 mars 2025
 * Gestion des spots Firebase UrbanExplorer
 */

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Générer un ID spot formaté automatiquement (spot_001, spot_002)
const generateSpotId = async () => {
  const querySnapshot = await getDocs(collection(db, "spots"));
  const spotCount = querySnapshot.size + 1;
  return `spot_${String(spotCount).padStart(3, "0")}`;
};

// Vérifier le rôle d'un utilisateur
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

// Vérifier si les coordonnées sont valides
const isValidCoordinates = (coords) => {
  return (
    coords &&
    typeof coords.latitude === "number" &&
    typeof coords.longitude === "number" &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
};

// Vérifier si un champ ne contient que des lettres et des chiffres
const isValidText = (text) => {
  const regex = /^[a-zA-Z0-9\s]+$/; 
  return text && regex.test(text);
};

// Forcer les entrées en minuscules et valider les champs
const formatSpotData = (spotData) => {
  if (!spotData.nom || !isValidText(spotData.nom)) {
    return { error: "Le champ 'nom' est obligatoire et doit contenir uniquement des lettres et chiffres." };
  }

  if (!spotData.coordonnees || !isValidCoordinates(spotData.coordonnees)) {
    return { error: "Les coordonnées GPS sont obligatoires et doivent être valides." };
  }

  if (!spotData.type || !isValidText(spotData.type)) {
    return { error: "Le champ 'type' est obligatoire et doit contenir uniquement des lettres et chiffres." };
  }

  return {
    nom: spotData.nom.toLowerCase(),
    coordonnees: spotData.coordonnees,
    type: spotData.type.toLowerCase(),
    description: spotData.description ? spotData.description.toLowerCase() : null, 
  };
};

// Repository pour les spots
const SpotRepository = {
  // Récupérer tous les spots 
  getSpots: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "spots"));
      return querySnapshot.docs.map(doc => ({ idSpot: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des spots :", error);
      return [];
    }
  },

  // Ajouter un spot (contributeur ou modérateur)
  addSpot: async (newSpot, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour ajouter un spot." };

    try {
      const userRole = await getUserRole(userId);
      if (!userRole) return { error: "Utilisateur introuvable. Veuillez vous reconnecter." };
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission d'ajouter un spot." };
      }

      if (!newSpot.nom || !newSpot.coordonnees || !newSpot.type) {
        return { error: "Tous les champs (nom, coordonnées, type) sont obligatoires." };
      }

      if (!isValidCoordinates(newSpot.coordonnees)) {
        return { error: "Les coordonnées GPS sont invalides." };
      }

      const formattedSpot = formatSpotData(newSpot);
      if (!formattedSpot.nom || !formattedSpot.type) {
        return { error: "Le nom et le type ne doivent contenir que des lettres et des chiffres." };
      }

      const spotId = await generateSpotId();
      const spotRef = doc(db, "spots", spotId);
      await setDoc(spotRef, { idSpot: spotId, ajoutePar: userId, dateAjout: new Date(), ...formattedSpot });

      console.log(`Spot ajouté avec l'ID : ${spotId}`);
      return { success: true, spotId };
    } catch (error) {
      console.error("Erreur lors de l'ajout du spot :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Modifier un spot (proprietaire du spot ou un modérateur)
  editSpot: async (spotId, userId, updatedData) => {
    if (!userId) return { error: "Vous devez être connecté pour modifier un spot." };

    try {
      const spotRef = doc(db, "spots", spotId);
      const spotSnapshot = await getDoc(spotRef);

      if (!spotSnapshot.exists()) {
        return { error: "Spot non trouvé." };
      }

      const spotData = spotSnapshot.data();
      const userRole = await getUserRole(userId);

      if (spotData.ajoutePar !== userId && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission de modifier ce spot." };
      }

      if (updatedData.coordonnees && !isValidCoordinates(updatedData.coordonnees)) {
        return { error: "Les coordonnées GPS sont invalides." };
      }

      const formattedData = formatSpotData(updatedData);
      if ((updatedData.nom && !formattedData.nom) || (updatedData.type && !formattedData.type)) {
        return { error: "Le nom et le type ne doivent contenir que des lettres et des chiffres." };
      }

      await updateDoc(spotRef, formattedData);
      console.log(`Spot ${spotId} mis à jour avec succès.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification du spot :", error);
      return { error: "Une erreur est survenue lors de la modification." };
    }
  },

  // Supprimer un spot (proprietaire du spot ou un modérateur)
  deleteSpot: async (spotId, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour supprimer un spot." };

    try {
      const spotRef = doc(db, "spots", spotId);
      const spotSnapshot = await getDoc(spotRef);

      if (!spotSnapshot.exists()) {
        return { error: "Spot non trouvé." };
      }

      const spotData = spotSnapshot.data();
      const userRole = await getUserRole(userId);

      if (spotData.ajoutePar !== userId && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission de supprimer ce spot." };
      }

      await deleteDoc(spotRef);
      console.log(`Spot ${spotId} supprimé.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression du spot :", error);
      return { error: "Impossible de supprimer ce spot." };
    }
  }
};

export default SpotRepository;
