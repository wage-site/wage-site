import { FirebaseOptions, getApp, initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyCoYhAl6MejwvSYooMrXpS_3M8VZyIXup8",
  authDomain: "wage-site.firebaseapp.com",
  projectId: "wage-site",
  storageBucket: "wage-site.appspot.com",
  messagingSenderId: "977249799406",
  appId: "1:977249799406:web:2141afbd756aad578977ff",
  measurementId: "G-RGFGTKC890",
};

export function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}
