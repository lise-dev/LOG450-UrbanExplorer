import {SafeAreaView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, Keyboard } from "react-native";
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
import TypeRepository from "../repositories/TypeRepository";
import { Picker } from "@react-native-picker/picker"; 
import DropDownPicker from "react-native-dropdown-picker";
import { defaultSpotTypes } from "../constants/spotTypes";
import AvisRepository from "../repositories/AvisRepository";



const AddAvisScreen = ({route, navigation}) => {

    // const [spotName, setSpotName] = useState("");
    // const [spotCoordonnees, setSpotCoordonnees] = useState({latitude: undefined, longitude: undefined});
    // const [spotType, setSpotType] = useState("");
    // const [spotDescription, setSpotDescription] = useState("");
    // const [spotAddress, setSpotAddress] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [ descriptionAvis, setDescriptionAvis] = useState("");
    const [ noteAvis, setNoteAvis] = useState(-1);


    const { user, userData, setUserData } = useContext(AuthContext);
    const idUser = userData.idUtilisateur;
    const params = route.params;


    // const fetchCoordinates = async () => {
    //     try {
    //         const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    //           params: {
    //             q: spotAddress,
    //             format: 'json',
    //           },
    //         });
        
    //         const location = response.data[0];
    //         setSpotCoordonnees({ latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) });
    //       } catch (error) {
    //         console.error('Erreur Nominatim :', error);
    //       }
    // }

    // const saveSpot = async () => {

    //     await fetchCoordinates();
    //     console.log(spotCoordonnees)

    //     const formattedSpot = {
    //         nom: spotName,
    //         coordonnees: spotCoordonnees,
    //         type: spotType,
    //         description: spotDescription,
    //     }

    //     const response = await SpotRepository.addSpot(formattedSpot, idUser)
    //     if (response.error) {
    //         console.error(error)
    //     } else {
    //         setSnackbarMessage("Lieu ajouté avec succès")
    //         setSnackbarVisible(true);
    //     }
    // }

    const saveAvis = async () => {

        Keyboard.dismiss();

        const formattedAvis = {
            idSpot: params.idSpot,
            texte: descriptionAvis,
            note: noteAvis,
        }

        const response = await AvisRepository.addAvis(formattedAvis, idUser)
        if (response.error) {
            // console.error(response.error)
            setSnackbarMessage(response.error)
            setSnackbarVisible(true)
        } else {
            setSnackbarMessage("Avis bien ajouté")
            setSnackbarVisible(true)
        }
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={localStyles.containerInput}>
                <TextInput 
                    style={localStyles.input}
                    value={descriptionAvis}
                    onChangeText={setDescriptionAvis}
                    placeholder="Description de l'avis"
                    autoFocus
                    autoCapitalize="sentences"
                />
                <TextInput 
                    style={localStyles.input}
                    value={noteAvis}
                    onChangeText={setNoteAvis}
                    placeholder="Note"
                    keyboardType="numeric"
                />
                {/* <TextInput 
                    style={localStyles.input}
                    value={spotType}
                    onChangeText={setSpotType}
                    placeholder="Type du spot"
                /> */}
                {/* type */}
                {/* <View style={styles.pickerContainer}>
                    <Picker
                    // selectedValue={role}
                    onValueChange={(itemValue) => setSpotType(itemValue)}
                    style={styles.picker}
                    >
                    {Object.entries(spotType).map(([key, value]) => (
                        <Picker.Item label={value} value={key} key={key}
                    />
                    ))}
                    </Picker>
                </View> */}

                <TouchableOpacity
                    style={localStyles.button}
                    onPress={saveAvis}
                >
                    <Text style={localStyles.textButton}>Enregistrer l'avis</Text>
                </TouchableOpacity>
            </View>

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
        right: 16,
        bottom: 16,
        backgroundColor: '#e8f5e9',
    },
    containerInput: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 30
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#F5F5F5", 
        marginBottom: 10,
        fontStyle: "italic",
        color: "#a7a7a7",
    },
    button: {
        backgroundColor: "#2E7D32",
        padding: 15,
        borderRadius: 25,
        margin: 20
    },
    textButton: {
        color: "white"
    },
    pickerContainer: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 25,
        backgroundColor: "#F5F5F5",
        marginBottom: 10,
        justifyContent: "center",
      },
      
      picker: {
        // height: 50,
        width: "100%",
        color: "#757575",
      },

});

export default AddAvisScreen;
