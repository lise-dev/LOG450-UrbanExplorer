import React from 'react';
import {Card, Text, IconButton} from 'react-native-paper';
import {typography} from "../styles/GlobalStyle";
import {View, Alert, StyleSheet} from "react-native";

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
        <Card elevation={1} onPress={onPress} style={styles.card}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingTop: 3,
                }}
            >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[typography.titleSmall, { flex: 1 }]}
                    >
                        {title}
                    </Text>

                    <Text style={[typography.labelMedium, { marginHorizontal: 4 }]}>|</Text>

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[typography.labelMedium, { maxWidth: 80, flexShrink: 1 }]}
                    >
                        {type}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon="map-marker" containerColor="#e8f5e9" style={styles.icons} onPress={onViewMap} />
                    <IconButton icon="delete-outline" iconColor="#d32f2f" containerColor="#fdecea" style={styles.icons} onPress={confirmDelete} />
                </View>
            </View>
            <Card.Content style={{ paddingTop: 0 }}>
                <Text numberOfLines={3} ellipsizeMode="tail" style={typography.bodyMedium}>
                    {description}
                </Text>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 5,
        paddingVertical: 3,
        borderRadius: 12,
        height: 150,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8,
    },
    icons: {
        // borderRadius: 8,
        borderWidth: 0.5,
        // borderColor: 'fdecea',
        // marginRight: 4,
    },
    title: {
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        height: 100,
    },
});


export default FavoritesItem;
