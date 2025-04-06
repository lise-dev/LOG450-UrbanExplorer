import {SafeAreaView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View} from "react-native";
import {styles} from "../styles/GlobalStyle";
import {FAB, Snackbar} from "react-native-paper";
import {useCallback, useEffect, useState, useContext} from "react";
import { AuthContext } from "../../AuthContext";
import FavoriRepository from "../repositories/FavoriRepository";
import {checkFavoriExists} from "../utils/validators";
import {useAuth} from "../utils/AuthContext";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import SpotRepository from "../repositories/SpotRepository";
import MapView, { Marker } from 'react-native-maps';
import { Dimensions } from "react-native";
import AvisRepository from "../repositories/AvisRepository";
import AvisItem from "../components/AvisItem";
import { ScrollView } from "react-native-gesture-handler";


const screenHeight = Dimensions.get("window").height;

const DetailScreen = ({route, navigation}) => {
    const [isInFavorite, setIsInFavorite] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [spot, setSpot] = useState({});
    const { idSpot } = route.params;
    const [loading, setLoading] = useState(true);
    const { user, userData, setUserData } = useContext(AuthContext);
    const idUser = userData.idUtilisateur;
    const [listAvis, setListAvis] = useState([]);

    console.log(idSpot)

    useFocusEffect(
        useCallback(() => {

            const fetchData = async () => {
                try {
                    const dataSpot = await SpotRepository.getSpotById(idSpot);
                    setSpot(dataSpot[0]);

                    const exists = await checkFavoriExists(idUser, idSpot);
                    setIsInFavorite(exists);

                    const result = await AvisRepository.getAvisBySpotId(idSpot);
                    setListAvis(result);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }

            };

            fetchData();
        }, [idSpot, idUser])
    );


    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }


    const handleToggleFavorite = async () => {
        const result = isInFavorite
            ? await FavoriRepository.deleteFavoriteOfSpot(idUser, idSpot)
            : await FavoriRepository.addFavori(idUser, idSpot);
        if (result.success)
            setIsInFavorite(!isInFavorite);

        setSnackbarMessage(result.message);
        setSnackbarVisible(true);
    };



    return (
        <SafeAreaView style={styles.container}>

            <View style={localStyles.detailContainer}>

                <View style={localStyles.metaDataSpot}>
                    <Text style={localStyles.spotName}>{spot.nom}</Text>
                    <Text style={localStyles.spotDescription}>{spot.description}</Text>
                    <Text style={localStyles.spotType}>{spot.type}</Text>
                </View>

                <ScrollView style={localStyles.spotAvis}>
                    {listAvis.length === 0 && <Text>Aucun avis pour le moment</Text>}

                    {listAvis.map((avis) => (
                        <AvisItem
                            key={avis.idAvis}
                            idAvis={avis.idAvis}
                            description={avis.texte}
                            note={avis.note}
                        />
                    ))}


                </ScrollView>

                <View style={localStyles.containerMap}>

                    <MapView
                        style={localStyles.spotMap}
                        region={{
                        latitude: spot.coordonnees.latitude,
                        longitude: spot.coordonnees.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                        }}
                    >

                        <Marker
                            coordinate={{
                                latitude: spot.coordonnees.latitude,
                                longitude: spot.coordonnees.longitude,
                            }}
                            title={spot.nom}
                            description={spot.description}
                            pinColor="red"
                        />

                    </MapView>

                </View>


            </View>


            <FAB
                icon={'heart'}
                style={[localStyles.fab, {left: 16}]}
                color={isInFavorite ? 'red' : 'black'}
                onPress={handleToggleFavorite}
            />

            {/* Modifier pour que ça soit visible que pour les contributeurs */}
            <FAB
                icon={'plus'}
                style={[localStyles.fab, {right: 16}]}
                onPress={() => {
                    navigation.navigate("AddAvisScreen", {
                        idSpot: idSpot
                    })
                }}
            />

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
    );
};

const localStyles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 16,
        backgroundColor: '#e8f5e9',
    },
    detailContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",

    },  
    metaDataSpot: {
        paddingHorizontal: 16,
        marginBottom: 8,
        backgroundColor: "white",
        width: "100%",
        padding: 10
    },
    spotName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    spotDescription: {
        fontSize: 16,
        marginTop: 4,
    },
    spotType: {
        fontStyle: 'italic',
        marginTop: 4,
    },
    spotAvis: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
    },
    spotMap: {
        flex: 1,
    },
    containerMap: {
        width: '100%',
        height: screenHeight / 4,
    }
});

export default DetailScreen;
