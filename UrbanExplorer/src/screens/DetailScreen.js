import {SafeAreaView, StyleSheet} from "react-native";
import {styles} from "../styles/GlobalStyle";
import {FAB, Snackbar} from "react-native-paper";
import {useCallback, useState} from "react";
import FavoriRepository from "../repositories/FavoriRepository";
import {checkFavoriExists} from "../utils/validators";
import {useAuth} from "../utils/AuthContext";
import {useFocusEffect, useRoute} from "@react-navigation/native";

const DetailScreen = ({navigation}) => {
    const [isInFavorite, setIsInFavorite] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const route = useRoute();

    const { spotId } = route.params;
    const userId = 'user_003'; // const { userId } = useAuth();

    useFocusEffect(
        useCallback(() => {
            const fetchFavoriStatus = async () => {
                const exists = await checkFavoriExists(userId, spotId);
                setIsInFavorite(exists);
            };
            fetchFavoriStatus();
        }, [userId, spotId])
    );

    const handleToggleFavorite = async () => {
        const result = isInFavorite
            ? await FavoriRepository.deleteFavoriteOfSpot(userId, spotId)
            : await FavoriRepository.addFavori(userId, spotId);
        if (result.success)
            setIsInFavorite(!isInFavorite);

        setSnackbarMessage(result.message);
        setSnackbarVisible(true);
        console.log(result);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                            userId: userId,
                            spotId: spotId,

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
