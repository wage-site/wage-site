import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faCircleNotch,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/Auth";
import { BlogContext } from "../../../context/Blog";

function Sidebar() {
  const { pagePosts: posts, loading } = useContext(BlogContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full hidden md:flex flex-col justify-start items-center lg:p-4 p-2 space-y-2">
      {user && (
        <Link
          to="/blog/new"
          replace
          className="flex flex-row space-x-2 items-center justify-center bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faCirclePlus} className="mt-px w-3.5 h-3.5" />
          <span>Creeaza un articol nou</span>
        </Link>
      )}
      <div className="w-full flex-col h-fit flex col-span-1 space-y-2 bg-white p-3 rounded-lg shadow-md">
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
                <img
                  src={post.bannerUrl}
                  className="w-20 rounded-l-lg"
                  alt=""
                  loading="lazy"
                />
                <div className="w-1/2 h-full p-2 flex flex-row justify-start items-center">
                  <div className="h-full w-full flex flex-col justify-evenly items-start">
                    <div className="truncate w-full text-sm">{post.title}</div>
                    <div className="font-light text-xs">
                      {post.dateUploaded}
                    </div>
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
        <div className="w-full flex flex-row justify-evenly space-x-2">
          <a
            href="##"
            className="lg:border-b-4 border-pink-700 hover:bg-pink-600 transition-all duration-200 inline-flex flex-row justify-evenly items-center px-3 py-0.5 space-x-1.5 bg-pink-500 text-white rounded-full lg:rounded-lg"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              className="mt-px w-5 lg:w-3.5 aspect-square"
            />
            <span className="hidden lg:block">Instagram</span>
          </a>
          <a
            href="##"
            className="aspect-square lg:aspect-auto lg:border-b-4 border-blue-700 hover:bg-blue-600 transition-all duration-200 inline-flex flex-row justify-evenly items-center px-3 py-0.5 space-x-1.5 bg-blue-500 text-white rounded-full lg:rounded-lg"
          >
            <FontAwesomeIcon
              icon={faFacebookSquare}
              className="mt-px w-5 lg:w-3.5 aspect-square"
            />
            <span className="hidden lg:block">Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
