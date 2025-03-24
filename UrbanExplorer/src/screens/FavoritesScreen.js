import Toolbar from "../components/Toolbar";
import {useAuth} from "../utils/AuthContext";
import FavoritesItem from "../components/FavoritesItem";
import {Image, SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator} from "react-native";
import {styles, typography} from '../styles/GlobalStyle';
import Button from "../components/Button";
import {Icon} from "react-native-paper";
import {useEffect, useState} from "react";
import FavoriRepository from "../repositories/FavoriRepository";
import SpotRepository from "../repositories/SpotRepository";

const FavoritesScreen = ({navigation}) => {
    // const {userId} = useAuth();
    const userId = '1';
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState([]);
    useEffect(() => {
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
    }, [userId]);

    if (loading) {
        return (<View style={{flex: 1,justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator  size="large" />
        </View>);
    }
    const handleFavorites = () =>
        <ScrollView>
          {/*  {favorites.map((fav) => {
                    const spot = spots.find((s) => s.id === fav.idSpot)
                    return (
                        (
                            <FavoritesItem
                                key={fav.idFavori}
                                title={spot.nom}
                                type={spot.type}
                                description={spot.description}
                                onPress={() => console.log('Voir détail')}
                                onViewMap={() => console.log('Voir carte')}
                                onDelete={() => console.log('Supprimer le favori')}
                            />
                        ))
                }*/}

            {[1,2,3,4,5,6,7,8,9,10].map((item, index) => (
                <FavoritesItem
                    key={index}
                    title={`Tour Eiffel ${index + 1}`}
                    type={`Monument ${index + 1}`}
                    description="Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. "
                    onPress={() => console.log('Voir détail')}
                    onViewMap={() => console.log('Voir carte')}
                    onDelete={() => console.log('Supprimer le favori')}
                />
            ))}
        </ScrollView>
    const handleNotConnected = () => {
        return (
            <View style={localStyles.container}>
                <Text style={typography.titleLarge}>Non connecter </Text>
                <Text style={localStyles.text}>Pour accéder à vos
                    favoris, vous devez d'abord vous connecter</Text>
                <Button text={'Se connecter'} onPress={() => navigation.navigate('LoginScreen')}/>
            </View>)
    }

    const handleNotFavorites = () => {
        return (
            <View style={localStyles.container}>
                <Text style={{...typography.titleLarge, marginBottom: 10}}>Aucun favoris </Text>
                <Icon size={80} source={'heart'} color={'grey'}/>
                <Text style={localStyles.text}>Vous n'avez aucun favoris
                    à afficher. Ajouter des contenus à votre liste de favoris pour les voir apparaitre ici</Text>
            </View>)
    }
    return (<SafeAreaView style={[styles.container]}>
        <Toolbar title={'Mes favoris'} actions={[
            {
                icon: 'magnify', onPress: () => {
                }
            },
        ]}/>
        {userId ? handleFavorites() : handleNotConnected()}
        {/*{handleFavorites()}*/}

    </SafeAreaView>)

}

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
    }
})
export default FavoritesScreen;