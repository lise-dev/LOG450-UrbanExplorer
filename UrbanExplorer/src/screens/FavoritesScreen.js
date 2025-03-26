import Toolbar from "../components/Toolbar";
import FavoritesItem from "../components/FavoritesItem";
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {styles, typography} from '../styles/GlobalStyle';
import Button from "../components/Button";
import {Icon, Searchbar, Snackbar, RadioButton} from "react-native-paper";
import React, {useCallback, useRef, useState} from "react";
import FavoriRepository from "../repositories/FavoriRepository";
import SpotRepository from "../repositories/SpotRepository";
import {useFocusEffect} from "@react-navigation/native";

import ConfirmDialog from "../components/ConfirmDialog";

const FavoritesScreen = ({navigation}) => {
    const userId = 'user_003';  //
    // const {userId} = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState([]);
    const [query, setQuery] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [sortVisible, setSortVisible] = useState(false);
    const [sortOption, setSortOption] = useState('dateDesc');
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    // Fetch Favoris
                    const favorisQuery = await FavoriRepository.getFavoris(userId)
                    setFavorites(favorisQuery);

                    // Fetch Spots
                    const spots = await SpotRepository.getSpots();
                    setSpots(spots);

                } catch (error) {
                    console.error('Erreur de chargement:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [userId])
    );
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    if (loading) {
        return (<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large"/>
        </View>);
    }

    const handleDeleteFavorite = async (spotId) => {
        const result = await FavoriRepository.deleteFavoriteOfSpot(userId, spotId);
        if (result.success) {
            setFavorites(prev => prev.filter(f => f.idSpot !== spotId));
        }
        showSnackbar(result.message);
    }

    const handleFilter = (f) =>
        f.nom.toLowerCase().includes(query.toLowerCase())
        || f.description.toLowerCase().includes(query.toLowerCase())
        || f.type.toLowerCase().includes(query.toLowerCase())


    const handleSort = (a, b) => {
        switch (sortOption) {
            case 'dateAsc':
                return a.dateAjout - b.dateAjout;
            case 'dateDesc':
                return b.dateAjout - a.dateAjout;
            case 'nameAsc':
                return a.nom.localeCompare(b.nom);
            case 'nameDesc':
                return b.nom.localeCompare(a.nom);
            default:
                return 0;
        }
    }

    const data = favorites.map((fav) => {
        const spot = spots.find((s) => s.idSpot === fav.idSpot);
        return {
            id: fav.idFavori,
            nom: spot?.nom || 'Inconnu',
            type: spot?.type || '-',
            description: spot?.description || '',
            dateAjout: fav.timestamp || new Date(),
            original: fav,
        };
    }).filter(f => handleFilter(f)
    ).sort((a, b) => handleSort(a, b));

    const handleNotConnected = () => {
        return (
            <View style={localStyles.container}>
                <Text style={typography.titleLarge}>Non connecter </Text>
                <Text style={localStyles.text}>Pour accéder à vos
                    favoris, vous devez d'abord vous connecter</Text>
                <Button text={'Se connecter'} onPress={() => navigation.navigate('LoginScreen')}/>
            </View>)
    }

    const handleNoFavorites = () => {
        return (
            <View style={localStyles.container}>
                <Text style={{...typography.titleLarge, marginBottom: 10}}>Aucun favoris </Text>
                <Icon size={80} source={'heart'} color={'grey'}/>
                <Text style={localStyles.text}>Vous n'avez aucun favoris
                    à afficher. Ajouter des contenus à votre liste de favoris pour les voir apparaitre ici</Text>
            </View>)
    }

    return (

        <>
            <SafeAreaView style={[styles.container]}>
                <Toolbar title={'Mes favoris'} actions={[
                    {
                        icon: 'arrow-up-down', onPress: () => {
                            setSortVisible(true);
                        }
                    },
                ]}/>
                <Searchbar
                    placeholder="Rechercher un favori"
                    value={query}
                    mode={"bar"}
                    onChangeText={setQuery}
                    style={{margin: 10}}
                />
                {userId ? (
                    data.length > 0 ? (
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <FavoritesItem
                                    favorite={item}
                                    onPress={() => navigation.navigate('DetailScreen', {
                                        spotId: item.original.idSpot
                                    })}
                                    onViewMap={() => console.log('Voir carte', item)}
                                    onDelete={() => handleDeleteFavorite(item.original.idSpot)}
                                />
                            )}
                        />
                    ) : handleNoFavorites()
                ) : handleNotConnected()}
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{
                        label: 'OK', onPress: () => {

                            setSnackbarVisible(false)
                        }
                    }}
                >
                    {snackbarMessage}
                </Snackbar>

            </SafeAreaView>
            <SortDialog
                visible={sortVisible}
                onDismiss={() => setSortVisible(false)}
                sortOption={sortOption}
                onSelectOption={setSortOption}
            />
        </>

    )

}

const SortDialog = ({visible, onDismiss, sortOption, onSelectOption}) => {
    return (
        <ConfirmDialog
            visible={visible}
            title="Trier les favoris"
            confirmLabel="Valider"
            cancelLabel="Annuler"
            onCancel={onDismiss}
            onConfirm={onDismiss}
            confirmColor="#2e7d32"
        >
            <RadioButton.Group onValueChange={onSelectOption} value={sortOption}>
                <RadioButton.Item label="Nom (A-Z)" value="nameAsc" position="leading" labelStyle={localStyles.sortItem}/>
                <RadioButton.Item label="Nom (Z-A)" value="nameDesc" position="leading" labelStyle={localStyles.sortItem}/>
                <RadioButton.Item label="Date croissante" value="dateAsc" position="leading" labelStyle={localStyles.sortItem}/>
                <RadioButton.Item label="Date décroissante" value="dateDesc" position="leading" labelStyle={localStyles.sortItem}/>
            </RadioButton.Group>
        </ConfirmDialog>
    );
};

const localStyles = StyleSheet.create({
    container: {
        ...styles.container,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 200,
        padding: 15

    },
    text: {
        ...typography.bodyLarge,
        textAlign: 'center',
        marginVertical: 16
    },
    sortItem:{textAlign: 'left', marginHorizontal:10}
})
export default FavoritesScreen;