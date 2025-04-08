import { auth, db } from "../../firebaseConfig";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

let promptAsync = null;

const AuthRepository = {
  configureGoogleAuth: () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: "902366533112-e45edtiul28q0u72copcbv7co1queuli.apps.googleusercontent.com", // web
      androidClientId: "902366533112-v5dq57sffg0cr9u7gtsbhdp2oodgujra.apps.googleusercontent.com", // android
      iosClientId: "902366533112-6n8ea8i3vj7lmodiq49pk5ftgg6rfm3q.apps.googleusercontent.com", // ios (si dispo)
      redirectUri: makeRedirectUri({ useProxy: true }),
    });

    promptAsync = googlePromptAsync;
  },

  signInWithGoogle: async () => {
    try {
      const result = await promptAsync();
      if (result?.type === "success") {
        const { id_token } = result.authentication;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        return { success: true, user: userCredential.user };
      } else {
        return { error: "Connexion Google annulée" };
      }
    } catch (error) {
      console.error("Erreur Google :", error);
      return { error: error.message || "Erreur inconnue" };
    }
  },

  login: async (email, password) => {
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { error: error.message };
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  observeUser: (callback) => {
    return auth.onAuthStateChanged(callback);
  }
};

export default AuthRepository;
