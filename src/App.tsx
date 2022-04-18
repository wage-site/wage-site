import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page404 from "./routes/404";
import Blog from "./routes/Blog";
import BlogDelete from "./routes/Blog/BlogDelete";
import BlogEdit from "./routes/Blog/BlogEdit";
import BlogNew from "./routes/Blog/BlogNew";
import BlogPost from "./routes/Blog/BlogPost";
import Colab from "./routes/Colab";
import ColabDelete from "./routes/Colab/ColabDelete";
import ColabEdit from "./routes/Colab/ColabEdit";
import ColabNew from "./routes/Colab/ColabNew";
import ColabPost from "./routes/Colab/ColabPost";
import Home from "./routes/Home";
import Main from "./routes/Main";
import Proiecte from "./routes/Proiecte";
import Harta from "./routes/Proiecte/Harta";
import User from "./routes/User";
import Login from "./routes/User/Login";
import Logout from "./routes/User/Logout";
import Register from "./routes/User/Register";
import Settings from "./routes/User/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Page404 />} />

        <Route path="/" element={<Main />}>
          <Route path="" element={<Home />} />

          <Route path="/proiecte" element={<Proiecte />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/new" element={<BlogNew />} />
          <Route path="/blog/:id">
            <Route path="" element={<BlogPost />} />
            <Route path="edit" element={<BlogEdit />} />
            <Route path="delete" element={<BlogDelete />} />
          </Route>

          <Route path="/colab" element={<Colab />} />
          <Route path="/colab/new" element={<ColabNew />} />
          <Route path="/colab/:id">
            <Route path="" element={<ColabPost />} />
            <Route path="edit" element={<ColabEdit />} />
            <Route path="delete" element={<ColabDelete />} />
          </Route>

          <Route path="/user">
            <Route path="" element={<User />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="register" element={<Register />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/proiecte/harta" element={<Harta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
