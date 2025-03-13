/*
* Crée le 12 mars 2025
* Gestion des Avis Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Vérifier si un utilisateur existe
const checkUserExists = async (userId) => {
  try {
    const userRef = doc(db, "utilisateurs", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur :", error);
    return false;
  }
};

// Vérifier si un spot existe
const checkSpotExists = async (spotId) => {
  try {
    const spotRef = doc(db, "spots", spotId);
    const spotDoc = await getDoc(spotRef);
    return spotDoc.exists();
  } catch (error) {
    console.error("Erreur lors de la vérification du spot :", error);
    return false;
  }
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

// Vérifier si la note est valide (entre 1 et 5)
const isValidNote = (note) => {
  return typeof note === "number" && note >= 1 && note <= 5;
};

// Vérifier si un texte est valide
const isValidText = (text) => {
  return typeof text === "string" && text.trim().length > 0;
};

// Générer un ID avis formaté automatiquement 
const generateAvisId = async () => {
  const querySnapshot = await getDocs(collection(db, "avis"));
  const avisCount = querySnapshot.size + 1;
  return `avis_${String(avisCount).padStart(3, "0")}`;
};

// Forcer les entrées en minuscule et valider les champs
const formatAvisData = async (avisData) => {
  if (!avisData.texte || !isValidText(avisData.texte)) {
    return { error: "Le champ 'texte' est obligatoire et doit être valide." };
  }

  if (!avisData.note || !isValidNote(avisData.note)) {
    return { error: "La note est obligatoire et doit être comprise entre 1 et 5." };
  }

  // Vérification des clés étrangères
  const userExists = await checkUserExists(avisData.idUtilisateur);
  if (!userExists) {
    return { error: "L'utilisateur spécifié n'existe pas." };
  }

  const spotExists = await checkSpotExists(avisData.idSpot);
  if (!spotExists) {
    return { error: "Le spot spécifié n'existe pas." };
  }

  return {
    idUtilisateur: avisData.idUtilisateur,
    idSpot: avisData.idSpot,
    texte: avisData.texte.toLowerCase(),
    note: avisData.note,
    timestamp: avisData.timestamp || new Date(),
  };
};

// Repository pour les avis
const AvisRepository = {
  // Récupérer tous les avis
  getAvis: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "avis"));
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

      const formattedAvis = await formatAvisData({ ...newAvis, idUtilisateur: userId });
      if (formattedAvis.error) return formattedAvis;

      const avisId = await generateAvisId();
      const avisRef = doc(db, "avis", avisId);
      await setDoc(avisRef, { idAvis: avisId, ...formattedAvis });

      console.log(`Avis ajouté avec l'ID : ${avisId}`);
      return { success: true, avisId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },
};

export default AvisRepository;
