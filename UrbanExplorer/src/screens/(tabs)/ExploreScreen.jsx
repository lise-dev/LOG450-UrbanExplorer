import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import SpotRepository from "../../repositories/SpotRepository";
import { useNavigation } from "@react-navigation/native";
import {FAB} from "react-native-paper";


export default function ExploreScreen({ navigation }) {

  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Location Loading.....');
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
  const [ currentLocation, setCurrentLocation ] = useState({latitude: 0, longitude: 0});
  const [spots, setSpots] = useState([]);

  useEffect(() => {

    const initialize = async () => {
      await checkIfLocationEnabled();
      await getCurrentLocation();
      await fetchSpots();
    }

    initialize();

  }, [])

  //check if location is enable or not
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();       //returns true or false
    if (!enabled) {                     //if not enable 
      Alert.alert('Location not enabled', 'Please enable your Location', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      setLocationServicesEnabled(enabled)         //store true into state
    }
  }
  //get current location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();  //used for the pop up box where we give permission to use location 
    // console.log(status);
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
    // console.log(coords)

    if (coords) {
      const { latitude, longitude } = coords;
      setCurrentLocation({latitude: latitude, longitude: longitude})
      // console.log(latitude, longitude);

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
    // console.log("allSpots :", allSpots)
  }



  // console.log(spots)

  return (
    <SafeAreaView style={{flex: 1}}>
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


      {/* Modifier pour que ça soit accessible uniquement aux contributeurs */}
      <FAB
        icon={'plus'}
        style={[localStyles.fab, {right: 16}]}
        onPress={() => {
          navigation.navigate("AddSpotScreen")
        }}
      />

      <FAB
        icon={'rotate-right'}
        style={[localStyles.fab, {left: 16}]}
        onPress={async () => {
          await fetchSpots();
        }}
      />

      {/* <TouchableOpacity
        onPress={fetchSpots}
      >
        <Text>Récupérer les spots</Text>
      </TouchableOpacity> */}

    </SafeAreaView>
  )

}


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#e8f5e9',
},
});



