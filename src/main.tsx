import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./routes/Main";
import Page404 from "./routes/404";
import Proiecte from "./routes/Proiecte";
import Harta from "./routes/Proiecte/Harta";
import Blog from "./routes/Blog";

import "flowbite";

if (window.location.pathname == "/proiecte/harta") {
  document.documentElement.classList.add("overflow-hidden");
  document.body.classList.add("overflow-hidden");
  document.getElementById("root")?.classList.add("overflow-hidden");
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Page404 />} />

        <Route path="/" element={<Main />}>
          <Route path="/proiecte" element={<Proiecte />} />
          <Route path="/blog" element={<Blog />}>
            <Route path=":id" />
          </Route>
        </Route>

        <Route path="/proiecte/harta" element={<Harta />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
