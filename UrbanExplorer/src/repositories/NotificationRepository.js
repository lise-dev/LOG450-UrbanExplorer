/*
* Crée le 14 mars 2025
* Gestion des NOTIFICATIONS Firebase UrbanExplorer
*/

import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Vérifier si un utilisateur existe
const checkUserExists = async (userId) => {
  const userRef = doc(db, "utilisateurs", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists();
};

// Supprimer toutes les notifications liées à un utilisateur supprimé
const deleteNotificationsByUser = async (userId) => {
  const notificationsQuery = query(collection(db, "notifications"), where("idUtilisateur", "==", userId));
  const notificationsSnapshot = await getDocs(notificationsQuery);
  notificationsSnapshot.forEach(async (notif) => {
    await deleteDoc(doc(db, "notifications", notif.id));
  });
};

// Générer un ID notification formaté automatiquement (notif_001, notif_002...)
const generateNotificationId = async () => {
  const querySnapshot = await getDocs(collection(db, "notifications"));
  const notificationCount = querySnapshot.size + 1;
  return `notif_${String(notificationCount).padStart(3, "0")}`;
};

// Repository pour les notifications
const NotificationRepository = {
  // Récupérer toutes les notifications d'un utilisateur
  getNotifications: async (userId) => {
    if (!userId) return { error: "Vous devez être connecté pour voir vos notifications." };

    try {
      const notificationsQuery = query(collection(db, "notifications"), where("idUtilisateur", "==", userId));
      const querySnapshot = await getDocs(notificationsQuery);
      return querySnapshot.docs.map(doc => ({ idNotification: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
      return [];
    }
  },

  // Ajouter une notification (générée automatiquement par le système)
  addNotification: async (userId, message) => {
    if (!userId) return { error: "L'utilisateur spécifié est invalide." };

    try {
      if (!(await checkUserExists(userId))) {
        return { error: "L'utilisateur spécifié n'existe pas." };
      }

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return { error: "Le message de la notification est invalide." };
      }

      const notificationId = await generateNotificationId();
      const formattedNotification = {
        idNotification: notificationId,
        idUtilisateur: userId,
        message: message.toLowerCase(),
        lu: false,
        timestamp: new Date(),
      };

      const notificationRef = doc(db, "notifications", notificationId);
      await setDoc(notificationRef, formattedNotification);

      console.log(`Notification ajoutée avec l'ID : ${notificationId}`);
      return { success: true, notificationId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la notification :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  },

  // Supprimer une notification (seulement si je suis le propriétaire)
  deleteNotification: async (notificationId, userId) => {
    if (!userId) return { error: "Vous devez être connecté pour supprimer une notification." };

    try {
      const notificationRef = doc(db, "notifications", notificationId);
      const notificationSnapshot = await getDoc(notificationRef);

      if (!notificationSnapshot.exists()) {
        return { error: "Notification non trouvée." };
      }

      const notificationData = notificationSnapshot.data();
      if (notificationData.idUtilisateur !== userId) {
        return { error: "Vous ne pouvez supprimer que vos propres notifications." };
      }

      await deleteDoc(notificationRef);
      console.log(`Notification ${notificationId} supprimée.`);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification :", error);
      return { error: "Impossible de supprimer cette notification." };
    }
  }
};

export default NotificationRepository;
