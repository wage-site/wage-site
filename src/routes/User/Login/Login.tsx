import {
  faChevronRight,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validate as mailValidate } from "email-validator";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";

function Login() {
  useDocumentTitle("Login");

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);

  const [emailErrText, setEmailErrText] = useState("");
  const [passswordErrText, setPassswordErrText] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && !loading) {
        navigate("/user");
      }
    });
  }, [auth.currentUser, loading, navigate, auth]);

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
    setPasswordValid(true);
    setPassswordErrText("");
  }, [password]);

  function handleLogin() {
    setLoading(true);

    if (mailValidate(email) && password.length >= 8) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          switch (error.code) {
            case "auth/wrong-password": {
              setPasswordValid(false);
              setPassswordErrText("Incorrect Password.");
              break;
            }
            case "auth/user-not-found": {
              setEmailValid(false);
              setEmailErrText("User does not exist.");
              break;
            }
          }
        });
    } else {
      setLoading(false);
      if (!mailValidate(email)) {
        setEmailValid(false);
        setEmailErrText("Please enter a valid email.");
      }
      if (password.length < 8) {
        setPasswordValid(false);
        setPassswordErrText("Please enter a valid password.");
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-3">
      <div className="rounded-lg bg-gray-50 shadow-sm px-4 py-6 w-full h-full sm:h-auto sm:max-w-sm lg:max-w-lg md:max-w-md flex flex-col justify-between sm:justify-center items-center space-y-6">
        <div className="text-2xl font-bold">Login</div>
        <div className="flex flex-col justify-center items-center space-y-4 bg-white py-6 rounded-lg w-full shadow-sm px-6">
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              aria-autocomplete="none"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
              htmlFor="email"
              className={`pointer-events-none peer-focus:-top-3.5 ${
                passwordValid
                  ? "peer-focus:text-gray-600 text-gray-600 peer-placeholder-shown:text-gray-400"
                  : "text-red-700"
              } w-min text-xs sm:text-sm transition-all duration-200`}
            >
              {passswordErrText !== "" && passswordErrText}
            </label>
          </div>
        </div>
        <button
          onClick={() => {
            handleLogin();
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

export default Login;
