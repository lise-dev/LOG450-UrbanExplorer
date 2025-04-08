// utils/validators.js

import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { dbTables } from "../constants/dbInfo";
import roles from "../constants/roles";

// Vérifier si un pseudo existe déjà
export const checkPseudoExists = async (pseudo, idUser = null) => {
  try {
    const pseudoQuery = query(collection(db, dbTables.USERS), where("pseudo", "==", pseudo.toLowerCase()), where("idUtilisateur", "!=", idUser));
    const querySnapshot = await getDocs(pseudoQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error(error);
  }
};

// Vérifier si un email existe déjà
export const checkEmailExists = async (email) => {
  const emailQuery = query(collection(db, dbTables.USERS), where("email", "==", email.toLowerCase()));
  const querySnapshot = await getDocs(emailQuery);
  return !querySnapshot.empty;
};

// Vérifier si un rôle est valide
export const isValidRole = (role) => {
  return roles.includes(role);
  // return ["contributeur", "explorateur", "moderateur"].includes(role);
};

// Vérifier si une note est valide (entre 1 et 5)
export const isValidNote = (note) => {
  return typeof note === "number" && note >= 1 && note <= 5;
};

// Vérifier si un texte est valide
export const isValidText = (text) => {
  return typeof text === "string" && text.trim().length > 0;
};

// Vérifier si l'eamil est valide
export const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

// Vérifier si un spot existe
export const checkSpotExists = async (spotId) => {
  const spotRef = doc(db, dbTables.SPOTS, spotId);
  const spotDoc = await getDoc(spotRef);
  return spotDoc.exists();
};

export const checkUserExists = async (userId) => {
  const userRef = doc(db, dbTables.USERS, userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists();
};

// Vérifier le rôle d'un utilisateur
export const getUserRole = async (userId) => {
  if (!userId) return null;
  try {
    const userRef = doc(db, dbTables.USERS, userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle utilisateur :", error);
    return null;
  }
};

// Vérifier si un favori existe déjà pour cet utilisateur et ce spot
export const checkFavoriExists = async (userId, spotId) => {
  if (!userId || !spotId) return false;

  const favorisRef = collection(db, dbTables.USERS, userId, "favoris");
  const favorisQuery = query(
      favorisRef,
      where("idSpot", "==", spotId)
  );
  const favorisSnapshot = await getDocs(favorisQuery);
  return !favorisSnapshot.empty;
};

// Vérifier si un type de récompense est valide
const isValidRewardType = (type) => {
  return type === "badge" || type === "points";
};

// Vérifier si les points sont valides
const isValidPoints = (points) => {
  return typeof points === "number" && points >= 0;
};

// Vérifier si un niveau de sanction est valide
const isValidSanctionLevel = (level) => {
  return ["avertissement", "suspension temporaire", "bannissement"].includes(level.toLowerCase());
};

// Vérifier si une date d'expiration est valide (sauf pour bannissement)
const isValidDate = (date, niveau) => {
  return (niveau === "bannissement" && date === null) || (typeof date === "string" && !isNaN(Date.parse(date)));
};

// Vérifier si un contenu signalé existe (avis ou spot)
const checkContentExistsAvisSpots = async (categorieContenu, idContenu) => {
  const collectionName = categorieContenu === "avis" ? "avis" : "spots";
  const contentRef = doc(db, collectionName, idContenu);
  const contentDoc = await getDoc(contentRef);
  return contentDoc.exists();
};

// Vérifier si les coordonnées sont valides
export const isValidCoordinates = (coords) => {
  return (
    coords &&
    typeof coords.latitude === "number" &&
    typeof coords.longitude === "number" &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
};
