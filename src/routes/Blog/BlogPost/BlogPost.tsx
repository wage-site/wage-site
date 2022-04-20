import {
  faAngleLeft,
  faCircleNotch,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import ImageViewer from "react-simple-image-viewer";
import Sidebar from "../../../components/Blog/Sidebar";
import { BlogPost } from "../types";

function BlogPostPage() {
  const [loading, setLoading] = useState(true);

  let params = useParams();
  let postId = params.id;

  const auth = getAuth();
  const db = getFirestore();

  const [canEdit, setCanEdit] = useState(false);
  const [postExists, setPostExists] = useState(true);
  const [postData, setPostData] = useState<BlogPost>();
  const [authorData, setAuthorData] = useState<UserData>();

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  useEffect(() => {
    (async function () {
      setLoading(true);
      const docRef = doc(db, "blog", postId ? postId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPostData(docSnap.data() as BlogPost);
        const userRef = doc(db, "users", docSnap.data().author);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAuthorData(userSnap.data() as UserData);
        } else {
          setAuthorData({ name: "Utilizator Sters", username: "", email: "" });
        }
        setLoading(false);
      } else {
        setPostExists(false);
        setLoading(false);
      }
      onAuthStateChanged(auth, function (user) {
        if (user && user.uid == postData?.author) {
          setCanEdit(true);
        } else {
          setCanEdit(false);
        }
      });
    })();
  }, [postId]);

  return (
    <>
      {loading ? (
        <div className="flex flex-row justify-center items-center space-x-2 w-full h-full">
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          <span>Se incarca...</span>
        </div>
      ) : postExists && postData ? (
        <div className="h-full w-full p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300 overflow-y-auto overflow-x-hidden flex flex-col space-y-4 justify-start items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 grid-rows-1 space-x-4 max-w-5xl">
            <div className="col-span-2 flex flex-col divide-y-[1px] divide-gray-200 w-full shadow-md bg-gray-50 rounded-lg">
              <div className="w-full">
                <img
                  src={postData?.bannerUrl}
                  className="w-full h-52 rounded-t-lg object-cover"
                />
                <div className="h-full flex flex-col justify-start items-start space-y-2 p-4">
                  <div className="font-semibold text-xl inline-flex w-full space-x-2">
                    <span className="text-base sm:text-xl w-full inline-block truncate">
                      {postData?.title}
                    </span>
                  </div>
                  <div className="w-full inline-flex flex-row justify-start items-center space-x-1">
                    <span className="font-light text-xs sm:text-sm">
                      {DateTime.fromJSDate(
                        postData?.dateUploaded.toDate()
                      ).toLocaleString(DateTime.DATE_FULL)}
                    </span>
                    <span className="text-xs">&#x2022;</span>
                    <div className="text-xs sm:text-sm">
                      <span className="font-light">de </span>
                      <span className="font-normal">{authorData?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center w-full p-6">
                <ReactMarkdown
                  children={postData.content}
                  className="prose w-full max-w-3xl"
                />
              </div>
              {postData.imageUrls && (
                <div className="grid grid-rows-1 grid-flow-col justify-start space-x-2 p-2 w-full overflow-x-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300">
                  {postData.imageUrls.map((image, index) => (
                    <div
                      className="relative w-28 h-28 group rounded-lg cursor-pointer"
                      key={`image${index}`}
                      onClick={() => openImageViewer(index)}
                    >
                      <img
                        src={image}
                        className="w-full h-full absolute top-0 left-0 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Sidebar />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-full">
          <div className="flex flex-row justify-center items-center space-x-2">
            <FontAwesomeIcon icon={faCircleXmark} className="h-3 w-3" />
            <span>Aceasta postare nu exista!</span>
          </div>
          <div>
            <Link
              to="/blog"
              replace
              className="flex flex-row justify-center items-center space-x-2 text-sm px-3 py-1 border-2 rounded-lg border-lime-500 text-lime-500 hover:text-white hover:bg-lime-500 tranition-all duration-200"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
              <span className="mb-px">Inapoi</span>
            </Link>
          </div>
        </div>
      )}
      {isViewerOpen && postData?.imageUrls && (
        <div className="flex flex-col justify-center items-center w-full h-full z-[100]">
          <ImageViewer
            src={postData?.imageUrls}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        </div>
      )}
    </>
  );
}

export default BlogPostPage;
