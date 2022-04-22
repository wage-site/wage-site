import {
  faAngleLeft,
  faCircleArrowLeft,
  faCircleNotch,
  faCircleXmark,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import markdownToTxt from "markdown-to-text";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ScrollSync, ScrollSyncNode } from "scroll-sync-react";
import { AuthContext } from "../../../context/Auth";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";
import { BlogPost } from "../types";

function BlogEdit() {
  useDocumentTitle("Editare Articol");

  const [globalLoading, setGlobalLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  let params = useParams();
  let id = params.id;

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate(`/blog/${id}`, { replace: true });
    }
  }, [user]);

  const db = getFirestore();

  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [postData, setPostData] = useState<BlogPost>();
  const [postExists, setPostExists] = useState(true);

  useEffect(() => {
    (async function () {
      setGlobalLoading(true);
      const docRef = doc(db, "blog", id || "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPostData(docSnap.data() as BlogPost);
        setGlobalLoading(false);
        if (docSnap.data().author != user?.uid)
          navigate(`/blog/${id}`, { replace: true });
      } else {
        setGlobalLoading(false);
        setPostExists(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!postData) return;
    setTitle(postData.title);
    setContent(postData.content);
  }, [postData]);

  useEffect(() => {
    const interval = setInterval(function () {
      setErrorMsg("");
    }, 5000);

    return () => {
      clearTimeout(interval);
    };
  }, [errorMsg]);

  async function handleSubmit() {
    setLoading(true);
    if (!title) {
      setLoading(false);
      setErrorMsg("Introdu un titlu!");
      return;
    }
    if (!content) {
      setLoading(false);
      setErrorMsg("Introdu continut!");
      return;
    }
    const docRef = doc(db, "blog", id || "");
    await updateDoc(docRef, {
      title,
      content,
      contentPreview: markdownToTxt(content).split(" ").slice(0, 100).join(" "),
    });
    setLoading(false);
    navigate(`/blog/${id}`, { replace: true });
  }

  return (
    <>
      {globalLoading ? (
        <div className="flex flex-row justify-center items-center space-x-2 w-full h-full">
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          <span>Se incarca...</span>
        </div>
      ) : postData && postExists ? (
        <div className="h-full w-full p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300 overflow-y-auto overflow-x-hidden flex flex-col space-y-4 justify-start items-center">
          <div className="w-full max-w-5xl flex flex-row justify-between items-center h-fit">
            <span className="font-bold text-2xl">Editare Articol</span>
            <Link
              to={`/blog/${id}`}
              replace
              className="flex flex-row justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 transition-all duration-200 py-2 px-4 rounded-lg w-fit"
            >
              <FontAwesomeIcon icon={faCircleArrowLeft} />
              <span>Inapoi</span>
            </Link>
          </div>
          <div className="w-full max-w-5xl bg-gray-200 p-4 rounded-lg flex flex-col justify-start items-center">
            <div className="flex flex-col justify-center items-center space-y-4 w-full">
              <div className="relative w-full h-72 group rounded-lg bg-gray-300">
                <img
                  src={postData.bannerUrl}
                  className={`h-full w-full absolute top-0 left-0 object-cover rounded-lg`}
                />
              </div>
              <input
                className="px-2 py-1 rounded-lg w-full"
                type="text"
                placeholder="Titlu"
                disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="w-full flex flex-col justify-center items-start space-y-2">
                <ScrollSync>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 w-full h-96 space-x-0 space-y-2 md:space-x-2 md:space-y-0`}
                  >
                    <div className="flex flex-col justify-center items-start space-y-2">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div>
                          Continut (
                          <a
                            href="https://www.markdownguide.org/basic-syntax/"
                            target="_blank"
                            className="underline hover:text-gray-500 transition-all duration-200"
                          >
                            Markdown
                          </a>
                          )
                        </div>
                      </div>
                      <ScrollSyncNode>
                        <textarea
                          className={`px-2 py-1 rounded-lg w-full h-full flex flex-row resize-none font-mono`}
                          placeholder=""
                          spellCheck="false"
                          disabled={loading}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </ScrollSyncNode>
                    </div>
                    <div className="w-full h-full flex flex-col justify center items-start space-y-2">
                      <div>Preview</div>
                      <ScrollSyncNode>
                        <div
                          className={`prose max-w-none overflow-auto bg-white m-0 rounded-lg p-4 w-full h-full`}
                        >
                          <ReactMarkdown children={content} />
                        </div>
                      </ScrollSyncNode>
                    </div>
                  </div>
                </ScrollSync>
              </div>
              <div className="flex flex-col justify-center items-start w-full space-y-2">
                <div>Imagini</div>
                <div className="flex flex-row w-full p-2 bg-gray-300 overflow-x-auto overflow-y-hidden justify-start items-center space-x-2 rounded-lg">
                  {postData.imageUrls &&
                    postData.imageUrls.map((image, index) => (
                      <div
                        className="relative w-28 h-28 group rounded-lg"
                        key={`image${index}`}
                      >
                        <img
                          src={image}
                          className="w-full h-full absolute top-0 left-0 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-row w-full justify-between items-center">
                <div className="text-red-500">{errorMsg ? errorMsg : ""}</div>
                <button
                  className={`flex flex-row justify-center items-center space-x-2 px-3 py-1 border-2 rounded-lg ${
                    loading
                      ? "border-gray-400 text-gray-400"
                      : "border-lime-500 text-lime-500 hover:text-white hover:bg-lime-500"
                  } transition-all duration-200`}
                  disabled={loading}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  <FontAwesomeIcon
                    icon={loading ? faCircleNotch : faCloudArrowUp}
                    className={`${loading ? "animate-spin" : ""}`}
                  />
                  <span>{loading ? "Se incarca..." : "Actualizeaza"}</span>
                </button>
              </div>
            </div>
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
    </>
  );
}

export default BlogEdit;
