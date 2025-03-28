/*
Écran pour gérer son profil
Crée le 28.03.25
*/

import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { AuthContext } from "../../AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";


const ProfileScreen = ({ navigation }) => {

  const { user, userData } = useContext(AuthContext);

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  }


  return (

    <SafeAreaView style={styles.container}>
      {/* User + icon */}
      <View style={[styles.container, styles.containerUserInfo]}>
        <Image
          source={{uri: userData.photoProfil}}
          style={styles.profileImage}
        />
        <Text style={styles.userTitle}>{userData.pseudo}</Text>
      </View>
      <View style={[styles.container, styles.containerButtons]}>
          <TouchableOpacity 
            style={[styles.button, styles.editProfileButtons]}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <Text style={styles.buttonText}>Modifier mon profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.editProfileButtons]}>
            <Text style={styles.buttonText}>Changer la langue de traduction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.editProfileButtons]}>
            <Text style={styles.buttonText}>Définir mes centres d'intérêts</Text>
          </TouchableOpacity>
      </View>

      <View style={[styles.container, styles.containerLogout]}>
        <TouchableOpacity 
          onPress={logout}
          style={[styles.button, styles.logoutButton]}
        >
          <Text style={[styles.buttonText, styles.buttonTextLogout]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 3,
    backgroundColor: 'none',
    width: "75%"
  },
  logoutButton: {
    borderColor: "#c41a28",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonTextLogout: {
    color: "black",
  },
  containerLogout: {
    flex: 1,
    justifyContent: "flex-end"
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    margin: 20
  },
  containerUserInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    // border: 10,
    // borderColor: "black",
  },
  containerButtons: {
    flex: 1,
    justifyContent: "flex-start",
  },
  editProfileButtons: {
    margin: 10,
  },
  userTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

});

export default ProfileScreen; 