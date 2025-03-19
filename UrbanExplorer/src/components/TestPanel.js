/*
* Crée le 18 mars 2025
* Test connection à Firebase
* CRUD pour toutes les collections
*/

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const TestPanel = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collections, setCollections] = useState([
    "utilisateurs", "spots", "avis", "signalements", "favoris", "photos", "notifications", "recompenses", "sanctions"
  ]);
  const [data, setData] = useState({});
  const [newData, setNewData] = useState({});
  const [editing, setEditing] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    let tempData = {};
    for (let collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      tempData[collectionName] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    setData(tempData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addDocument = async (collectionName) => {
    if (!newData[collectionName]) return;
    await addDoc(collection(db, collectionName), newData[collectionName]);
    setNewData({ ...newData, [collectionName]: {} });
    fetchData();
  };

  const updateDocument = async (collectionName, id) => {
    if (!editing[collectionName]) return;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, editing[collectionName]);
    setEditing({ ...editing, [collectionName]: null });
    fetchData();
  };

  const deleteDocument = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    fetchData();
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Erreur de connexion : " + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Erreur d'inscription : " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Urban Explorer App</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>🧭 Panneau de Test - Firebase</Text>
      
      {!user ? (
        <View style={{ marginBottom: 20 }}>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
          <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginBottom: 10 }} />
          <Button title="Se connecter" onPress={handleLogin} />
          <Button title="Créer un compte" onPress={handleRegister} />
        </View>
      ) : (
        <View style={{ marginBottom: 20 }}>
          <Text>Connecté en tant que : {user.email}</Text>
          <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
      )}

      {collections.map((collectionName) => (
        <View key={collectionName} style={{ marginBottom: 40, padding: 10, borderBottomWidth: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{collectionName.toUpperCase()}</Text>

          <FlatList
            data={data[collectionName] || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <Text>{JSON.stringify(item)}</Text>
                <TouchableOpacity onPress={() => deleteDocument(collectionName, item.id)}>
                  <Text style={{ color: "red" }}>Supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditing({ ...editing, [collectionName]: item })}>
                  <Text style={{ color: "blue" }}>Modifier</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          
          {editing[collectionName] ? (
            <View>
              <Text>Modifier {collectionName}</Text>
              {Object.keys(editing[collectionName]).map((key) => (
                <TextInput
                  key={key}
                  placeholder={key}
                  value={editing[collectionName][key] || ""}
                  onChangeText={(text) => setEditing({ ...editing, [collectionName]: { ...editing[collectionName], [key]: text } })}
                  style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
              ))}
              <Button title="Mettre à jour" onPress={() => updateDocument(collectionName, editing[collectionName].id)} />
            </View>
          ) : (
            <View>
              <Text>Ajouter {collectionName}</Text>
              {Object.keys(data[collectionName]?.[0] || {}).map((key) => (
                key !== "id" && (
                  <TextInput
                    key={key}
                    placeholder={key}
                    onChangeText={(text) => setNewData({ ...newData, [collectionName]: { ...newData[collectionName], [key]: text } })}
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                  />
                )
              ))}
              <Button title={`Ajouter ${collectionName}`} onPress={() => addDocument(collectionName)} />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default TestPanel;
