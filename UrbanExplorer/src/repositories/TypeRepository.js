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
        return snapshot.docs.map((doc) => ({ idType: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Erreur lors de la récupération des types :", error);
        return [];
      }
    },
  
  };
  
  export default TypeRepository;
  