/*
* Crée le 13 mars 2025
* Gestion des FAVORIS Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Vérifier si un utilisateur existe
const checkUserExists = async (userId) => {
  const userRef = doc(db, "utilisateurs", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists();
};

// Vérifier si un spot existe
const checkSpotExists = async (spotId) => {
  const spotRef = doc(db, "spots", spotId);
  const spotDoc = await getDoc(spotRef);
  return spotDoc.exists();
};

// Vérifier si un favori existe déjà pour cet utilisateur et ce spot
const checkFavoriExists = async (userId, spotId) => {
  const favorisQuery = query(collection(db, "favoris"), where("idUtilisateur", "==", userId), where("idSpot", "==", spotId));
  const favorisSnapshot = await getDocs(favorisQuery);
  return !favorisSnapshot.empty;
};

// Vérifier le rôle d'un utilisateur
const getUserRole = async (userId) => {
  if (!userId) return null;
  const userRef = doc(db, "utilisateurs", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().role : null;
};

// Supprimer les favoris liés à un utilisateur supprimé
const deleteFavorisByUser = async (userId) => {
  const favorisQuery = query(collection(db, "favoris"), where("idUtilisateur", "==", userId));
  const favorisSnapshot = await getDocs(favorisQuery);
  favorisSnapshot.forEach(async (favori) => {
    await deleteDoc(doc(db, "favoris", favori.id));
  });
};

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
    if (!userId) return { error: "Vous devez être connecté pour ajouter un favori." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return { error: "Seuls les contributeurs et modérateurs peuvent ajouter un favori." };
      }

      // Vérification des clés étrangères
      if (!(await checkUserExists(userId))) {
        return { error: "L'utilisateur spécifié n'existe pas." };
      }
      if (!(await checkSpotExists(spotId))) {
        return { error: "Le spot spécifié n'existe pas." };
      }

      // Vérification si le favori existe déjà
      if (await checkFavoriExists(userId, spotId)) {
        return { error: "Ce spot est déjà enregistré dans vos favoris." };
      }

      const favoriId = await generateFavoriId();
      const favoriRef = doc(db, "favoris", favoriId);
      await setDoc(favoriRef, { idFavori: favoriId, idUtilisateur: userId, idSpot: spotId, timestamp: new Date() });

      console.log(`Favori ajouté avec l'ID : ${favoriId}`);
      return { success: true, favoriId };
    } catch (error) {
      console.error("Erreur lors de l'ajout du favori :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Supprimer un favori (seulement si je suis le propriétaire)
  deleteFavori: async (favoriId, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour supprimer un favori." };

    try {
      const favoriRef = doc(db, "favoris", favoriId);
      const favoriSnapshot = await getDoc(favoriRef);

      if (!favoriSnapshot.exists()) {
        return { error: "Favori non trouvé." };
      }

      const favoriData = favoriSnapshot.data();
      if (favoriData.idUtilisateur !== userId) {
        return { error: "Vous ne pouvez supprimer que vos propres favoris." };
      }

      await deleteDoc(favoriRef);
      console.log(`Favori ${favoriId} supprimé.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression du favori :", error);
      return { error: "Impossible de supprimer ce favori." };
    }
  }
};

export default FavoriRepository;
