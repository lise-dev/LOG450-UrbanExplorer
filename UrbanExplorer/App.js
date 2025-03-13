import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from 'expo-status-bar';
import AuthRepository from "./src/repositories/AuthRepository";

export default function App() {
  const [user, setUser] = useState(null);

  /**
   * Vérifier la session Firebase au lancement
   * Permet de garder la session de l'utilisateur active
   */
  useEffect(() => {
    const unsubscribe = AuthRepository.observeUser(async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await AuthRepository.getUserProfile(firebaseUser.uid);
        if (userProfile.success) {
          setUser({ ...firebaseUser, ...userProfile.data }); 
        } else {
          setUser(firebaseUser); 
        }
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text>Bienvenue sur UrbanExplorer !</Text>
      {user ? (
        <View>
          <Text>Connecté en tant que : {user.email}</Text>
          <Button title="Se déconnecter" onPress={() => AuthRepository.logout()} />
        </View>
      ) : (
        <Text>Vous n'êtes pas connecté.</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
