import {
  faChevronRight,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validate as mailValidate } from "email-validator";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Auth";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";

function Register() {
  useDocumentTitle("Register");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const { user, loading: userLoading } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (user && !loading && !userLoading) {
      navigate("/user", { replace: true });
    }
  }, [user, loading, navigate, userLoading]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [nameValid, setNameValid] = useState<boolean>(false);
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(true);

  const [nameErrText, setNameErrText] = useState("");
  const [usernameErrText, setUsernameErrText] = useState("");
  const [emailErrText, setEmailErrText] = useState("");
  const [passswordErrText, setPassswordErrText] = useState("");
  const [tokenErrText, setTokenErrText] = useState("");

  async function handleRegister() {
    setLoading(true);

    let tokens: string[] = [];
    let usernames: string[] = [];

    let canRun: boolean = true;

    const tokensSnap = await getDocs(collection(db, "tokens"));
    tokensSnap.forEach((doc) => {
      const data = doc.data();
      tokens.push(data.token);
    });

    const usersSnap = await getDocs(collection(db, "users"));
    usersSnap.forEach((doc) => {
      const data = doc.data();
      usernames.push(data.username);
    });

    if (!mailValidate(email)) {
      canRun = false;
      setLoading(false);
      setEmailValid(false);
      setEmailErrText("Please enter a valid email.");
    }
    if (password.length < 8) {
      canRun = false;
      setLoading(false);
      setPasswordValid(false);
      setPassswordErrText("Password must be at least 8 characters long.");
    }
    if (!tokens.includes(token)) {
      canRun = false;
      setLoading(false);
      setTokenValid(false);
      setTokenErrText("Token is not valid.");
    }
    if (usernames.includes(username)) {
      canRun = false;
      setLoading(false);
      setUsernameValid(false);
      setUsernameErrText("Username already in use.");
    }
    if (!RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim).test(username)) {
      canRun = false;
      setLoading(false);
      setUsernameValid(false);
      setUsernameErrText("Invalid username.");
    }
    if (!RegExp(/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u).test(name)) {
      canRun = false;
      setLoading(false);
      setNameValid(false);
      setNameErrText("Invalid name.");
    }

    if (canRun) {
      let errorCode: string = "";
      await createUserWithEmailAndPassword(auth, email, password).catch(
        (error) => {
          errorCode = error.code;
        }
      );
      switch (errorCode) {
        case "auth/email-already-in-use": {
          setEmailValid(false);
          setEmailErrText("Email already in use.");
        }
      }
      if (errorCode !== "") {
        setLoading(false);
        return;
      }
      const unsub = onSnapshot(
        doc(db, "users", auth.currentUser ? auth.currentUser.uid : ""),
        async (docSnap) => {
          if (docSnap.exists() && auth.currentUser) {
            await updateProfile(auth.currentUser, {
              displayName: name,
            });
            await updateDoc(
              doc(db, "users", auth.currentUser ? auth.currentUser.uid : ""),
              {
                username: username,
                name: name,
              }
            );
            unsub();
          }
        }
      );
      setLoading(false);
    } else {
      return;
    }
  }

  useEffect(() => {
    if (email.trim() === "") {
      setEmailValid(true);
      setEmailErrText("");
      return;
    }
    if (mailValidate(email)) {
      setEmailValid(true);
      setEmailErrText("");
    } else {
      setEmailValid(false);
      setEmailErrText("Please enter a valid email.");
    }
  }, [email]);

  useEffect(() => {
    if (password.trim() === "") {
      setPasswordValid(true);
      setPassswordErrText("");
      return;
    }
    if (password.length >= 8) {
      setPasswordValid(true);
      setPassswordErrText("");
    } else {
      setPasswordValid(false);
      setPassswordErrText("Password must be at least 8 characters long.");
    }
  }, [password]);

  useEffect(() => {
    setTokenValid(true);
    setTokenErrText("");
  }, [token]);

  useEffect(() => {
    if (username.trim() === "") {
      setUsernameValid(true);
      setUsernameErrText("");
      return;
    }
    if (!RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim).test(username)) {
      setUsernameValid(false);
      setUsernameErrText("Invalid username.");
    } else {
      setUsernameValid(true);
      setUsernameErrText("");
    }
  }, [username]);

  useEffect(() => {
    if (name.trim() === "") {
      setNameValid(true);
      setNameErrText("");
      return;
    }
    if (!RegExp(/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u).test(name)) {
      setNameValid(false);
      setNameErrText("Invalid name.");
    } else {
      setNameValid(true);
      setNameErrText("");
    }
  }, [name]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-3">
      <div className="rounded-lg bg-gray-50 shadow-sm px-4 py-6 w-full h-full sm:h-auto sm:max-w-sm lg:max-w-lg md:max-w-md flex flex-col justify-between sm:justify-center items-center space-y-6">
        <div className="text-2xl font-bold">Register</div>
        <div className="flex flex-col justify-start items-center space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-gray-300 h-80 bg-white py-6 rounded-lg w-full shadow-sm px-6">
          <div className="relative w-full">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="off"
              aria-autocomplete="none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={`peer placeholder-transparent h-10 w-full border-0 border-b-2 p-0 bg-transparent ${
                nameValid
                  ? "border-gray-300 focus:border-lime-500"
                  : "border-red-700"
              } text-gray-900 focus:outline-none  focus:ring-0 transition-all duration-200`}
            />
            <label
              htmlFor="name"
              className={`pointer-events-none absolute left-0 -top-3.5 peer-focus:-top-3.5 ${
                nameValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } peer-focus:text-sm w-96 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-200`}
            >
              Name
            </label>
            <label
              htmlFor="name"
              className={`pointer-events-none peer-focus:-top-3.5 ${
                nameValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } w-min text-xs sm:text-sm transition-all duration-200`}
            >
              {nameErrText !== "" && nameErrText}
            </label>
          </div>
          <div className="relative w-full">
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="off"
              aria-autocomplete="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={`peer placeholder-transparent h-10 w-full border-0 border-b-2 p-0 bg-transparent ${
                usernameValid
                  ? "border-gray-300 focus:border-lime-500"
                  : "border-red-700"
              } text-gray-900 focus:outline-none  focus:ring-0 transition-all duration-200`}
            />
            <label
              htmlFor="username"
              className={`pointer-events-none absolute left-0 -top-3.5 peer-focus:-top-3.5 ${
                usernameValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } peer-focus:text-sm w-96 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-200`}
            >
              Username
            </label>
            <label
              htmlFor="username"
              className={`pointer-events-none peer-focus:-top-3.5 ${
                usernameValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } w-min text-xs sm:text-sm transition-all duration-200`}
            >
              {usernameErrText !== "" && usernameErrText}
            </label>
          </div>
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              aria-autocomplete="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={`peer placeholder-transparent h-10 w-full border-0 border-b-2 p-0 bg-transparent ${
                emailValid
                  ? "border-gray-300 focus:border-lime-500"
                  : "border-red-700"
              } text-gray-900 focus:outline-none  focus:ring-0 transition-all duration-200`}
            />
            <label
              htmlFor="email"
              className={`pointer-events-none absolute left-0 -top-3.5 peer-focus:-top-3.5 ${
                emailValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } peer-focus:text-sm w-96 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-200`}
            >
              Email
            </label>
            <label
              htmlFor="email"
              className={`pointer-events-none peer-focus:-top-3.5 ${
                emailValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } w-min text-xs sm:text-sm transition-all duration-200`}
            >
              {emailErrText !== "" && emailErrText}
            </label>
          </div>
          <div className="relative w-full">
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              aria-autocomplete="none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={`peer placeholder-transparent h-10 w-full border-0 border-b-2 p-0 bg-transparent ${
                passwordValid
                  ? "border-gray-300 focus:border-lime-500"
                  : "border-red-700"
              } text-gray-900 focus:outline-none  focus:ring-0 transition-all duration-200`}
            />
            <label
              htmlFor="password"
              className={`pointer-events-none absolute left-0 -top-3.5 peer-focus:-top-3.5 ${
                passwordValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } peer-focus:text-sm text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-200`}
            >
              Password
            </label>
            <label
              htmlFor="password"
              className={`pointer-events-none peer-focus:-top-3.5 ${
                passwordValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } w-min text-xs sm:text-sm transition-all duration-200`}
            >
              {passswordErrText !== "" && passswordErrText}
            </label>
          </div>
          <div className="relative w-full">
            <input
              id="token"
              type="text"
              name="token"
              placeholder="Token"
              autoComplete="off"
              aria-autocomplete="none"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={`peer placeholder-transparent h-10 w-full border-0 border-b-2 p-0 bg-transparent ${
                tokenValid
                  ? "border-gray-300 focus:border-lime-500"
                  : "border-red-700"
              } text-gray-900 focus:outline-none  focus:ring-0 transition-all duration-200`}
            />
            <label
              htmlFor="token"
              className={`pointer-events-none absolute left-0 -top-3.5 peer-focus:-top-3.5 ${
                tokenValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } peer-focus:text-sm  text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-200`}
            >
              Secret Token
            </label>
            <label
              htmlFor="token"
              className={`pointer-events-none peer-focus:-top-3.5 ${
                tokenValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } w-min text-xs sm:text-sm transition-all duration-200`}
            >
              {tokenErrText !== "" && tokenErrText}
            </label>
          </div>
        </div>
        <button
          onClick={() => {
            handleRegister();
          }}
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? "border-gray-400 text-gray-400"
              : "border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white"
          } h-10 w-10 border-2 transition-all duration-200 rounded-full flex flex-col justify-center items-center`}
        >
          {loading ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="p-1 animate-spin"
            />
          ) : (
            <FontAwesomeIcon icon={faChevronRight} className="p-1" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Register;
