# Repositories - Urban Explorer


1. [AuthRepository.js - Gestion de l'authentification](#authrepositoryjs---gestion-de-lauthentification)
2. [UserRepository.js - Gestion des utilisateurs](#userrepositoryjs---gestion-des-utilisateurs)
3. [SpotRepository.js - Gestion des Spots](#spotrepositoryjs---gestion-des-spots)

---

## `AuthRepository.js` - Gestion de l'authentification Firebase

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

---

## `UserRepository.js` - Gestion des utilisateurs

Gère les interactions avec la collection `utilisateurs` dans Firestore.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getUsers()` | Récupère tous les utilisateurs de la base. |
| `editUser(userId, requesterId, updatedData)` | Modifie un utilisateur (seulement lui-même). |
| `deleteUser(userId, requesterId)` | Supprime un utilisateur (lui-même ou un modérateur). |

### Règles métier
- **Un utilisateur ne peut modifier que son propre compte.**
- **Un utilisateur ne peut se supprimer que lui-même, sauf si le modérateur supprime un compte.**
- **Les champs sont forcés en minuscule (`email`, `pseudo`, `role`).**
- **Le `pseudo` doit être unique.**
- **Le `role` est limité à `contributeur`, `explorateur`, `moderateur`.**

---

## `SpotRepository.js` - Gestion des Spots

Gère l'ajout, la modification et la suppression des spots.

| Fonction | Description |
|----------|------------|
| `getSpots()` | Récupère tous les spots enregistrés. |
| `addSpot(newSpot, userId)` | Ajoute un spot (uniquement contributeur ou modérateur). |
| `editSpot(spotId, userId, updatedData)` | Modifie un spot (seulement le créateur ou un modérateur). |
| `deleteSpot(spotId, userId)` | Supprime un spot (seulement le créateur ou un modérateur). |

### Règles métier
- **Seul un `contributeur` ou `moderateur` peut ajouter un spot.**
- **Seul le créateur du spot ou un `moderateur` peut le modifier ou le supprimer.**
- **Les champs `nom`, `coordonnees`, `type` sont obligatoires (`description` peut être `null`).**
- **Les noms et types sont forcés en minuscule et ne contiennent que des lettres/chiffres.**



