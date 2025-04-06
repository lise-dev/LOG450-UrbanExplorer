import React, {useState} from 'react';
import {Card, Text, IconButton} from 'react-native-paper';
import {typography} from "../styles/GlobalStyle";
import {View, StyleSheet} from "react-native";
import ConfirmDialog from "./ConfirmDialog";

const AvisItem = ({
    idAvis,
    description,
    note
}) => {


    return (
        <View 
            key={idAvis}
            style={localStyles.avisContainer}
        >
            <View style={localStyles.descriptionContainer}>
                <Text style={localStyles.description}>{description}</Text>
            </View>
            <View style={localStyles.noteContainer}>
                <Text style={localStyles.note}>{note}</Text>
            </View>
        </View>

    );

};


const localStyles = StyleSheet.create({

    avisContainer: {
        backgroundColor: "white",
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowOffset: 1,
        shadowOpacity: 1,
        borderRadius: 5,
        margin: 5
    },
    descriptionContainer: {
        width: "90%",
    },
    description: {

    },
    noteContainer: {

    },
    note: {
        backgroundColor: "gold",
        color: "black",
        padding: 10,
        borderRadius: 25
    },


})

export default AvisItem;

