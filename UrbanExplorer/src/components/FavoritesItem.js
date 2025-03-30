import React, {useState} from 'react';
import {Card, Text, IconButton} from 'react-native-paper';
import {typography} from "../styles/GlobalStyle";
import {View, StyleSheet} from "react-native";
import ConfirmDialog from "./ConfirmDialog";
import FavoriRepository from "../repositories/FavoriRepository";

const FavoritesItem = ({favorite, onPress, onViewMap, onDelete}) => {
    const [dialogVisible, setDialogVisible] = useState(false);

    return (
        <>
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
                        {/* Nom */}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                                typography.titleSmall,
                                {
                                    flexShrink: 1,
                                    minWidth: Math.max(45,favorite.nom.length),
                                    maxWidth: 500,
                                    marginRight: 5,
                                },
                            ]}
                        >
                            {favorite.nom}
                        </Text>

                        {/* Type + barre */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexShrink: 1,
                                minWidth:100 ,
                            }}
                        >
                            <Text style={[typography.labelMedium, { marginRight: 4 }]}>|</Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                    typography.labelMedium,
                                    {
                                        flexShrink: 1,
                                        flexGrow: 1,
                                    },
                                ]}
                            >
                                {favorite.type}
                            </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <IconButton icon="map-marker" containerColor="#e8f5e9" style={styles.icons}
                                    onPress={onViewMap}/>
                        <IconButton icon="delete-outline" iconColor="#d32f2f" containerColor="#fdecea"
                                    style={styles.icons} onPress={() => setDialogVisible(true)}/>
                    </View>
                </View>
                <Card.Content style={{paddingTop: 0}}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={typography.bodyMedium}>
                        {favorite.description}
                    </Text>
                </Card.Content>
            </Card>
            <ConfirmDialog
                visible={dialogVisible}
                title="Supprimer ce favori ?"
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                confirmColor="red"
                onCancel={() => setDialogVisible(false)}
                onConfirm={() => {
                    onDelete();
                    setDialogVisible(false);
                }}
            >
                <Text>Voulez-vous vraiment supprimer ce favori ?</Text>
            </ConfirmDialog>
        </>
    );
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 5,
        paddingVertical: 3,
        borderRadius: 12,
        height: 120,
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
