import { Settings } from "luxon";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import { createFirebaseApp, firebaseConfig } from "./lib/firebase";

createFirebaseApp(firebaseConfig);

Settings.defaultLocale = "ro";

if (window.location.pathname == "/proiecte/harta") {
  document.documentElement.classList.add("overflow-hidden");
  document.body.classList.add("overflow-hidden");
  document.getElementById("root")?.classList.add("overflow-hidden");
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
