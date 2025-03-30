import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import {PaperProvider} from "react-native-paper";
import {AuthProvider} from "./src/utils/AuthContext";
import DetailScreen from "./src/screens/DetailScreen";
import Toast from "react-native-toast-message";


const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {user ? `Bienvenue, ${user.displayName || user.email}` : "Accueil Urban Explorer"}
      </Text>

      {user ? (
        <TouchableOpacity style={styles.accountButton} onPress={() => signOut(auth)}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.accountButton} onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const App = () => {
  return (
      <AuthProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
              <Stack.Screen name="DetailScreen" component={DetailScreen} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast/>
        </PaperProvider>
      </AuthProvider>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  accountButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
