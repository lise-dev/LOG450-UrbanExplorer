import React from 'react';
import {Card, Text, IconButton} from 'react-native-paper';
import {typography} from "../styles/GlobalStyle";
import {View, Alert} from "react-native";

const FavoritesItem = ({title, type, description, onPress, onViewMap, onDelete}) => {
    const confirmDelete = () => {
        Alert.alert(
            'Supprimer ce favori ?',
            'Voulez-vous vraiment supprimer ce favori ?',
            [
                {text: 'Annuler', style: 'cancel'},
                {text: 'Supprimer', style: 'destructive', onPress: onDelete},
            ]
        );
    };

    return (
        <Card elevation={1} onPress={onPress} style={{paddingBottom: 2, margin: 5}}>
            <View
                style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <Card.Title title={
                    <View style={{flexDirection: 'column'}}>
                        <Text numberOfLines={1} ellipsizeMode={"tail"}
                              style={[typography.titleMedium, {marginBottom: 0}]}>{title}</Text>
                        <Text style={typography.labelMedium}>{type}</Text>
                    </View>
                }/>
                <Card.Actions style={{position: 'absolute', right: 0, flexDirection: 'row'}}>
                    <IconButton icon="map-marker" onPress={onViewMap}/>
                    <IconButton icon="delete-outline" iconColor="#d32f2f" onPress={confirmDelete}/>
                </Card.Actions>
            </View>

            <Card.Content>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text numberOfLines={3} ellipsizeMode={"tail"}
                          style={[typography.bodyLarge]}>{description}</Text>
                </View>
            </Card.Content>

        </Card>
    );
};

export default FavoritesItem;
