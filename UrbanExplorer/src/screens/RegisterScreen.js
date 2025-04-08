/*
* Crée le 14 mars 2025
* Ecran d'inscription
*/

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AuthRepository from "../repositories/AuthRepository";
import { setDoc, doc } from "firebase/firestore";
import {styles as GlobalStyle} from "../styles/GlobalStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import Roles from  '../constants/roles';
import roles from "../constants/roles";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [role, setRole] = useState(roles.explorateur);
  const [photoProfil, setPhotoProfil] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Sélection d'une image depuis la galerie
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoProfil(result.assets[0].uri);
    }
  };

  // Inscription utilisateur
  const handleRegister = async () => {
    setErrorMessage(null);
  
    if (!email || !password || !pseudo || !role) {
      setErrorMessage("Tous les champs sont obligatoires !");
      return;
    }
  
    try {
      var response = await AuthRepository.register(email, password, lastName, firstName, pseudo, role, photoProfil);
      if (!response.success) {
        console.error(response.error);
      }
      const userCredential = response.user;
  
      navigation.replace("HomeScreen");
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de l'inscription. Réessayez.");
    }
  }; 

  const handleGoogleLogin = async () => {
    const response = await AuthRepository.signInWithGoogle();
    if (response.success) {
      navigation.replace("HomeScreen");
    } else {
      setErrorMessage(response.error || "Erreur lors de la connexion avec Google.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Partie haute avec fond gris */}
        <ScrollView style={styles.topSectionScroll}>
          <View style={styles.topSection}>
            <Text style={styles.title}>Créer un compte</Text>
            <View style={styles.inputContainer}>

              {/* Prénom */}
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
              />

              {/* Nom */}
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
              />

              {/* email */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* mot de passe */}
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {/* pseudo */}
              <TextInput
                style={styles.input}
                placeholder="Pseudo"
                value={pseudo}
                onChangeText={setPseudo}
              />

              {/* role */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
                  style={styles.picker}
                >
                  {Object.entries(Roles).map(([key, value]) => (
                    <Picker.Item label={value} value={key} key={key}/>
                  ))}
                </Picker>
              </View>

              {/* photo de profil */}
              <TouchableOpacity onPress={pickImage} style={styles.photoInput}>
                <Text style={styles.photoInputText}>
                  {photoProfil ? "Modifier la photo" : "Choisir une photo"}
                </Text>
              </TouchableOpacity>
              {photoProfil && <Image source={{ uri: photoProfil }} style={styles.profileImage} />}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerText}>S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Image
              source={require("../../assets/google.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
  topSectionScroll: {
    flex: 1,

  },
  topSection: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
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
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
  },
  photoInput: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
  },
  photoInputText: {
    fontSize: 14,
    color: "#a7a7a7",
    fontStyle: "italic",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 10,
    width: "90%",
  },
  registerText: {
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
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    color: "#757575",
  },
});

export default RegisterScreen;
