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


const screenHeight = Dimensions.get("window").height;

const DetailScreen = ({route, navigation}) => {
    const [isInFavorite, setIsInFavorite] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // const route = useRoute();
    const [spot, setSpot] = useState({});
    const { idSpot } = route.params;
    const [loading, setLoading] = useState(true);
    const { user, userData, setUserData } = useContext(AuthContext);
    const idUser = userData.idUtilisateur;

    console.log(idSpot)

    useEffect(() => {
        const fetchSpot = async () => {
          try {
            console.log(idSpot)
            const data = await SpotRepository.getSpotById(idSpot);
            // console.log("la data :", data) 
            setSpot(data[0]);
          } catch (error) {
            console.error('Erreur lors du chargement du spot:', error);
          } finally {
            setLoading(false);
          }
        };

        const fetchFavoriStatus = async () => {
            const exists = await checkFavoriExists(idUser, idSpot)
            setIsInFavorite(exists);
            // console.log("est en favori : ", exists)
        }
        
        fetchSpot();
        fetchFavoriStatus();
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }


    // const userId = 'user_003'; // const { userId } = useAuth();
    // const spotId = 'lieu_001'; //  const { spotId } = route.params;

    // useFocusEffect(
    //     useCallback(() => {
    //         const fetchFavoriStatus = async () => {
    //             const exists = await checkFavoriExists(userId, spotId);
    //             setIsInFavorite(exists);
    //         };
    //         fetchFavoriStatus();
    //     }, [userId, spotId])
    // );

    const handleToggleFavorite = async () => {
        const result = isInFavorite
            ? await FavoriRepository.deleteFavoriteOfSpot(idUser, idSpot)
            : await FavoriRepository.addFavori(idUser, idSpot);
        if (result.success)
            setIsInFavorite(!isInFavorite);

        setSnackbarMessage(result.message);
        setSnackbarVisible(true);
        // console.log(result);
    };



    return (
        <SafeAreaView style={styles.container}>

            <View style={localStyles.detailContainer}>

                <View style={localStyles.metaDataSpot}>
                    <Text style={localStyles.spotName}>{spot.nom}</Text>
                    <Text style={localStyles.spotDescription}>{spot.description}</Text>
                    <Text style={localStyles.spotType}>{spot.type}</Text>
                </View>

                <View style={localStyles.spotAvis}>
                    <Text>Les avis iront ici</Text>
                </View>

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
                style={localStyles.fab}
                color={isInFavorite ? 'red' : 'black'}
                onPress={handleToggleFavorite}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'OK', onPress: () => {
                        // navigation.navigate('FavoritesScreen', {
                        //     userId: idUser,
                        //     spotId: idSpot,

                        // });
                        // navigation.navigate("FavoritesScreen")
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
        right: 16,
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
    },
    spotName: {
        fontSize: 20,
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
