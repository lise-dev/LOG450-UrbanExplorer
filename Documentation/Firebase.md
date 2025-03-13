# Repositories - Urban Explorer

## `AuthRepository.js` - Gestion de l'authentification Firebase

### Description
Gère l'inscription, la connexion, la déconnexion et la récupération des profils utilisateurs.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `register(email, password, nom, prenom, pseudo, role, photoProfil)` | Inscrit un utilisateur dans Firebase Auth et enregistre son profil Firestore. |
| `login(email, password)` | Connecte un utilisateur avec Firebase Auth. |
| `logout()` | Déconnecte l'utilisateur actuel. |
| `observeUser(callback)` | Surveille les changements d'état de connexion. |
| `getUserProfile(userId)` | Récupère le profil d'un utilisateur Firestore. |

### Règles métier
- **Tous les champs sont obligatoires sauf `photoProfil`.**
- **`pseudo` et `email` doivent être uniques.**
- **Le `role` doit être `contributeur`, `explorateur` ou `moderateur`.**
- **`photoProfil` est stockée sous `picture/userprofile/PPpseudo.png`.**

