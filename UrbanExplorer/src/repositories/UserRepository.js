import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Générer un ID utilisateur formaté automatiquement (user_001, user_002...)
const generateUserId = async () => {
  const querySnapshot = await getDocs(collection(db, "utilisateurs"));
  const userCount = querySnapshot.size + 1;
  return `user_${String(userCount).padStart(3, "0")}`;
};

// Vérifier si un pseudo existe déjà en base
const checkPseudoExists = async (pseudo) => {
  try {
    const querySnapshot = await getDocs(collection(db, "utilisateurs"));
    return querySnapshot.docs.some(doc => doc.data().pseudo === pseudo);
  } catch (error) {
    console.error("Erreur lors de la vérification du pseudo :", error);
    return false;
  }
};

// Vérifier si un email est valide (doit contenir @ et .)
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Repository pour les utilisateurs
const UserRepository = {
  // 🔍 Récupérer tous les utilisateurs
  getUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "utilisateurs"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      return [];
    }
  },

  // ➕ Ajouter un utilisateur
  addUser: async (newUser) => {
    try {
      // Vérifier si l'email est valide
      if (!isValidEmail(newUser.email)) {
        return { error: "L'adresse email est invalide. Veuillez entrer un email valide." };
      }

      // Vérifier si le pseudo est déjà utilisé
      const pseudoExists = await checkPseudoExists(newUser.pseudo);
      if (pseudoExists) {
        return { error: "Ce pseudo est déjà utilisé. Veuillez en choisir un autre." };
      }

      // Générer un ID unique et ajouter l'utilisateur
      const userId = await generateUserId();
      const userRef = doc(db, "utilisateurs", userId);
      await setDoc(userRef, { idutilisateur: userId, ...newUser });

      console.log(`Utilisateur ajouté avec l'ID : ${userId}`);
      return { success: true, userId };
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      return { error: "Une erreur est survenue lors de l'ajout." };
    }
  }
};

export default UserRepository;
