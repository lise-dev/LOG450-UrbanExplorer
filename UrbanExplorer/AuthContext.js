import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig'; // Assurez-vous d'importer correctement votre configuration Firebase
import { doc, getDoc } from 'firebase/firestore'


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
          const docRef = doc(db, 'utilisateurs', userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data()); // Récupère et stocke les données utilisateur
          } else {
            console.log('Aucun utilisateur trouvé');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      } else {
        setUserData(null); // Si l'utilisateur n'est pas connecté, réinitialiser les données
      }
    });

    return () => unsubscribe();
  }, []);

  // const [user, setUser] = useState(null);
  // const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const unsubscribeAuth = auth.onAuthStateChanged((userAuth) => {
  //     setUser(userAuth);
  //     if (userAuth) {
  //       const userId = userAuth.uid;
  //       const docRef = doc(db, 'utilisateurs', userId);

  //       // Écoute en temps réel les modifications du document utilisateur
  //       const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
  //         if (docSnap.exists()) {
  //           setUserData(docSnap.data());
  //         } else {
  //           setUserData(null);
  //           console.log('Aucun utilisateur trouvé');
  //         }
  //       });

  //       return () => unsubscribeSnapshot(); // Se désinscrire du snapshot lors du cleanup
  //     } else {
  //       setUserData(null);
  //     }
  //   });

  //   return () => unsubscribeAuth();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, userData, setUser, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
