import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, Button } from "react-native";
import FirestoreRepository from "./src/repositories/FirestoreRepository";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await FirestoreRepository.getUsers();
      setUsers(usersList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const addUser = async () => {
    const newUser = {
      nom: "bernard",
      prenom: "sophie",
      pseudo: "sophie_explo",
      email: "sophie.bernard@example.com",
      dateinscription: new Date(),
      role: "explorateur",
      photoprofil: "sophieBernard.png"
    };

    const userId = await FirestoreRepository.addUser(newUser);
    setUsers(prevUsers => [...prevUsers, { idutilisateur: userId, ...newUser }]); // Met à jour l'affichage
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Ajouter un utilisateur" onPress={addUser} />
      {users.length > 0 ? (
        users.map(user => (
          <Text key={user.id} style={styles.text}>
            {user.pseudo} - {user.role}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>Aucun utilisateur trouvé</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});
