import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../../firebaseConfig";
  import {
    getUserRole,
    checkFavoriExists,
    checkSpotExists,
    checkUserExists,
  } from "../utils/validators";
  import { dbTables } from "../constants/dbInfo";
  
  
  const TypeRepository = {
    getTypes: async () => {
  
      try {
        const typesRef = collection(db, dbTables.TYPES);
        const snapshot = await getDocs(typesRef);
        // return snapshot.docs.map((doc) => ({ idType: doc.id, ...doc.data() }));
        return snapshot.docs.map((doc) => ({ idType: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Erreur lors de la récupération des types :", error);
        return [];
      }
    },
  
    // addFavori: async (userId, spotId) => {
    //   if (!userId)
    //     return {
    //       success: false,
    //       message: "Vous devez être connecté pour ajouter un favori.",
    //     };
  
    //   try {
    //     // const role = await getUserRole(userId);
    //     // if (!["contributeur", "moderateur"].includes(role)) {
    //     //   return {
    //     //     success: false,
    //     //     message: "Seuls les contributeurs et modérateurs peuvent ajouter un favori.",
    //     //   };
    //     // }
  
    //     if (!(await checkUserExists(userId)))
    //       return { success: false, message: "L'utilisateur spécifié n'existe pas." };
  
    //     if (!(await checkSpotExists(spotId)))
    //       return { success: false, message: "Le spot spécifié n'existe pas." };
  
    //     if (await checkFavoriExists(userId, spotId))
    //       return {
    //         success: false,
    //         message: "Ce spot est déjà enregistré dans vos favoris.",
    //       };
  
    //     const favoriId = await generateFavoriId(userId);
    //     const favoriRef = doc(db, dbTables.USERS, userId, "favoris", favoriId);
  
    //     await setDoc(favoriRef, {
    //       idFavori: favoriId,
    //       idUtilisateur: userId,
    //       idSpot: spotId,
    //       timestamp: new Date(),
    //     });
  
    //     return {
    //       success: true,
    //       message: "Contenu ajouté à votre liste de favoris",
    //       favoriId,
    //     };
    //   } catch (error) {
    //     console.error("Erreur lors de l'ajout du favori :", error);
    //     return {
    //       success: false,
    //       message: "Une erreur est survenue lors de l'ajout.",
    //     };
    //   }
    // },
  
    // deleteFavori: async (userId, favoriId) => {
    //   if (!userId)
    //     return { success: false, message: "Vous devez être connecté pour supprimer un favori." };
  
    //   try {
    //     const favoriRef = doc(db, dbTables.USERS, userId, "favoris", favoriId);
    //     const snapshot = await getDoc(favoriRef);
  
    //     if (!snapshot.exists()) {
    //       return { success: false, message: "Favori non trouvé." };
    //     }
  
    //     const data = snapshot.data();
    //     if (data.idUtilisateur !== userId) {
    //       return {
    //         success: false,
    //         message: "Vous ne pouvez supprimer que vos propres favoris.",
    //       };
    //     }
  
    //     await deleteDoc(favoriRef);
    //     return {
    //       success: true,
    //       message: "Contenu supprimé de votre liste de favoris.",
    //     };
    //   } catch (error) {
    //     console.error("Erreur lors de la suppression du favori :", error);
    //     return {
    //       success: false,
    //       message: "Impossible de supprimer ce favori.",
    //     };
    //   }
    // },
  
    // deleteFavoriteOfSpot: async (userId, spotId) => {
    //   if (!userId || !spotId) {
    //     return {
    //       success: false,
    //       message: "Utilisateur ou spot non valide.",
    //     };
    //   }
  
    //   try {
    //     const favorisRef = collection(db, dbTables.USERS, userId, "favoris");
    //     const q = query(favorisRef, where("idSpot", "==", spotId));
    //     const snapshot = await getDocs(q);
  
    //     if (snapshot.empty) {
    //       return {
    //         success: false,
    //         message: "Aucun favori trouvé pour ce spot.",
    //       };
    //     }
  
    //     const favoriId = snapshot.docs[0].id;
    //     await deleteDoc(doc(db, dbTables.USERS, userId, "favoris", favoriId));
  
    //     return {
    //       success: true,
    //       message: "Contenu supprimé de votre liste de favoris.",
    //     };
    //   } catch (error) {
    //     console.error("Erreur suppression favori :", error);
    //     return {
    //       success: false,
    //       message: "Erreur lors de la suppression du favori.",
    //     };
    //   }
    // },
  };
  
  export default TypeRepository;
  