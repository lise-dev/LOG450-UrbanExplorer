import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../AuthContext";


const EditProfileScreen = ({ navigation }) => {

    const { user, userData } = useContext(AuthContext);

    return (
        <SafeAreaView>
            <View>
                <Text>Pseudo</Text>
                <TextInput 
                    placeholder="Pseudo..."
                    style={styles.input}
                    value={userData.pseudo}
                />
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

})


export default EditProfileScreen;