/*
* Crée le 19 mars 2025
* Écran de connexion
*/

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "902366533112-e45edtiul28q0u72copcbv7co1queuli.apps.googleusercontent.com",
    androidClientId: "902366533112-v5dq57sffg0cr9u7gtsbhdp2oodgujra.apps.googleusercontent.com",
    iosClientId: "902366533112-6n8ea8i3vj7lmodiq49pk5ftgg6rfm3q.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace("HomeScreen"))
        .catch(() => setErrorMessage("Erreur Firebase lors de la connexion Google."));
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("HomeScreen");
    } catch (error) {
      setErrorMessage("Email ou mot de passe incorrect.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Partie haute avec fond gris clair */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Connexion</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {/* Partie basse avec fond blanc */}
      <View style={styles.bottomSection}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Connexion</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Image
            source={require("../../assets/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
          <Text style={styles.linkText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.linkText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
  topSection: {
    flex: 2,
    justifyContent: "flex-end",
    backgroundColor: "#E0E0E0",
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 30,
  },
  inputContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
    fontStyle: "italic",
    color: "#a7a7a7",
  },
  bottomSection: {
    flex: 3,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 25,
    marginTop: 0,
    width: "90%",
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText: {
    color: "#388E3C",
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  googleButtonText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
});

export default LoginScreen;
