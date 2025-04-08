import React, {useState} from 'react';
import {Card, Text, IconButton} from 'react-native-paper';
import {typography} from "../styles/GlobalStyle";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import ConfirmDialog from "./ConfirmDialog";
import {Searchbar, Snackbar, Icon, RadioButton, FAB} from "react-native-paper";

const ReviewAvisItem = ({
    idSpot,
    spotName,
    spotType,
    idAvis,
    description, 
    note,
    IconButtonTop,
    IconButtonBottom,
}) => {

    return (
        <View 
            key={idAvis}
            style={localStyles.containerItem}
        >
            <View style={localStyles.containerInfo}>
                <View style={{marginBottom: 10}}>
                    <Text style={localStyles.spotTitle}>{spotName}</Text>
                    <Text style={localStyles.spotType}>{spotType}</Text>
                </View>
                <View style={{borderWidth: 0}}>
                    <Text style={localStyles.avisDescription}>{description}</Text>
                    <View style={{ flex: 1, alignItems: "baseline", marginTop: 10}}>
                        <Text style={localStyles.avisNote}>{note}</Text>
                    </View>
                </View>
            </View>
            <View style={localStyles.containerIcons}>
                { <IconButtonTop /> }
                { <IconButtonBottom /> }
            </View>
        </View>
    );
};


const localStyles = StyleSheet.create({
    containerItem: {
        backgroundColor: "white",
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 5,
        flexDirection: "row"
    },
    spotTitle: {
        fontWeight: 700,
        fontSize: 16,
    },
    spotType: {
        fontStyle: "italic", 
    },
    avisDescription: {

    },
    avisNote: {
        backgroundColor: "gold",
        borderRadius: 20,
        fontWeight: 700,
        padding: 5,

    },
    containerIcons: {
        justifyContent: "flex-start"
    },
    containerInfo: {
        flex: 1,
    },
    fab: {
        borderWidth: 1,
        borderColor: "grey"
    },
});

export default ReviewAvisItem;


