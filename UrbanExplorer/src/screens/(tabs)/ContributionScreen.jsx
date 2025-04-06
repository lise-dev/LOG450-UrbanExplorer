import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AvisRepository from "../../repositories/AvisRepository";
import { AuthContext } from "../../../AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import ContributionsItem from "../../components/ContributionsItem";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "../../styles/GlobalStyle";
import SpotRepository from "../../repositories/SpotRepository";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Timestamp } from "firebase/firestore";

const ContributionScreen = ({ navigation }) => {

  const [contributionsList, setContributionsList] = useState([]);
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
        AvisRepository.getAvisByUserId(idUser),
        SpotRepository.getSpots(),
      ]);
      setContributionsList(dataAvis);
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

  const enrichedAvis = contributionsList.map((avis) => {
    const spot = spotList.find((s) => s.idSpot === avis.idSpot);
    return {
      idAvis: avis.idAvis,
      idUser: avis.idUser,
      idSpot: avis.idSpot,
      texte: avis.texte,
      note: avis.note,
      timestamp: avis.timestamp,
      spotName: spot.nom,
      spotType: spot.type,
      spotDescription: spot.description,
    }
  })

  const onEdit = () => {


  }
  
  const onDelete = async (idAvis) => {
    console.log("idAvis:", idAvis)
    try {
      await AvisRepository.deleteAvis(idAvis, idUser);
      onRefresh();
      
    } catch (error) {
      console.error(error)
    }

  }
  
  


  return (
    
    <View style={styles.container}>
        <GestureHandlerRootView style={localStyles.containerFlatlist}>
            <FlatList
              data={enrichedAvis}
              keyExtractor={(item) => item.idAvis}
              style={localStyles.listAvis}
              renderItem={({item}) => 
                // <Text>{item.texte}</Text>
                <ContributionsItem
                  key={item.idAvis}
                  idSpot={item.idSpot}
                  spotName={item.spotName}
                  spotType={item.spotType}
                  idAvis={item.idAvis}
                  description={item.texte}
                  note={item.note}
                  onEdit={onEdit}
                  onDelete={() => {onDelete(item.idAvis)}}
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
  }
})

export default ContributionScreen;