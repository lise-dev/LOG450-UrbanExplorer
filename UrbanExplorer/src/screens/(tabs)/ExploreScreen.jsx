import React, { useCallback, useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import SpotRepository from "../../repositories/SpotRepository";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {FAB} from "react-native-paper";
import { AuthContext } from "../../../AuthContext";
import { styles } from "../../styles/GlobalStyle";
import roles from "../../constants/roles";



export default function ExploreScreen({ navigation }) {

  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Location Loading.....');
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
  const [ currentLocation, setCurrentLocation ] = useState({latitude: 0, longitude: 0});
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, userData, setUserData } = useContext(AuthContext);
  // const idUser = userData.idUtilisateur;
  const [idUser, setIdUser] = useState(null);


  //check if location is enable or not
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert('Location not enabled', 'Please enable your Location', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      setLocationServicesEnabled(enabled)
    }
  }
  //get current location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();  //used for the pop up box where we give permission to use location 
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow the app to use the location services', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }

    //get current position lat and long
    const { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      setCurrentLocation({latitude: latitude, longitude: longitude})

      //provide lat and long to get the the actual address
      let responce = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      // console.log(responce);
      //loop on the responce to get the actual result
      for (let item of responce) {
        let address = `${item.name} ${item.city} ${item.postalCode}`
        setDisplayCurrentAddress(address)
      }
    }
  }

  const fetchSpots = async () => {
    const allSpots = await SpotRepository.getSpots()
    setSpots(allSpots);
  }



  const initialize = async () => {

    try {
      await checkIfLocationEnabled();
      await fetchSpots();
    } catch (error) {
      console.error("Erreur de chargement", error);
    }

  }

  useEffect(() => {
    const fetchLocation = async () => {
      await getCurrentLocation();
    }
    fetchLocation();
  }, []);

  useFocusEffect(useCallback(() => {
    initialize();
    if (userData !== null) {
      setIdUser(userData.idUtilisateur);
      console.log(userData.idUtilisateur)

    }
  }, [userData]))



  return (
    <View style={{flex: 1}}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      <Marker
        coordinate={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }}
        title="Vous êtes ici"
        description="Votre position actuelle"
        pinColor="blue"
      />

      {spots.map(spot => (
        <Marker
        key={spot.idSpot}
          coordinate={{
            latitude: spot.coordonnees.latitude,
            longitude: spot.coordonnees.longitude,
          }}
          title={spot.nom}
          description={spot.description}
          pinColor="red"
          onPress={() => {
            navigation.navigate('DetailScreen', {
              idSpot: spot.idSpot,
            });
          }}
        />
      ))}

      </MapView>


      {/* Modifier pour que ça soit accessible uniquement aux contributeurs et modérateurs */}
      {idUser !== null && userData.role !== roles.explorateur && (
        <FAB
          icon={'plus'}
          style={[localStyles.fab, {right: 16}]}
          onPress={() => {
            navigation.navigate("AddSpotScreen")
          }}
        />
      )}
      

      <FAB
        icon={'rotate-right'}
        style={[localStyles.fab, {left: 16}]}
        onPress={async () => {
          await fetchSpots();
          await getCurrentLocation();
        }}
      />

    </View>
  )

}


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#e8f5e9',
},
});



