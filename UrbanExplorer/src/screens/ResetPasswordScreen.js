/*
* Crée le 15 mars 2025
* Ecran de connection
*/

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        if (!email) {
            setMessage("Veuillez entrer votre email.");
            return;
        }

        console.log(auth);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Si l'email existe un email de réinitialisation a été envoyé !");
        } catch (error) {
            setMessage("Erreur lors de la réinitialisation du mot de passe.");
        }
    };

    return (

        <View style={styles.container}>
            {/* Partie haute avec fond gris */}
            <View style={styles.topSection}>
                <Text style={styles.title}>Réinitialiser le mot de passe</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            {/* Partie basse avec fond blanc */}
            <View style={styles.bottomSection}>
                {message ? <Text style={styles.message}>{message}</Text> : null}

                <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                    <Text style={styles.resetText}>Envoyer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("LoginScreen")}>
                    <Text style={styles.loginText}>Connexion</Text>
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
        alignItems: "center",
        backgroundColor: "#E0E0E0",
        paddingBottom: 20,
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
        // fontStyle: "italic",
        // color: "#a7a7a7",
    },
    bottomSection: {
        flex: 3,
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: "center",
    },
    message: {
        color: "red",
        marginBottom: 10,
    },
    resetButton: {
        backgroundColor: "#2E7D32",
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginTop: 10,
        width: "90%",
        alignItems: "center",
    },
    resetText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginButton: {
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#388E3C",
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginTop: 10,
        width: "90%",
        alignItems: "center",
    },
    loginText: {
        color: "#388E3C",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ResetPasswordScreen;
