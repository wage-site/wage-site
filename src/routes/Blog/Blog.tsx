import {
  faArrowDown,
  faArrowRight,
  faCircleNotch,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import _ from "lodash";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Blog/Sidebar";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";
import { BlogPagePost } from "./types";

function Blog() {
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  useDocumentTitle("Blog");

  const db = getFirestore();
  const storage = getStorage();

  const [posts, setPosts] = useState<BlogPagePost[]>([]);
  const [lastKey, setLastKey] = useState("");

  async function nextBatch() {
    setMoreLoading(true);
    const q = query(
      collection(db, "blog"),
      orderBy("dateUploaded", "desc"),
      startAfter(lastKey),
      limit(5)
    );
    const querySnap = await getDocs(q);
    let psts: BlogPagePost[] = [];
    querySnap.forEach(async function (post) {
      let { author, title, content, dateUploaded, bannerUrl, contentPreview } =
        post.data();
      let date = DateTime.fromJSDate(dateUploaded.toDate()).toLocaleString(
        DateTime.DATE_FULL
      );
      setLastKey(dateUploaded);
      psts.push({
        id: post.id,
        author,
        title,
        content,
        contentPreview,
        dateUploaded: date,
        bannerUrl,
      });
      forceUpdate();
    });

    setPosts(posts.concat(psts));
    forceUpdate();
    setMoreLoading(false);
  }

  useEffect(() => {
    (async function () {
      setLoading(true);
      const q = query(
        collection(db, "blog"),
        orderBy("dateUploaded", "desc"),
        limit(5)
      );
      const querySnap = await getDocs(q);
      let psts: BlogPagePost[] = [];
      querySnap.forEach(async function (post) {
        let {
          author,
          title,
          content,
          dateUploaded,
          bannerUrl,
          contentPreview,
        } = post.data();
        let date = DateTime.fromJSDate(dateUploaded.toDate()).toLocaleString(
          DateTime.DATE_FULL
        );
        setLastKey(dateUploaded);
        psts.push({
          id: post.id,
          author,
          title,
          content,
          contentPreview,
          dateUploaded: date,
          bannerUrl,
        });
        forceUpdate();
      });

      setPosts(psts);
      forceUpdate();
      setLoading(false);
    })();
  }, []);

  return (
    <div className="h-full w-full p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300 overflow-y-auto overflow-x-hidden flex flex-col space-y-4 justify-start items-center">
      <div className="w-full max-w-6xl flex flex-row justify-between items-center">
        <span className="font-bold text-2xl">Blog</span>
        {user && (
          <Link
            to="new"
            className="flex flex-row justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 transition-all duration-200 py-2 px-4 rounded-lg w-fit"
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            <span>Creeaza un articol nou</span>
          </Link>
        )}
      </div>
      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 grid-rows-1 space-x-4 justify-between rounded-lg">
        <div className="flex flex-col col-span-2 space-y-2 bg-gray-50 p-4 rounded-lg shadow-md">
          {loading ? (
            <div className="w-full h-full flex flex-row justify-center items-center space-x-2">
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
              <span>Se incarca...</span>
            </div>
          ) : posts.length > 0 ? (
            <>
              <Link
                to={posts[0].id}
                className="group relative flex flex-col justify-center items-center w-full h-44 bg-black text-white rounded-lg"
              >
                <img
                  src={`${posts.at(0)?.bannerUrl}`}
                  className="absolute top-0 left-0 h-full w-full object-cover z-10 opacity-30 group-hover:opacity-20 transition-all duration-200 rounded-lg"
                  alt="Image"
                />
                <div className="opacity-100 group-hover:opacity-0 transition-all duration-200 absolute top-0 left-0 h-full w-full rounded-lg z-20 flex flex-col justify-center items-center space-y-1">
                  <div className="text-2xl font-semibold w-full text-center px-4 truncate">
                    {posts[0].title}
                  </div>
                  <div className="font-light text-xs opacity-70">
                    {posts[0].dateUploaded}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-0 left-0 h-full w-full rounded-lg z-20 flex flex-row justify-center items-center space-x-2">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Vezi Articolul</span>
                </div>
              </Link>
              <div className="flex flex-col justify-center items-center space-y-2">
                {_.drop(posts).map((post) => (
                  <div
                    className="w-full bg-white rounded-lg flex flex-row justify-start items-center shadow-sm shadow-gray-300"
                    key={post.id}
                  >
                    <Link to={post.id} className="relative h-full w-64 group">
                      <img
                        src={post.bannerUrl}
                        className="absolute top-0 left-0 rounded-l-lg h-full w-full object-cover"
                      />
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-0 left-0 rounded-l-lg h-full w-full text-white bg-black bg-opacity-50 flex flex-row justify-center items-center space-x-2">
                        <FontAwesomeIcon icon={faArrowRight} />
                        <span>Vezi Articolul</span>
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col justify-start items-start w-full space-y-3">
                      <div className="flex flex-col justify-start items-start space-y-1">
                        <Link
                          to={post.id}
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
                <button
                  onClick={() => nextBatch()}
                  disabled={moreLoading}
                  className={`flex flex-row justify-center items-center space-x-2 px-3 py-1 border-2 ${
                    moreLoading
                      ? "border-gray-400 text-gray-400"
                      : "border-black hover:bg-black hover:text-white"
                  } rounded-lg transition-all duration-200`}
                >
                  <FontAwesomeIcon
                    icon={moreLoading ? faCircleNotch : faArrowDown}
                    className={`h-3.5 w-3.5 ${
                      moreLoading ? "animate-spin" : ""
                    }`}
                  />
                  <span className="text-sm">
                    {moreLoading ? "Se incarca" : "Mai multe postari"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full justify-center items-center">
              Nu exista postari!
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default Blog;
