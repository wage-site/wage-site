import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./routes/Home";
import Page404 from "./routes/404";
import Proiecte from "./routes/Proiecte";
import Harta from "./routes/Proiecte/Harta";
import Blog from "./routes/Blog";

if (window.location.pathname == "/proiecte/harta") {
  document.documentElement.classList.add("overflow-hidden");
  document.body.classList.add("overflow-hidden");
  document.getElementById("root")?.classList.add("overflow-hidden");
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/proiecte" element={<Proiecte />}></Route>
        <Route path="/proiecte/harta" element={<Harta />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
