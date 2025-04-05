import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig'; // Assurez-vous d'importer correctement votre configuration Firebase
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { dbTables } from './src/constants/dbInfo';


// Créez le contexte pour l'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      setUser(userAuth);
      if (userAuth) {
        const userId = userAuth.uid;
        try {
          const docRef = doc(db, dbTables.USERS, userId);

          onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              console.log("Utilisateur mis à jour");
              setUserData(docSnap.data())
            } else {
              console.log("Aucun user trouvé");
            }
          })

        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      } else {
        setUserData(null); // Si l'utilisateur n'est pas connecté, réinitialiser les données
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <AuthContext.Provider value={{ user, userData, setUser, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
