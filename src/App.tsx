import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth";
import { BlogProvider } from "./context/Blog";

const Page404 = lazy(() => import("./routes/404"));
const Blog = lazy(() => import("./routes/Blog"));
const BlogDelete = lazy(() => import("./routes/Blog/BlogDelete"));
const BlogEdit = lazy(() => import("./routes/Blog/BlogEdit"));
const BlogNew = lazy(() => import("./routes/Blog/BlogNew"));
const BlogPost = lazy(() => import("./routes/Blog/BlogPost"));
const Colab = lazy(() => import("./routes/Colab"));
const ColabDelete = lazy(() => import("./routes/Colab/ColabDelete"));
const ColabEdit = lazy(() => import("./routes/Colab/ColabEdit"));
const ColabNew = lazy(() => import("./routes/Colab/ColabNew"));
const ColabPost = lazy(() => import("./routes/Colab/ColabPost"));
const Home = lazy(() => import("./routes/Home"));
const Main = lazy(() => import("./routes/Main"));
const Proiecte = lazy(() => import("./routes/Proiecte"));
const Harta = lazy(() => import("./routes/Proiecte/Harta"));
const User = lazy(() => import("./routes/User"));
const Login = lazy(() => import("./routes/User/Login"));
const Logout = lazy(() => import("./routes/User/Logout"));
const Register = lazy(() => import("./routes/User/Register"));
const Settings = lazy(() => import("./routes/User/Settings"));

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="w-full h-screen flex flex-row justify-center items-center space-x-2 font-custom">
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin"
                />
                <span>Se incarca...</span>
              </div>
            }
          >
            <Routes>
              <Route path="*" element={<Page404 />} />

              <Route path="/" element={<Main />}>
                <Route path="" element={<Home />} />

                <Route path="/proiecte" element={<Proiecte />} />

                <Route path="/blog">
                  <Route path="" element={<Blog />} />
                  <Route path="new" element={<BlogNew />} />
                  <Route path=":id">
                    <Route path="" element={<BlogPost />} />
                    <Route path="edit" element={<BlogEdit />} />
                    <Route path="delete" element={<BlogDelete />} />
                  </Route>
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
                  <Route path=":id" element={<User />} />
                  <Route path="login" element={<Login />} />
                  <Route path="logout" element={<Logout />} />
                  <Route path="register" element={<Register />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              <Route path="/proiecte/harta" element={<Harta />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
