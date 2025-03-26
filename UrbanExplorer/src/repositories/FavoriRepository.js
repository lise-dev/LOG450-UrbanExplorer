/*
* Crée le 13 mars 2025
* Gestion des FAVORIS Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import {getUserRole, checkPseudoExists, checkFavoriExists, checkSpotExists, checkUserExists} from "../utils/validators";

// Générer un ID favori formaté automatiquement 
const generateFavoriId = async () => {
  const querySnapshot = await getDocs(collection(db, "favoris"));
  const favoriCount = querySnapshot.size + 1;
  return `favori_${String(favoriCount).padStart(3, "0")}`;
};

// Repository pour les favoris
const FavoriRepository = {
  // Récupérer tous les favoris d'un utilisateur (accès uniquement aux siens)
  getFavoris: async (userId) => {
    if (!userId) return { error: "Vous devez être connecté pour voir vos favoris." };

    try {
      const favorisQuery = query(collection(db, "favoris"), where("idUtilisateur", "==", userId));
      const querySnapshot = await getDocs(favorisQuery);
      return querySnapshot.docs.map(doc => ({ idFavori: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris :", error);
      return [];
    }
  },

  // Ajouter un favori (seulement si le spot et l'utilisateur existent)
  addFavori: async (userId, spotId) => {
    if (!userId) return {success:false, message: "Vous devez être connecté pour ajouter un favori." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return {success:false, message: "Seuls les contributeurs et modérateurs peuvent ajouter un favori." };
      }

      // Vérification des clés étrangères
      if (!(await checkUserExists(userId))) {
        return {success:false, message: "L'utilisateur spécifié n'existe pas." };
      }
      if (!(await checkSpotExists(spotId))) {
        return {success:false,  message: "Le spot spécifié n'existe pas." };
      }

      // Vérification si le favori existe déjà
      if (await checkFavoriExists(userId, spotId)) {
        return {success:false, message: "Ce spot est déjà enregistré dans vos favoris." };
      }

      const favoriId = await generateFavoriId();
      const favoriRef = doc(db, "favoris", favoriId);
      await setDoc(favoriRef, { idFavori: favoriId, idUtilisateur: userId, idSpot: spotId, timestamp: new Date() });

      console.log(`Favori ajouté avec l'ID : ${favoriId}`);
      return { success: true, message:'Contenu ajouté à votre liste de favoris', favoriId };
    } catch (error) {
      console.error("Erreur lors de l'ajout du favori :", error);
      return {success: false, message: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Supprimer un favori (seulement si je suis le propriétaire)
  deleteFavori: async (favoriId, userId) => {
    if (!userId) return {success: false, message: "Vous devez être connecté pour supprimer un favori." };

    try {
      const favoriRef = doc(db, "favoris", favoriId);
      const favoriSnapshot = await getDoc(favoriRef);

      if (!favoriSnapshot.exists()) {
        return {success: false, message: "Favori non trouvé." };
      }

      const favoriData = favoriSnapshot.data();
      if (favoriData.idUtilisateur !== userId) {
        return {success: false, message: "Vous ne pouvez supprimer que vos propres favoris." };
      }
      await deleteDoc(favoriRef);
      console.log(`Favori ${favoriId} supprimé.`);
      return { success: true, message:'Contenu supprimé de votre liste de favoris.' };
    } catch (error) {
      console.error("Erreur lors de la suppression du favori :", error);
      return {success: false,  message: "Impossible de supprimer ce favori." };
    }
  },

  deleteFavoriteOfSpot: async (userId, spotId) => {
  if (!userId || !spotId) {
    return {
      success: false,
      message: "Utilisateur ou spot non valide."
    };
  }

  try {
    const favorisQuery = query(
        collection(db, "favoris"),
        where("idUtilisateur", "==", userId),
        where("idSpot", "==", spotId)
    );
    const favorisSnapshot = await getDocs(favorisQuery);

    if (favorisSnapshot.empty) {
      return {
        success: false,
        message: "Aucun favori trouvé pour ce spot."
      };
    }

    const favoriId = favorisSnapshot.docs[0].id;
    await deleteDoc(doc(db, "favoris", favoriId));

    return { success: true, message:'Contenu supprimé de votre liste de favoris.' };

  } catch (error) {
    console.error("Erreur suppression favori :", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du favori."
    };
  }
}
};

export default FavoriRepository;
