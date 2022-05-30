/* eslint-disable react-hooks/exhaustive-deps */
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faAngleLeft,
  faArrowRight,
  faCircleNotch,
  faCircleUser,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import { BlogContext } from "../../context/Blog";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";
import { BlogPagePost } from "../Blog/types";

function User() {
  useDocumentTitle("Profil");

  const { user, loading: userLoading, userDb } = useContext(AuthContext);
  const { userPosts } = useContext(BlogContext);

  const [loading, setLoading] = useState(true);

  const [userExists, setUserExists] = useState(false);
  const [, setIsOwnProfile] = useState(false);

  const [userData, setUserData] = useState<UserData>();
  const [blogPosts, setBlogPosts] = useState<BlogPagePost[]>([]);

  let params = useParams();
  let userId = params.id;

  const db = getFirestore();

  useEffect(() => {
    (async function () {
      setLoading(true);
      if (!userLoading && user) {
        if (userId === user.uid || userId === undefined) {
          setUserExists(true);
          setIsOwnProfile(true);
          const userPsts = await userPosts(user.uid);
          setBlogPosts(userPsts.pagePosts);
          setUserData(userDb!);
          setLoading(false);
        } else {
          setIsOwnProfile(false);
          const userDoc = await getDoc(doc(db, "users", userId || ""));
          if (!userDoc.exists()) {
            setLoading(false);
            setUserExists(false);
            return;
          }
          setUserExists(true);
          setUserData(userDoc.data() as UserData);
          setBlogPosts((await userPosts(userId!)).pagePosts);
          setLoading(false);
        }
      }
    })();
  }, [userId, user, userLoading]);

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex flex-row justify-center items-center space-x-2 font-custom">
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          <span>Se incarca...</span>
        </div>
      ) : userExists && userData ? (
        <div className="h-[calc(100%-4rem)] w-full flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 justify-start items-center p-2">
          <div className="h-auto lg:h-full w-full lg:w-1/3 flex flex-row lg:flex-col justify-between lg:justify-center items-center space-x-4 lg:space-x-0 lg:space-y-4 bg-white rounded-lg shadow-lg p-4">
            <div className="col-span-1 flex flex-row lg:flex-col justify-start lg:justify-center items-center space-x-4 lg:space-x-0 lg:space-y-4">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="" />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="rounded-full h-16 w-16 lg:h-20 lg:w-20 text-gray-400 transition-all duration-200"
                />
              )}
              <div className="flex flex-col justify-center items-start lg:items-center">
                <div className="flex flex-row justify-start lg:justify-center items-center space-x-1">
                  <span>{userData?.name}</span>
                  <span className="font-black">·</span>
                  <span className="text-sm opacity-50 font-light">
                    @{userData?.username}
                  </span>
                </div>
                {userData.team && (
                  <div className="text-sm">
                    {userData?.team === "exploratori"
                      ? "Explorator"
                      : userData?.team === "cercetatori"
                      ? "Cercetator"
                      : "Reporter"}
                  </div>
                )}
                <div className="text-sm opacity-50 font-light"></div>
                {userData?.displayEmail && (
                  <div className="text-sm opacity-50 font-light">
                    {userData?.email}
                  </div>
                )}
              </div>
            </div>
            {userData.socials && (
              <div className="flex flex-row justify-end items-center space-x-4 p-2">
                {userData.socials.instagram && (
                  <a
                    href={`https://instagram.com/${userData.socials.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-all duration-200"
                    />
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200 overflow-auto h-full w-full lg:w-2/3 flex flex-col justify-start items-start space-y-4 bg-white rounded-lg shadow-lg p-4">
            <div className="text-lg font-semibold w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-3 after:flex-1 space-x-2 after:bg-black after:opacity-50">
              Postari
            </div>
            {blogPosts.map((post) => (
              <div
                className="w-full bg-white rounded-lg flex flex-row justify-start items-center shadow-sm shadow-gray-300"
                key={post.id}
              >
                <Link
                  to={`/blog/${post.id}`}
                  replace
                  className="relative h-full w-64 group"
                >
                  <img
                    src={post.bannerUrl}
                    className="absolute top-0 left-0 rounded-l-lg h-full w-full object-cover"
                    alt=""
                    loading="lazy"
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-0 left-0 rounded-l-lg h-full w-full text-white bg-black bg-opacity-50 flex flex-row justify-center items-center space-x-2">
                    <FontAwesomeIcon icon={faArrowRight} />
                    <span>Vezi Articolul</span>
                  </div>
                </Link>
                <div className="p-4 flex flex-col justify-start items-start w-full space-y-3">
                  <div className="flex flex-col justify-start items-start space-y-1">
                    <Link
                      to={`/blog/${post.id}`}
                      replace
                      className="font-semibold text-xl flex flex-row justify-start items-center space-x-2 group"
                    >
                      <span>{post.title}</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      />
                    </Link>
                    <div className="font-light text-xs opacity-70">
                      {post.dateUploaded}
                    </div>
                  </div>
                  <div className="w-full bg-black opacity-10 h-px" />
                  <div className="hidden lg:block text-xs font-light">
                    {post.contentPreview.split(" ").slice(0, 75).join(" ")}
                    ...
                  </div>
                  <div className="hidden md:block lg:hidden text-xs font-light">
                    {post.contentPreview.split(" ").slice(0, 50).join(" ")}
                    ...
                  </div>
                  <div className="block md:hidden text-xs font-light">
                    {post.contentPreview.split(" ").slice(0, 25).join(" ")}
                    ...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-full">
          <div className="flex flex-row justify-center items-center space-x-2">
            <FontAwesomeIcon icon={faCircleXmark} className="h-3 w-3" />
            <span>Acest utilizator nu exista!</span>
          </div>
          <div>
            <Link
              to="/blog"
              replace
              className="flex flex-row justify-center items-center space-x-2 text-sm px-3 py-1 border-2 rounded-lg border-lime-500 text-lime-500 hover:text-white hover:bg-lime-500 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
              <span className="mb-px">Inapoi</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
