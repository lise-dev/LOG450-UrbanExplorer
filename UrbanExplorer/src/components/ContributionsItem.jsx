import React, {useState} from 'react';
import {Card, Text, IconButton} from 'react-native-paper';
import {typography} from "../styles/GlobalStyle";
import {View, StyleSheet} from "react-native";
import ConfirmDialog from "./ConfirmDialog";


const ContributionsItem = ({
    idSpot,
    spotName,
    spotType,
    idAvis,
    description, 
    note
}) => {

    return (
        <View key={idAvis}>
            <View>
                <View>
                    {/* titre + type */}
                    <Text>{spotName}</Text>
                    <Text>{spotType}</Text>
                </View>
                <View>
                    <Text>{description}</Text>
                    <Text>{note}</Text>
                </View>
            </View>
            <View>
                {/* mettre ici les deux boutons */}
                <Text>Modifier</Text>
                <Text>Supprimer</Text>
            </View>
        </View>
    );
};


const stlyes = StyleSheet.create({

});

export default ContributionsItem;


