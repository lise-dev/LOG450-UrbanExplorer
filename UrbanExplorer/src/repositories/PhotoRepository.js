/*
* Crée le 17 mars 2025
* Gestion des PHOTOS Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { checkContentExists, isValidImageUrl, getUserRole}  from "../utils/validators"; 

// Supprimer les photos liées à un spot supprimé
const deletePhotosBySpot = async (spotId) => {
  const photosQuery = query(collection(db, "photos"), where("idContenu", "==", spotId));
  const photosSnapshot = await getDocs(photosQuery);
  photosSnapshot.forEach(async (photo) => {
    await deleteDoc(doc(db, "photos", photo.id));
  });
};

// Supprimer les photos liées à un avis supprimé
const deletePhotosByAvis = async (avisId) => {
  const photosQuery = query(collection(db, "photos"), where("idContenu", "==", avisId));
  const photosSnapshot = await getDocs(photosQuery);
  photosSnapshot.forEach(async (photo) => {
    await deleteDoc(doc(db, "photos", photo.id));
  });
};

// Repository pour les photos
const PhotoRepository = {
  // Récupérer toutes les photos liées à un contenu
  getPhotosByContent: async (typeContenu, idContenu) => {
    try {
      const photosQuery = query(collection(db, "photos"), where("typeContenu", "==", typeContenu), where("idContenu", "==", idContenu));
      const querySnapshot = await getDocs(photosQuery);
      return querySnapshot.docs.map(doc => ({ idPhoto: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des photos :", error);
      return [];
    }
  },

  // Ajouter une photo (uniquement pour contributeur ou modérateur)
  addPhoto: async (newPhoto, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour ajouter une photo." };

    try {
      const userRole = await getUserRole(userId);
      if (userRole !== "contributeur" && userRole !== "moderateur") {
        return { error: "Seuls les contributeurs et modérateurs peuvent ajouter une photo." };
      }

      if (!isValidImageUrl(newPhoto.url)) {
        return { error: "L'URL de l'image est invalide. Formats acceptés : jpg, jpeg, png." };
      }

      if (!(await checkContentExists(newPhoto.typeContenu, newPhoto.idContenu))) {
        return { error: "Le contenu spécifié n'existe pas." };
      }

      const photoId = `photo_${Date.now()}`;
      const formattedPhoto = {
        idPhoto: photoId,
        typeContenu: newPhoto.typeContenu.toLowerCase(),
        idContenu: newPhoto.idContenu,
        url: `picture/photos/${newPhoto.url.toLowerCase()}`,
        timestamp: new Date(),
      };

      const photoRef = doc(db, "photos", photoId);
      await setDoc(photoRef, formattedPhoto);

      console.log(`Photo ajoutée avec l'ID : ${photoId}`);
      return { success: true, photoId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Supprimer une photo (seulement si elle n'est pas référencée ailleurs)
  deletePhoto: async (photoId, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour supprimer une photo." };

    try {
      const photoRef = doc(db, "photos", photoId);
      const photoSnapshot = await getDoc(photoRef);

      if (!photoSnapshot.exists()) {
        return { error: "Photo non trouvée." };
      }

      await deleteDoc(photoRef);
      console.log(`Photo ${photoId} supprimée.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo :", error);
      return { error: "Impossible de supprimer cette photo." };
    }
  }
};

export default PhotoRepository;
