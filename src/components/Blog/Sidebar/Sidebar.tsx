import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogContext } from "../../../context/Blog";

function Sidebar() {
  const { pagePosts: posts, loading } = useContext(BlogContext);

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
          {posts.slice(0, 3).map((post) => (
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
      <div className="w-full flex">
        <button className="flex w-1/3 h-full items-center bg-pink-600 justify-center shadow-lg border-b-4 border-pink-800 border-r-2 text-white md:mx-5 lg:mx-9 rounded-md"><FontAwesomeIcon icon={faInstagram} className="w-5 h-5" /> Instagram</button>
        <button className="flex w-1/3 h-full items-center bg-blue-500 justify-center shadow-lg border-b-4 border-blue-700 border-r-2 text-white rounded-md "><FontAwesomeIcon icon={faFacebookSquare} className="w-5 h-5" /> Facebook</button>
      </div>
    </div>
  );
}

export default Sidebar;
