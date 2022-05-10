import {
  faArrowDown,
  faArrowRight,
  faCircleNotch,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Blog/Sidebar";
import { BlogContext } from "../../context/Blog";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function Blog() {
  useDocumentTitle("Blog");

  const { pagePosts, loading, nextBatch, moreLoading, morePosts } =
    useContext(BlogContext);

  return (
    <div className="w-full p-4 flex flex-col space-y-4 justify-start items-center">
      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 grid-rows-1 space-x-4 justify-between rounded-lg">
        <div className="flex flex-col col-span-2 space-y-2 bg-gray-50 p-4 rounded-lg shadow-md">
          {loading ? (
            <div className="w-full h-full flex flex-row justify-center items-center space-x-2">
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
              <span>Se incarca...</span>
            </div>
          ) : pagePosts && pagePosts.length > 0 ? (
            <>
              <Link
                to={pagePosts[0].id}
                className="group relative flex flex-col justify-center items-center w-full h-96 bg-black text-white rounded-lg"
              >
                <img
                  src={`${pagePosts.at(0)?.bannerUrl}`}
                  className="absolute top-0 left-0 h-full w-full object-cover z-10 opacity-30 group-hover:opacity-20 transition-all duration-200 rounded-lg"
                  alt=""
                  loading="lazy"
                />
                <div className="opacity-100 group-hover:opacity-0 transition-all duration-200 absolute top-0 left-0 h-full w-full rounded-lg z-20 flex flex-col justify-center items-center space-y-1">
                  <div className="text-2xl font-semibold w-full text-center px-4 truncate">
                    {pagePosts[0].title}
                  </div>
                  <div className="font-light text-xs opacity-70">
                    {pagePosts[0].dateUploaded}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-0 left-0 h-full w-full rounded-lg z-20 flex flex-row justify-center items-center space-x-2">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Vezi Articolul</span>
                </div>
              </Link>
              <div className="flex flex-col justify-center items-center space-y-2">
                {_.drop(pagePosts).map((post) => (
                  <div
                    className="w-full bg-white rounded-lg flex flex-row justify-start items-center shadow-sm shadow-gray-300"
                    key={post.id}
                  >
                    <Link to={post.id} className="relative h-full w-64 group">
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
                  disabled={moreLoading || !morePosts}
                  className={`flex flex-row justify-center items-center space-x-2 px-3 py-1 border-2 ${
                    moreLoading || !morePosts
                      ? "border-gray-400 text-gray-400"
                      : "border-black hover:bg-black hover:text-white"
                  } rounded-lg transition-all duration-200`}
                >
                  <FontAwesomeIcon
                    icon={
                      moreLoading
                        ? faCircleNotch
                        : morePosts
                        ? faArrowDown
                        : faCircleXmark
                    }
                    className={`h-3.5 w-3.5 ${
                      moreLoading ? "animate-spin" : ""
                    }`}
                  />
                  <span className="text-sm">
                    {moreLoading
                      ? "Se incarca"
                      : morePosts
                      ? "Mai multe postari"
                      : "Nu mai exista postari"}
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
