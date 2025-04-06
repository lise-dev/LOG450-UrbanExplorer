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
import TypeRepository from "../repositories/TypeRepository";
import { Picker } from "@react-native-picker/picker"; 
import DropDownPicker from "react-native-dropdown-picker";
import { defaultSpotTypes } from "../constants/spotTypes";



const AddSpotScreen = ({route, navigation}) => {

    const [spotName, setSpotName] = useState("");
    // const [spotCoordonnees, setSpotCoordonnees] = useState({latitude: undefined, longitude: undefined});
    const [spotType, setSpotType] = useState("");
    const [spotDescription, setSpotDescription] = useState("");
    const [spotAddress, setSpotAddress] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [spotTypes, setSpotTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemsTypes, setItemsTypes] = useState([]);
    const [buttonEnabled, setButtonEnabled] = useState(true);


    const { user, userData, setUserData } = useContext(AuthContext);
    const idUser = userData.idUtilisateur;

    useEffect(() => {
        const fetchSpotTypes = async () => {
            const types = await TypeRepository.getTypes();
            // console.log("$$ les types:", types.map(type => type.description))
            // console.log("$$ les types:", types.map(type => ({
            //     label: type.description,
            //     value: type.idType
            // })))
            setItemsTypes(types.map(type => ({
                label: type.description,
                value: type.idType
            })));
            setItemsTypes([])
            // console.log(types[0].description)
            // setSpotType(types[0].description)
        }

        fetchSpotTypes();
    }, []);

    const fetchCoordinates = async () => {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: {
                q: spotAddress,
                format: 'json',
              },
            });
            console.log("reponse :", response);
        
            const location = response.data[0];
            return {latitude: parseFloat(location.lat), longitude: parseFloat(location.lon)};
            // setSpotCoordonnees({ latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) });
          } catch (error) {
            console.error('Erreur Nominatim :', error);
            return undefined;
          }
    }

    const saveSpot = async () => {
        try {
            setButtonEnabled(false);
    
            const coordonnees = await fetchCoordinates();
            console.log("retour coordonnees", coordonnees)
    
            const formattedSpot = {
                nom: spotName,
                coordonnees: coordonnees,
                type: spotType,
                description: spotDescription,
            }

            console.log("formattedSpot:", formattedSpot)
    
            const response = await SpotRepository.addSpot(formattedSpot, idUser)
            if (response.error) {
                console.error(response.error)
                setButtonEnabled(true);
            } else {
                setSnackbarMessage("Lieu ajouté avec succès")
                setSnackbarVisible(true);
                setButtonEnabled(false);
            }
            
        } catch (error) {
            console.error(error)
            setButtonEnabled(true);
        }
    }
    
    // console.log(itemsTypes);
    // console.log(defaultSpotTypes);

    return (
        <SafeAreaView style={styles.container}>
            <View style={localStyles.containerInput}>
                <TextInput 
                    style={localStyles.input}
                    value={spotName}
                    onChangeText={setSpotName}
                    placeholder="Nom du spot"
                    autoFocus
                    autoCapitalize="words"
                />
                <TextInput 
                    style={localStyles.input}
                    value={spotDescription}
                    onChangeText={setSpotDescription}
                    placeholder="Description du lieu"
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

                <View style={{ zIndex: 1000, width: '100%' }}>
                    <DropDownPicker
                        open={open}
                        value={spotType}
                        items={itemsTypes.length !== 0 ? itemsTypes : defaultSpotTypes}
                        setOpen={setOpen}
                        setValue={setSpotType}
                        setItems={setItemsTypes}
                        placeholder="Type de spot"
                        style={localStyles.input}
                        dropDownContainerStyle={{ borderColor: '#A5D6A7' }}
                    />
                </View>



                <TextInput 
                    style={localStyles.input}
                    value={spotAddress}
                    onChangeText={setSpotAddress}
                    placeholder="Adresse du spot"
                />
                <TouchableOpacity
                    style={localStyles.button}
                    onPress={saveSpot}
                    disabled={!buttonEnabled}
                >
                    <Text style={localStyles.textButton}>Enregistrer le spot</Text>
                </TouchableOpacity>
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => {
                    setSnackbarVisible(false);
                    navigation.goBack();
                }}
                duration={2000}
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

export default AddSpotScreen;
