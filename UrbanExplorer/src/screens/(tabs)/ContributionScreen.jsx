import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvisRepository from "../../repositories/AvisRepository";
import { AuthContext } from "../../../AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import ContributionsItem from "../../components/ContributionsItem";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "../../styles/GlobalStyle";

const ContributionScreen = ({ navigation }) => {

  const [contributionsList, setContributionsList] = useState([]);
  const { user, userData, setUserData } = useContext(AuthContext);
  const idUser = userData.idUtilisateur;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!idUser) {
      setLoading(false)
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      const [dataAvis] = await Promise.all([
        AvisRepository.getAvisByUserId(idUser),
      ]);
      setContributionsList(dataAvis);
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


  // useFocusEffect(
  //   useCallback(() => {
      
  //     const fetchData = async () => {
  //       try {
  //         const dataAvis = await AvisRepository.getAvisByUserId(idUser);
  //         setContributionsList(dataAvis);
  //       } catch (error) {
  //         console.error(error);
  //       }

  //     }

  //     fetchData();

  //   }, [idUser])
  // );

  return (
    <SafeAreaView>
      <View>
        <ScrollView>
            {contributionsList.map((item) => (
              <ContributionsItem
                key={item.idAvis}
                idSpot={item.idSpot}
                spotName="" // TODO : récupérer les données du spot et les passer ici.
                spotType=""
                idAvis={item.idAvis}
                description={item.texte}
                note={item.note}
              />
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

}

export default ContributionScreen;