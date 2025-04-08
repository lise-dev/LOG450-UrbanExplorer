import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AvisRepository from "../../repositories/AvisRepository";
import { AuthContext } from "../../../AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import ReviewAvisItem from "../../components/ReviewAvis";
import { ActivityIndicator,IconButton } from "react-native-paper";
import { styles } from "../../styles/GlobalStyle";
import SpotRepository from "../../repositories/SpotRepository";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Timestamp } from "firebase/firestore";
import SignalementRepository from "../../repositories/SignalementRepository";

const showAlert = () => {
  Alert.alert("Info", "Fonctionnalité pas encore implémentée");
}

const ModerationScreen = ({ navigation }) => {

  const [moderactionList, setModerationList] = useState([]);
  const { user, userData, setUserData } = useContext(AuthContext);
  const idUser = userData.idUtilisateur;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spotList, setSpotList] = useState([]);

  const fetchData = async () => {
    if (!idUser) {
      setLoading(false)
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      const [dataAvis, dataSpot] = await Promise.all([
        AvisRepository.getAvis(),
        SpotRepository.getSpots(),
      ]);
      setModerationList(dataAvis);
      setSpotList(dataSpot);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchData();
  }, [idUser]));

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const enrichedAvis = moderactionList.map((avis) => {
    let spot = spotList.find((s) => s.idSpot === avis.idSpot);
    return {
      idAvis: avis.idAvis,
      idUser: avis.idUtilisateur,
      idSpot: avis.idSpot,
      texte: avis.texte,
      note: avis.note,
      timestamp: avis.timestamp,
      estReporte: avis.estReporte,
      estVisible: avis.estVisible,
      spotName: spot.nom,
      spotType: spot.type,
      spotDescription: spot.description,
    }
  }).filter((item) => item.estReporte === false || item.estReporte === undefined);

  const onValidate = async (avis) => {
    try {
      await AvisRepository.editAvis(avis.idAvis, idUser, {...avis, estReporte: true, estVisible: true})
      onRefresh();
    } catch (error) {
      console.error(error);
    }

  }
  
  const onRefuse = async (avis) => {
    console.log("idAvis:", avis)
    try {
      await AvisRepository.editAvis(avis.idAvis, idUser, {...avis, estReporte: true, estVisible: false})
      const signalement = {
        categorieContenu: "avis",
        idContenu: avis.idAvis,
        raison: "TODO",
      }
      await SignalementRepository.addSignalement(signalement, idUser)
      onRefresh();
      
    } catch (error) {
      console.error(error)
    }

  }
  
  const IconButtonValidate = (avis) => {
    return (
      <IconButton icon="thumb-up-outline" iconColor="#00751d" containerColor="#e3ffea"
      style={localStyles.fab} onPress={() => onValidate(avis)}/>
    );
  }
  const IconButtonRefuse = (avis) => {
    return (
      <IconButton icon="thumb-down-outline" iconColor="#d32f2f" containerColor="#fdecea"
      style={localStyles.fab} onPress={() => onRefuse(avis)}/>
    );
  }
  

  return (
    
    <View style={styles.container}>
          {enrichedAvis.length === 0 && (
            <Text>Aucun avis</Text>
          )}
        <GestureHandlerRootView style={localStyles.containerFlatlist}>
            <FlatList
              data={enrichedAvis}
              keyExtractor={(item) => item.idAvis}
              style={localStyles.listAvis}
              renderItem={({item}) => 
                <ReviewAvisItem
                  key={item.idAvis}
                  idSpot={item.idSpot}
                  spotName={item.spotName}
                  spotType={item.spotType}
                  idAvis={item.idAvis}
                  description={item.texte}
                  note={item.note}
                  IconButtonTop={() => IconButtonValidate(item)}
                  IconButtonBottom={() => IconButtonRefuse(item)}
                />
              }
            
            />
      </GestureHandlerRootView>

    </View>

  );

}

const localStyles = StyleSheet.create({
  listAvis: {
    flex: 1,

  },
  containerFlatlist: {
    flex: 1
  },
  fab: {
    borderWidth: 1,
    borderColor: "grey"
},
})

export default ModerationScreen;