import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./routes/Main";
import Home from "./routes/Home";

import Proiecte from "./routes/Proiecte";
import Harta from "./routes/Proiecte/Harta";

import Colab from "./routes/Colab";
import ColabDelete from "./routes/Colab/ColabDelete";
import ColabEdit from "./routes/Colab/ColabEdit";
import ColabNew from "./routes/Colab/ColabNew";
import ColabPost from "./routes/Colab/ColabPost";

import Blog from "./routes/Blog";
import BlogPost from "./routes/Blog/BlogPost";
import BlogEdit from "./routes/Blog/BlogEdit";
import BlogDelete from "./routes/Blog/BlogDelete";
import BlogNew from "./routes/Blog/BlogNew";

import Page404 from "./routes/404";

import { createFirebaseApp, firebaseConfig } from "./lib/firebase";

createFirebaseApp(firebaseConfig);

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
          <Route path="" element={<Home />} />
          <Route path="/proiecte" element={<Proiecte />} />
          <Route path="/blog">
            <Route path="" element={<Blog />} />
            <Route path=":id">
              <Route path="" element={<BlogPost />} />
              <Route path="edit" element={<BlogEdit />} />
              <Route path="delete" element={<BlogDelete />} />
            </Route>
            <Route path="new" element={<BlogNew />} />
          </Route>
          <Route path="/colab">
            <Route path="" element={<Colab />} />
            <Route path=":id">
              <Route path="" element={<ColabPost />} />
              <Route path="edit" element={<ColabEdit />} />
              <Route path="delete" element={<ColabDelete />} />
            </Route>
            <Route path="new" element={<ColabNew />} />
          </Route>
        </Route>

        <Route path="/proiecte/harta" element={<Harta />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
