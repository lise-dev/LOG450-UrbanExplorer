# Repositories - Urban Explorer

1. [AuthRepository.js - Gestion de l'authentification](#authrepositoryjs---gestion-de-lauthentification)
2. [UserRepository.js - Gestion des utilisateurs](#userrepositoryjs---gestion-des-utilisateurs)
3. [SpotRepository.js - Gestion des Spots](#spotrepositoryjs---gestion-des-spots)
4. [AvisRepository.js - Gestion des Avis](#avisrepositoryjs---gestion-des-avis)
5. [SignalementRepository.js - Gestion des Signalements](#signalementrepositorjs---gestion-des-signalements)
6. [FavoriRepository.js - Gestion des Favoris](#favorirepositoryjs---gestion-des-favoris)
7. [PhotoRepository.js - Gestion des Photos](#photorepositoryjs---gestion-des-photos)
8. [NotificationRepository.js - Gestion des Notifications](#notificationrepositoryjs---gestion-des-notifications)
9. [RecompenseRepository.js - Gestion des Récompenses](#recompenserepositoryjs---gestion-des-récompenses)
10. [SanctionRepository.js - Gestion des Sanctions](#sanctionrepositoryjs---gestion-des-sanctions)

[TestPanel.js](../UrbanExplorer/TestPanel.js), Permet d'afficher et verifier le bon fonctionnement avec Firebase. 

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

---

## `AvisRepository.js` - Gestion des Avis

Gère l'ajout, la modification et la suppression des avis.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getAvis()` | Récupère tous les avis enregistrés. |
| `addAvis(newAvis, userId)` | Ajoute un avis (uniquement contributeur). |
| `editAvis(avisId, userId, updatedData)` | Modifie un avis (seulement le créateur ou un modérateur). |
| `deleteAvis(avisId, userId)` | Supprime un avis (seulement le créateur ou un modérateur). |

### Règles métier
- **Seul un `contributeur` ou un `moderateur` peut ajouter un avis.**
- **Seul le propriétaire ou un `moderateur` peut modifier/supprimer un avis.**
- **Les avis sont enregistrés en minuscule.**
- **Le champ `texte` est obligatoire.**
- **La `note` doit être comprise entre 1 et 5.**

---

## `SignalementRepository.js` - Gestion des Signalements

Gère l'ajout et la modification des signalements de contenu.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getReports(userId)` | Récupère tous les signalements (uniquement visible par les modérateurs). |
| `addReport(newReport, userId)` | Ajoute un signalement (uniquement `contributeur` ou `moderateur`). |
| `editReport(reportId, userId, updatedData)` | Modifie un signalement (uniquement `moderateur`). |

### Règles métier

- **Seul un `contributeur` ou un `moderateur` peut ajouter un signalement.**
- **Seul un `moderateur` peut voir et modifier un signalement.**
- **Les signalements ne peuvent pas être supprimés.**
- **Tous les champs sont obligatoires.**
- **Les clés étrangères `idUtilisateur` et `idContenu` doivent exister avant insertion.**
- **Le champ `categorieContenu` doit être `avis` ou `spot`.**
- **Les données sont enregistrées en minuscule.**

---

## `FavoriRepository.js` - Gestion des Favoris

Gère l'ajout et la suppression des favoris pour les utilisateurs.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getFavoris(userId)` | Récupère tous les favoris d'un utilisateur (uniquement ses propres favoris). |
| `addFavori(userId, spotId)` | Ajoute un favori (uniquement `contributeur` ou `moderateur`). |
| `deleteFavori(favoriId, userId)` | Supprime un favori (seulement le propriétaire du favori). |

### Règles métier

- **Seul un `contributeur` ou un `moderateur` peut ajouter un favori.**
- **Chaque utilisateur ne peut voir que ses propres favoris.**
- **Les favoris ne peuvent pas être modifiés.**
- **Un utilisateur peut supprimer uniquement ses propres favoris.**
- **Les clés étrangères `idUtilisateur` et `idSpot` doivent exister avant insertion.**
- **Un utilisateur ne peut pas enregistrer deux fois le même spot en favori.**
- **Toutes les données sont validées avant enregistrement.**

---

## `PhotoRepository.js` - Gestion des Photos

Gère l'ajout, la modification et la suppression des photos associées aux contenus.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getPhotosByContent(typeContenu, idContenu)` | Récupère toutes les photos liées à un contenu (`spot` ou `avis`). |
| `addPhoto(newPhoto, userId)` | Ajoute une photo (uniquement `contributeur` ou `moderateur`). |
| `editPhoto(photoId, userId, updatedData)` | Modifie une photo (uniquement `moderateur`). |
| `deletePhoto(photoId, userId)` | Supprime une photo (uniquement `moderateur`, si non référencée). |

### Règles métier

- **L'utilisateur doit être connecté et avoir le rôle contributeur ou moderateur pour ajouter une photo.**
- **Les photos ne peuvent être liées qu'à un spot ou un avis.**
- **La clé étrangère idContenu doit exister avant l'ajout.**
- **L’URL de la photo doit être un format d’image valide (jpg, jpeg, png).**
- **L'URL est enregistrée sous picture/photos/{nom_du_fichier} pour une organisation claire.**

---

## `NotificationRepository.js` - Gestion des Notifications

Gère l'ajout et la suppression des notifications utilisateurs.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getNotifications(userId)` | Récupère toutes les notifications d'un utilisateur (uniquement ses propres notifications). |
| `addNotification(userId, message)` | Ajoute une notification pour un utilisateur (générée automatiquement par l'application). |
| `deleteNotification(notificationId, userId)` | Supprime une notification (seulement si elle appartient à l'utilisateur). |

### Règles métier

- **Les notifications sont générées automatiquement par l'application.**
- **Un utilisateur peut voir uniquement ses propres notifications.**
- **Les notifications ne peuvent pas être modifiées.**
- **Un utilisateur peut supprimer uniquement ses propres notifications.**
- **Les clés étrangères `idUtilisateur` doivent exister avant insertion.**
- **Le message est enregistré en minuscule.**

---

## `RecompenseRepository.js` - Gestion des Récompenses

Gère l'ajout et la suppression des récompenses attribuées aux utilisateurs.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getRecompenses(userId)` | Récupère toutes les récompenses d'un utilisateur. |
| `addRecompense(moderatorId, userId, type, description, points)` | Ajoute une récompense (seul un `moderateur` peut attribuer une récompense). |
| `deleteRecompense(rewardId, userId)` | Supprime une récompense (uniquement un `moderateur`). |

### Règles métier

- **Seul un `moderateur` peut attribuer une récompense.**
- **Seuls les `contributeurs` et `moderateurs` peuvent recevoir une récompense.**
- **Les récompenses ne peuvent pas être modifiées.**
- **Un `moderateur` peut supprimer une récompense.**

---

## `SanctionRepository.js` - Gestion des Sanctions

Gère l'ajout et la suppression des sanctions appliquées aux utilisateurs.

### Fonctions disponibles

| Fonction | Description |
|----------|------------|
| `getSanctions(userId)` | Récupère toutes les sanctions d'un utilisateur (un modérateur voit toutes les sanctions). |
| `addSanction(moderatorId, userId, motif, niveau, dateExpiration)` | Ajoute une sanction (seul un `moderateur` peut attribuer une sanction). |
| `deleteSanction(sanctionId, userId)` | Supprime une sanction expirée (uniquement un `moderateur`). |

### Règles métier

- **Seul un `moderateur` peut attribuer une sanction.**
- **Seuls les `moderateurs` peuvent voir toutes les sanctions, les utilisateurs voient uniquement les leurs.**
- **Les sanctions ne peuvent pas être modifiées.**
- **Un `moderateur` peut supprimer une sanction expirée.**
- **Le `niveau` de sanction doit être `Avertissement`, `Suspension Temporaire` ou `Bannissement`.**
- **La `dateExpiration` est obligatoire sauf pour un bannissement.**
