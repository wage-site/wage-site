import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPagePost } from "../../../routes/Blog/types";

function Sidebar() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPagePost[]>();

  const db = getFirestore();

  useEffect(() => {
    (async function () {
      setLoading(true);
      const q = query(
        collection(db, "blog"),
        orderBy("dateUploaded", "desc"),
        limit(3)
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
        psts.push({
          id: post.id,
          author,
          title,
          content,
          contentPreview,
          dateUploaded: date,
          bannerUrl,
        });
      });
      setLoading(false);
      setPosts(psts);
    })();
  }, []);

  return (
    <div className="flex-col h-fit hidden md:flex col-span-1 space-y-2 bg-white p-3 rounded-lg shadow-md">
      <div className="w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-2 after:flex-1 space-x-2 after:bg-black">
        <span className="flex-shrink">Articole Recente</span>
      </div>
      {loading ? (
        <div className="w-full h-full flex flex-row justify-start items-center space-x-2">
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          <span>Se incarca...</span>
        </div>
      ) : posts && posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <Link
              to={`/blog/${post.id}`}
              replace
              key={post.id}
              className="relative flex flex-row justify-start rounded-lg bg-gray-50 shadow-sm shadow-gray-300 w-full h-16 group"
            >
              <img src={post.bannerUrl} className="w-20 rounded-l-lg" />
              <div className="w-1/2 h-full p-2 flex flex-row justify-start items-center">
                <div className="h-full w-full flex flex-col justify-evenly items-start">
                  <div className="truncate w-full text-sm">{post.title}</div>
                  <div className="font-light text-xs">{post.dateUploaded}</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-full w-12 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </Link>
          ))}
        </>
      ) : (
        <div>Nu exista postari!</div>
      )}
      <div className="w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-2 after:flex-1 space-x-2 after:bg-black">
        <span className="flex-shrink">Social Media</span>
      </div>
      <div className="w-full flex flex-row justify-evenly items-center p-1">
        <a
          href="#"
          className="rounded-full w-14 h-14 p-1 bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex flex-col justify-center items-center"
        >
          <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="rounded-full w-14 h-14 p-1 bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex flex-col justify-center items-center"
        >
          <FontAwesomeIcon icon={faFacebookSquare} className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
