import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../AuthContext";
import * as ImagePicker from "expo-image-picker";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import "../constants/dbInfo";
import { dbTables } from "../constants/dbInfo";



const EditProfileScreen = ({ navigation }) => {

    const { user, userData } = useContext(AuthContext);
    const [photoProfil, setPhotoProfil] = useState(userData.photoProfil);
    const [errorMessage, setErrorMessage] = useState(null);
    const [pseudo, setPseudo] = useState(userData.pseudo);


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

    const handleSaveProfile = async () => {
        if (!pseudo) {
            setErrorMessage("Tous les champs sont obligatoires !");
            return;
        }
        
        try {
            await setDoc(doc(db, dbTables.USER, userData.idUtilisateur), {
                pseudo: pseudo,
                photoProfil: photoProfil || null
            }, { merge: true })
            navigation.goBack();
        } catch (error) {
            console.error(error);
            setErrorMessage("Erreur. Réessayez.");
        }
    }


    return (
        <SafeAreaView>
            <View>
                <Text>Pseudo</Text>
                <TextInput 
                    placeholder="Pseudo..."
                    style={styles.input}
                    value={pseudo}
                    onChangeText={setPseudo}
                />
            </View>
            <View>
                <Image
                    source={{uri: photoProfil}}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>{userData.photoProfil === undefined ? "Choisir une photo" : "Modifier la photo"}</Text>
                </TouchableOpacity>

            </View>
            <View>
                {errorMessage && <Text>{errorMessage}</Text>}
                <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                    <Text style={styles.buttonText}>Enregistrer le profil</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
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
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 50,
        margin: 20
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
    buttonText: {
        color: "black",
        fontSize: 14,
        fontWeight: "bold",
    },

})


export default EditProfileScreen;