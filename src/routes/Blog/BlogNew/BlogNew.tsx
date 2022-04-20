import {
  faCircleArrowLeft,
  faCircleNotch,
  faCirclePlus,
  faCloudArrowUp,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import markdownToTxt from "markdown-to-txt";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import { ScrollSync, ScrollSyncNode } from "scroll-sync-react";

function BlogNew() {
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const storage = getStorage();

  const [user, setUser] = useState<User>();

  const navigate = useNavigate();
  const auth = getAuth();
  onAuthStateChanged(auth, (data) => {
    if (!data) {
      navigate("/blog");
    } else {
      setUser(user);
    }
  });

  const [errorMsg, setErrorMsg] = useState("");

  const [bannerImage, setBannerImage] = useState<File | null>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[] | null>();

  function handleSubmit() {
    setLoading(true);
    if (!bannerImage) {
      setLoading(false);
      setErrorMsg("Incarca o imagine pentru banner!");
      return;
    }
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
    addDoc(collection(db, "blog"), {
      author: auth.currentUser?.uid,
      dateUploaded: Timestamp.now(),
      title: title,
      content: content,
    }).then(async (doc) => {
      await updateDoc(doc, {
        contentPreview: markdownToTxt(content)
          .split(" ")
          .slice(0, 100)
          .join(" "),
      });
      const imgRef = ref(
        storage,
        `images/blog/${doc.id}/banner.${bannerImage.name.substring(
          bannerImage.name.lastIndexOf(".") + 1
        )}`
      );
      await uploadBytes(imgRef, bannerImage);
      let url = await getDownloadURL(imgRef);
      await updateDoc(doc, {
        bannerUrl: url,
      });
      if (images && images.length > 0) {
        var imageUrls: string[] = [];
        for (let index = 0; index < images.length; index++) {
          let image = images[index];
          const imgRef = ref(
            storage,
            `images/blog/${doc.id}/image${index}.${image.name.substring(
              image.name.lastIndexOf(".") + 1
            )}`
          );
          await (async function () {
            await uploadBytes(imgRef, image);
            let url = await getDownloadURL(imgRef);
            imageUrls.push(url);
          })();
        }
        await updateDoc(doc, {
          imageUrls,
        });
      }
      setLoading(false);
      navigate(`/blog/${doc.id}`, { replace: true });
    });
  }

  useEffect(() => {
    const interval = setInterval(function () {
      setErrorMsg("");
    }, 5000);

    return () => {
      clearTimeout(interval);
    };
  }, [errorMsg]);

  return (
    <div className="h-full w-full p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300 overflow-y-auto overflow-x-hidden flex flex-col space-y-4 justify-start items-center">
      <div className="w-full max-w-5xl flex flex-row justify-between items-center h-fit">
        <span className="font-bold text-2xl">Articol Nou</span>
        {true && (
          <Link
            to="/blog"
            replace
            className="flex flex-row justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 transition-all duration-200 py-2 px-4 rounded-lg w-fit"
          >
            <FontAwesomeIcon icon={faCircleArrowLeft} />
            <span>Inapoi</span>
          </Link>
        )}
      </div>
      <div className="w-full max-w-5xl bg-gray-200 p-4 rounded-lg flex flex-col justify-start items-center">
        <div className="flex flex-col justify-center items-center space-y-4 w-full">
          <div className="relative w-full h-72 group rounded-lg bg-gray-300">
            <img
              src={bannerImage ? URL.createObjectURL(bannerImage) : ""}
              className={`h-full w-full absolute top-0 left-0 object-cover rounded-lg ${
                !bannerImage ? "opacity-0" : ""
              }`}
            />
            <label
              htmlFor="file-upload"
              className={`h-full w-full absolute top-0 left-0 ${
                bannerImage
                  ? "opacity-0 group-hover:opacity-100"
                  : "opacity-100"
              } bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200`}
            >
              <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="relative w-full text-center">
                  {!bannerImage && (
                    <span className="group-hover:opacity-0 absolute top-0 left-0 w-full transition-all duration-200">
                      Imagine Banner
                    </span>
                  )}
                  <span className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-full transition-all duration-200 flex flex-row justify-center items-center space-x-2 text-white">
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Incarca</span>
                  </span>
                </div>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              disabled={loading}
              onChange={(event) => {
                setBannerImage(
                  event.target.files ? event.target.files[0] : null
                );
              }}
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
            <div className="grid grid-rows-1 grid-flow-col justify-start w-full p-2 bg-gray-300 overflow-x-auto overflow-y-hidden items-center space-x-2 rounded-lg">
              <div className="relative w-28 h-28">
                <label
                  htmlFor="file-upload2"
                  className="absolute top-0 left-0 flex flex-col justify-center items-center rounded-lg w-28 h-28 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faCirclePlus} />
                </label>
                <input
                  id="file-upload2"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  disabled={loading}
                  multiple
                  onChange={(event) => {
                    setImages(
                      event.target.files ? Array.from(event.target.files) : null
                    );
                  }}
                />
              </div>
              {images &&
                images.map((image, index) => (
                  <div
                    className="relative w-28 h-28 group rounded-lg"
                    key={`image${index}`}
                  >
                    <img
                      src={URL.createObjectURL(image)}
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
              <span>{loading ? "Se incarca..." : "Creeaza"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogNew;
