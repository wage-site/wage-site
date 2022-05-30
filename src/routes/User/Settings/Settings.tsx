/* eslint-disable react-hooks/exhaustive-deps */
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import {
  faFacebookSquare,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faAt,
  faCheck,
  faCircleUser,
  faEnvelope,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Auth";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";

function Settings() {
  useDocumentTitle("Setari");
  const navigate = useNavigate();

  const db = getFirestore();
  const auth = getAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState<Team>();

  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");

  const [photoFileInput, setPhotoFileInput] = useState<File>();
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const { user, loading: userLoading, userDb } = useContext(AuthContext);
  useEffect(() => {
    if (!user && !userLoading) navigate("/user/login", { replace: true });
    else {
      setName(userDb?.name || "");
      setUsername(userDb?.username || "");
      setEmail(userDb?.email || "");
      setPhotoURL(userDb?.photoURL || null);
      setTeam(userDb?.team || undefined);
      userDb?.socials && setInstagram(userDb.socials.instagram || "");
      userDb?.socials && setFacebook(userDb.socials.facebook || "");
      userDb?.socials && setTwitter(userDb.socials.twitter || "");
    }
  }, [user, navigate, userLoading]);

  useEffect(() => {
    if (photoFileInput) setPhotoURL(URL.createObjectURL(photoFileInput));
  }, [photoFileInput]);

  function submit() {
    if (!auth.currentUser || !user) return;
    const userDoc = doc(db, "users", user?.uid || "");
    updateEmail(auth.currentUser, email);
    updateDoc(userDoc, {
      email: email,
      name: name,
      username: username,
      socials: {
        instagram: instagram.trim() === "" ? null : instagram,
        facebook: facebook.trim() === "" ? null : facebook,
        twitter: twitter.trim() === "" ? null : twitter,
      },
      team: team,
    });
  }

  return (
    <div className="w-full h-[calc(100%-4rem)] p-2 flex flex-col justify-start items-center">
      <div className="h-full w-full max-w-lg overflow-auto rounded-lg bg-white shadow-lg p-4 flex flex-col justify-start items-start relative space-y-8">
        <div className="text-2xl font-semibold w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-3 after:flex-1 space-x-2 after:bg-black after:opacity-50">
          Setari
        </div>
        <div className="w-full flex flex-row justify-start items-start">
          <div className="w-full flex flex-col justify-center items-center space-y-6">
            <label className="relative rounded-full group h-24 aspect-square shadow-md shadow-gray-400">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt=""
                  className="rounded-full h-full w-full text-gray-400 object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="rounded-full h-full w-full text-gray-400"
                />
              )}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-full w-full absolute top-0 left-0 bg-black bg-opacity-70 rounded-full flex flex-row justify-center items-center">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="h-6 aspect-square text-white"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="invisible h-full w-full absolute top-0 left-0 rounded-full"
                onChange={(e) => {
                  setPhotoFileInput(e.target.files?.[0]);
                }}
              />
            </label>
            <div className="flex flex-col justify-center items-center space-y-2 w-full max-w-md">
              <div className="text-sm w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-2 after:flex-1 space-x-2 after:bg-black after:opacity-50">
                Date personale
              </div>
              <div className="w-full flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  <FontAwesomeIcon icon={faUser} className="aspect-square" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  placeholder=""
                />
              </div>
              <div className="w-full flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  <FontAwesomeIcon icon={faAt} className="aspect-square" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  placeholder=""
                />
              </div>
              <div className="w-full flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="aspect-square"
                  />
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2 w-full max-w-md">
              <div className="text-sm w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-2 after:flex-1 space-x-2 after:bg-black after:opacity-50">
                Echipa
              </div>
              <div className="w-full flex">
                <select
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value as Team);
                  }}
                  className="appearance-none rounded-lg bg-gray-50 border text-gray-900 block flex-1 w-full text-sm border-gray-300 p-2"
                >
                  <option value="exploratori">Exploratori</option>
                  <option value="cercetatori">Cercetatori</option>
                  <option value="reporteri">Reporteri</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2 w-full max-w-md">
              <div className="text-sm w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-2 after:flex-1 space-x-2 after:bg-black after:opacity-50">
                Social Media
              </div>
              <div className="w-full flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="aspect-square"
                  />
                </span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => {
                    setInstagram(e.target.value);
                  }}
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  placeholder=""
                />
              </div>
              <div className="w-full flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className="aspect-square"
                  />
                </span>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => {
                    setFacebook(e.target.value);
                  }}
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  placeholder=""
                />
              </div>
              <div className="w-full flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  <FontAwesomeIcon icon={faTwitter} className="aspect-square" />
                </span>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => {
                    setTwitter(e.target.value);
                  }}
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex flex-row justify-center items-center w-full max-w-md">
              <button className="flex flex-col justify-center items-center rounded-full border-2 p-3 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
