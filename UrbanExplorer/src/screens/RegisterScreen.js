/*
* Crée le 14 mars 2025
* Ecran d'inscription
*/

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AuthRepository from "../repositories/AuthRepository";
import { setDoc, doc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {styles} from "../styles/GlobalStyle";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [role, setRole] = useState("explorateur");
  const [photoProfil, setPhotoProfil] = useState(null);
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("userCredential: ", userCredential);
      const userId = userCredential.user.uid;
      console.log("userId: ", userId)
  
      await setDoc(doc(db, "utilisateurs", userId), {
        idUtilisateur: userId,
        email,
        pseudo,
        role, // Enregistrement du rôle sélectionné
        photoProfil: photoProfil || null,
        dateInscription: new Date(),
      });
  
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
        <View style={styles.topSection}>
          <Text style={styles.title}>Créer un compte</Text>
          <View style={styles.inputContainer}>

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
                <Picker.Item label="Explorateur" value="explorateur" />
                <Picker.Item label="Contributeur" value="contributeur" />
                <Picker.Item label="Modérateur" value="moderateur" />
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


export default RegisterScreen;
