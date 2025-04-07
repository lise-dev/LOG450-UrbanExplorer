// import React, {createContext, useContext, useEffect, useState} from 'react';
// import {onAuthStateChanged} from 'firebase/auth';
// import {auth} from '../../firebaseConfig';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [initializing, setInitializing] = useState(true);

//     useEffect(() => {
//         return onAuthStateChanged(auth, (firebaseUser) => {
//             setUser(firebaseUser);
//             setInitializing(false);
//         });
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, userId: user?.uid }}>
//             {!initializing && children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
