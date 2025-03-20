/*
* Crée le 16 mars 2025
* Gestion des SIGNALEMENTS Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, updateDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { checkUserExists, checkContentExistsAvisSpots, isValidText, isValidCategory,getUserRole}  from "../utils/validators"; 

// Générer un ID signalement formaté automatiquement (signalement_001, signalement_002...)
const generateSignalementId = async () => {
  const querySnapshot = await getDocs(collection(db, "signalements"));
  const signalementCount = querySnapshot.size + 1;
  return `signalement_${String(signalementCount).padStart(3, "0")}`;
};

// Repository pour les signalements
const SignalementRepository = {
  // Récupérer tous les signalements (uniquement pour modérateurs)
  getSignalements: async (userId) => {
    if (!userId) return { error: "Vous devez être connecté pour voir les signalements." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "moderateur") {
        return { error: "Seuls les modérateurs peuvent voir les signalements." };
      }

      const querySnapshot = await getDocs(collection(db, "signalements"));
      return querySnapshot.docs.map(doc => ({ idSignalement: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements :", error);
      return [];
    }
  },

  // Ajouter un signalement (seulement contributeur ou modérateur)
  addSignalement: async (newSignalement, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour signaler un contenu." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return { error: "Vous n'avez pas la permission de signaler un contenu." };
      }

      if (!isValidCategory(newSignalement.categorieContenu) || !(await checkContentExistsAvisSpots(newSignalement.categorieContenu, newSignalement.idContenu))) {
        return { error: "Le contenu signalé n'existe pas ou la catégorie est invalide." };
      }

      if (!isValidText(newSignalement.raison)) {
        return { error: "La raison du signalement est invalide." };
      }

      const signalementId = await generateSignalementId();
      const formattedSignalement = {
        idSignalement: signalementId,
        idUtilisateur: userId,
        categorieContenu: newSignalement.categorieContenu.toLowerCase(),
        idContenu: newSignalement.idContenu,
        raison: newSignalement.raison.toLowerCase(),
        statut: "en attente",
        timestamp: new Date(),
      };

      const signalementRef = doc(db, "signalements", signalementId);
      await setDoc(signalementRef, formattedSignalement);

      console.log(`Signalement ajouté avec l'ID : ${signalementId}`);
      return { success: true, signalementId };
    } catch (error) {
      console.error("Erreur lors de l'ajout du signalement :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Modifier un signalement (seulement par un modérateur)
  editSignalement: async (signalementId, userId, updatedData) => {
    if (!userId) return { error: "Vous devez être connecté pour modifier un signalement." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "moderateur") {
        return { error: "Seuls les modérateurs peuvent modifier un signalement." };
      }

      const signalementRef = doc(db, "signalements", signalementId);
      const signalementSnapshot = await getDoc(signalementRef);

      if (!signalementSnapshot.exists()) {
        return { error: "Signalement non trouvé." };
      }

      if (!isValidText(updatedData.statut)) {
        return { error: "Le statut est invalide." };
      }

      await updateDoc(signalementRef, { statut: updatedData.statut.toLowerCase() });
      console.log(`Signalement ${signalementId} mis à jour avec succès.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification du signalement :", error);
      return { error: "Une erreur est survenue lors de la modification." };
    }
  }
};

export default SignalementRepository;
