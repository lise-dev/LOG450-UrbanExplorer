// ## WARNING : ne plus utiliser ce fichier --> voir src/screens/(tabs)/FavorisScreen.jsx

import React, {useCallback, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {Searchbar, Snackbar, Icon, RadioButton} from "react-native-paper";

import Toolbar from "../components/Toolbar";
import FavoritesItem from "../components/FavoritesItem";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";

import FavoriRepository from "../repositories/FavoriRepository";
import SpotRepository from "../repositories/SpotRepository";

import {styles, typography} from "../styles/GlobalStyle";

const FavoritesScreen = ({navigation}) => {
    const userId = "user_003"; // TODO: remplacer avec useAuth()

    const [favorites, setFavorites] = useState([]);
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [query, setQuery] = useState("");
    const [sortVisible, setSortVisible] = useState(false);
    const [sortOption, setSortOption] = useState("dateDesc");

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const fetchData = async () => {
        if (!userId) {
            setLoading(false)
            return;
        }

        try {
            if (!refreshing) setLoading(true);
            const [favorisData, spotsData] = await Promise.all([
                FavoriRepository.getFavoris(userId),
                SpotRepository.getSpots(),
            ]);
            setFavorites(favorisData);
            console.log(favorisData);
            setSpots(spotsData);
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => {
        fetchData();
    }, [userId]));

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const handleDeleteFavorite = async (spotId) => {
        const result = await FavoriRepository.deleteFavoriteOfSpot(userId, spotId);
        if (result.success) {
            setFavorites((prev) => prev.filter((f) => f.idSpot !== spotId));
        }
        showSnackbar(result.message);
    };

    const filterFavorites = (f) =>
        f.nom.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase()) ||
        f.type.toLowerCase().includes(query.toLowerCase());

    const sortFavorites = (a, b) => {
        switch (sortOption) {
            case "dateAsc":
                return a.dateAjout - b.dateAjout;
            case "dateDesc":
                return b.dateAjout - a.dateAjout;
            case "nameAsc":
                return a.nom.localeCompare(b.nom);
            case "nameDesc":
                return b.nom.localeCompare(a.nom);
            default:
                return 0;
        }
    };

    const enrichedFavorites = favorites
        .map((fav) => {
            const spot = spots.find((s) => s.idSpot === fav.idSpot);
            return {
                id: fav.idFavori,
                nom: spot?.nom || "Inconnu",
                type: spot?.type || "-",
                description: spot?.description || "",
                dateAjout: fav.timestamp || new Date(),
                original: fav,
            };
        })
        .filter(filterFavorites)
        .sort(sortFavorites);

    const renderNotConnected = () => (
        <View style={localStyles.container}>
            <Text style={styles.title}>Non connecté</Text>
            <Text style={localStyles.text}>
                Pour accéder à vos favoris, vous devez d'abord vous connecter
            </Text>
            <Button text="Se connecter" onPress={() => navigation.navigate("LoginScreen")}/>
        </View>
    );

    const renderNoFavorites = () => (
        <View style={localStyles.container}>
            <Text style={{...styles.title}}>Aucun favori</Text>
            <Icon size={80} source="heart" color="#ff0f0f"/>
            <Text style={localStyles.text}>
                Vous n'avez aucun favori à afficher. Ajoutez-en pour les voir ici.
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={localStyles.loader}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Toolbar
                    title="Mes favoris"
                    actions={userId && enrichedFavorites.length > 2
                        ? [{icon: "arrow-up-down", onPress: () => setSortVisible(true)}]
                        : []
                    }
                />
                {userId && (enrichedFavorites.length > 0 || query.length > 0) && (
                    <Searchbar
                        placeholder="Rechercher un favori"
                        value={query}
                        onChangeText={setQuery}
                        style={localStyles.searchbar}
                    />
                )}

                {!userId ? (
                    renderNotConnected()
                ) : enrichedFavorites.length === 0 && query.length === 0 ? (
                    renderNoFavorites()
                ) : (
                    <>

                        <FlatList
                            data={enrichedFavorites}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <FavoritesItem
                                    favorite={item}
                                    onPress={() =>
                                        navigation.navigate("DetailScreen", {
                                            spotId: item.original.idSpot,
                                        })
                                    }
                                    onViewMap={() => console.log("Voir carte", item)}
                                    onDelete={() => handleDeleteFavorite(item.original.idSpot)}
                                />
                            )}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    </>

                )
                }

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{label: "OK", onPress: () => setSnackbarVisible(false)}}
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
    );
};

const SortDialog = ({visible, onDismiss, sortOption, onSelectOption}) => (
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
            <RadioButton.Item label="Date croissante" value="dateAsc" position="leading"
                              labelStyle={localStyles.sortItem}/>
            <RadioButton.Item label="Date décroissante" value="dateDesc" position="leading"
                              labelStyle={localStyles.sortItem}/>
        </RadioButton.Group>
    </ConfirmDialog>
);

const localStyles = StyleSheet.create({
    container: {
        ...styles.container,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 200,
        padding: 15,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchbar: {
        margin: 10,
        backgroundColor: '#f0f0f0'
    },
    text: {
        ...typography.bodyLarge,
        textAlign: "center",
        marginBottom: 16,
    },
    sortItem: {
        textAlign: "left",
        marginHorizontal: 10,
    },
});

export default FavoritesScreen;
