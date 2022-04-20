import { Settings } from "luxon";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
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

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
