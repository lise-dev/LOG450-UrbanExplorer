import {SafeAreaView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View } from "react-native";
import {styles} from "../styles/GlobalStyle";
import {FAB, Snackbar} from "react-native-paper";
import {useCallback, useEffect, useState, useContext} from "react";
import { AuthContext } from "../../AuthContext";
import FavoriRepository from "../repositories/FavoriRepository";
import {checkFavoriExists} from "../utils/validators";
import {useAuth} from "../utils/AuthContext";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import SpotRepository from "../repositories/SpotRepository";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";

const AddSpotScreen = ({route, navigation}) => {

    const [spotName, setSpotName] = useState("");
    const [spotCoordonnees, setSpotCoordonnees] = useState({latitude: undefined, longitude: undefined});
    const [spotType, setSpotType] = useState("");
    const [spotDescription, setSpotDescription] = useState("");
    const [spotAddress, setSpotAddress] = useState("");

    const { user, userData, setUserData } = useContext(AuthContext);
    const idUser = userData.idUtilisateur;

    async function fetchCoordinates() {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: {
                q: spotAddress,
                format: 'json',
              },
            });
        
            const location = response.data[0];
            setSpotCoordonnees({ latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) });
          } catch (error) {
            console.error('Erreur Nominatim :', error);
          }
    }

    const saveSpot = async () => {

        await fetchCoordinates();
        console.log(spotCoordonnees)

        const formattedSpot = {
            nom: spotName,
            coordonnees: spotCoordonnees,
            type: spotType,
            description: spotDescription,
        }

        error = (await SpotRepository.addSpot(formattedSpot, idUser)).error;
        if (error) {
            console.error(error)
        }
    }
    
    return (
        <SafeAreaView>
            <View>
                <TextInput 
                    value={spotName}
                    onChangeText={setSpotName}
                    placeholder="Nom du spot"
                />
                <TextInput 
                    value={spotDescription}
                    onChangeText={setSpotDescription}
                    placeholder="Description du spot"
                />
                <TextInput 
                    value={spotType}
                    onChangeText={setSpotType}
                    placeholder="Type du spot"
                />
                <TextInput 
                    value={spotAddress}
                    onChangeText={setSpotAddress}
                    placeholder="Adresse du spot"
                />
                <TouchableOpacity
                    onPress={saveSpot}
                >
                    <Text>Enregistrer le spot</Text>
                </TouchableOpacity>
            </View>
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

export default AddSpotScreen;
