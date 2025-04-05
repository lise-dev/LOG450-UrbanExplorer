import {SafeAreaView, StyleSheet, Text, ActivityIndicator, TouchableOpacity} from "react-native";
import {styles} from "../styles/GlobalStyle";
import {FAB, Snackbar} from "react-native-paper";
import {useCallback, useEffect, useState, useContext} from "react";
import { AuthContext } from "../../AuthContext";
import FavoriRepository from "../repositories/FavoriRepository";
import {checkFavoriExists} from "../utils/validators";
import {useAuth} from "../utils/AuthContext";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import SpotRepository from "../repositories/SpotRepository";

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


    useEffect(() => {
        const fetchSpot = async () => {
          try {
            const data = await SpotRepository.getSpotById(idSpot);
            console.log("la data :", data)
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
            console.log("est en favori : ", exists)
        }
        
        fetchSpot();
        fetchFavoriStatus();
    }, [idSpot]);

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
        console.log(result);
    };



    return (
        <SafeAreaView style={styles.container}>
            <Text>Lieu sélecitonné : {spot.description}</Text>
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
                        navigation.navigate('FavoritesScreen', {
                            userId: idUser,
                            spotId: idSpot,

                        });
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
});

export default DetailScreen;
