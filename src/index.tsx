import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { Settings } from "luxon";
import "mapbox-gl/dist/mapbox-gl.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createFirebaseApp, firebaseConfig } from "./lib/firebase";
import Wrapper from "./Wrapper";

createFirebaseApp(firebaseConfig);
enableIndexedDbPersistence(getFirestore());

Settings.defaultLocale = "ro";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <Wrapper />
  </StrictMode>
);
