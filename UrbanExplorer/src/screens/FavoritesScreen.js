import Toolbar from "../components/Toolbar";
import FavoritesItem from "../components/FavoritesItem";
import {Image, SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator, FlatList} from "react-native";
import {styles, typography} from '../styles/GlobalStyle';
import Button from "../components/Button";
import {Icon, IconButton, Searchbar} from "react-native-paper";
import {useEffect, useState} from "react";
import FavoriRepository from "../repositories/FavoriRepository";
import SpotRepository from "../repositories/SpotRepository";
import {SearchBar} from "react-native-screens";
const FavoritesScreen = ({navigation}) => {
    // const {userId} = useAuth();
    const userId = '1';
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState([]);
    const [query, setQuery] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Favoris
                const favorisQuery = await FavoriRepository.getFavoris(userId)
                setFavorites(favorisQuery);

                // Fetch Spots
                const spots = await SpotRepository.getSpots();
                console.log(favorisQuery);
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
        return (<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large"/>
        </View>);
    }
    const data = favorites.map((fav) => {
        const spot = spots.find((s) => s.id === fav.idSpot);
        return {
            id: fav.idFavori,
            title: spot?.nom || 'Inconnu',
            type: spot?.type || '-',
            description: spot?.description || '',
            original: fav,
        };
    }).filter(f => f.title.toLowerCase().includes(query.toLowerCase()))

    const data2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
        return {
            id: item,
            title: `La tour EiffelTour ${item + 1}`,
            type: `Monument emblematique ${item}`,
            description: item % 2 === 0 ? "Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris. Symbole emblématique de Paris." : 'coucou',
            original: item,
        };
    }).filter(f => f.title.toLowerCase().includes(query.toLowerCase()))
    const renderItem = ({item}) => (
        <FavoritesItem
            title={item.title}
            type={item.type}
            description={item.description}
            onPress={() => console.log('Voir détail', item)}
            onViewMap={() => console.log('Voir carte', item)}
            onDelete={() => console.log('Supprimer le favori', item)}
        />
    );

    const handleFavorites = () =>
        <FlatList data={data2} keyExtractor={(item) => item.id.toString()} renderItem={renderItem}/>
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
    return (<SafeAreaView style={[styles.container]}>
        <Toolbar title={'Mes favoris'} actions={[
            {
                icon: 'arrow-up-down', onPress: () => {
                }
            },
        ]}/>
        <Searchbar
            placeholder="Rechercher un favori"
            value={query}
            onChangeText={setQuery}
            style={{ margin: 10 }}
        />
        {userId ? (
            data2.length > 0 ? (
                <FlatList
                    data={data2}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            ) : handleNoFavorites()
        ) : handleNotConnected()}
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