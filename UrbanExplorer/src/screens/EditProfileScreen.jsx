import React, {useEffect, useState, useContext, useRef} from "react";
import {View, Text, TouchableOpacity, StyleSheet, TextInput, Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {AuthContext} from "../../AuthContext";
import * as ImagePicker from "expo-image-picker";
import {setDoc, doc} from "firebase/firestore";
import {auth, db} from "../../firebaseConfig";
import "../constants/dbInfo";
import {dbTables} from "../constants/dbInfo";
import UserRepository from "../repositories/UserRepository";
import ConfirmDialog from "../components/ConfirmDialog";
import ImagePickerComponent from "../components/ImagePickerComponent";

const EditProfileScreen = ({navigation}) => {

    const {user, userData, setUser, setUserData} = useContext(AuthContext);
    const [photoProfil, setPhotoProfil] = useState(userData.photoProfil);
    const [errorMessage, setErrorMessage] = useState(null);
    const [pseudo, setPseudo] = useState(userData.pseudo);
    const [firstName, setFirstName] = useState(userData.prenom);
    const [lastName, setLastName] = useState(userData.nom);
    const imagePickerRef = useRef(null);

    const handleSaveProfile = async () => {
        if (!pseudo) {
            setErrorMessage("Tous les champs sont obligatoires !");
            return;
        }

        try {
            var newUserData = userData;
            newUserData.pseudo = pseudo,
                newUserData.prenom = firstName,
                newUserData.nom = lastName,
                newUserData.photoProfil = photoProfil

            var response = await UserRepository.editUser(userData.idUtilisateur, userData.idUtilisateur, newUserData);
            if (response.error) {
                console.log(response.error)
            }

            navigation.goBack();
        } catch (error) {
            console.error(error);
            setErrorMessage("Erreur. Réessayez.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerInput}>
                <View style={styles.containerFormItem}>
                    <Text style={styles.labelInput}>Prénom</Text>
                    <TextInput
                        placeholder="Prénom..."
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
                <View style={styles.containerFormItem}>
                    <Text style={styles.labelInput}>Nom</Text>
                    <TextInput
                        placeholder="Nom..."
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
                <View style={styles.containerFormItem}>
                    <Text style={styles.labelInput}>Pseudo</Text>
                    <TextInput
                        placeholder="Pseudo..."
                        style={styles.input}
                        value={pseudo}
                        onChangeText={setPseudo}
                    />
                </View>
            </View>
            <View style={styles.containerFormItem}>
                <Image
                    source={{uri: photoProfil}}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.button} onPress={() => imagePickerRef.current?.openPicker()}>
                    <Text
                        style={styles.buttonText}>{userData.photoProfil === undefined ? "Choisir une photo" : "Modifier la photo"}</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.containerFormItem}>
                {errorMessage && <Text>{errorMessage}</Text>}
                <TouchableOpacity style={[styles.button, styles.saveProfileButton]} onPress={handleSaveProfile}>
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Enregistrer le profil</Text>
                </TouchableOpacity>
            </View>
            <ImagePickerComponent
                ref={imagePickerRef}
                onImagePicked={(uri) => setPhotoProfil(uri)}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#F5F5F5",
        marginBottom: 10,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 50,
        margin: 20
    },
    button: {
        // backgroundColor: "#2E7D32",
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
    labelInput: {
        textAlign: "left",
        alignContent: "left",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        fontWeight: 500,
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    containerFormItem: {
        width: "80%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    saveProfileButton: {
        backgroundColor: "green",
        borderWidth: 0,

    },
    saveButtonText: {
        color: "white",
    },
    containerInput: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10
    }

})


export default EditProfileScreen;