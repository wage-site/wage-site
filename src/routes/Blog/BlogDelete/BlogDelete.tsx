import {
  faAngleLeft,
  faCircleNotch,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function BlogDelete() {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [postExists, setPostExists] = useState(true);

  let params = useParams();
  let id = params.id;

  const navigate = useNavigate();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate(`/blog/${id}`, { replace: true });
    }
  });

  const db = getFirestore();

  useEffect(() => {
    (async function () {
      setGlobalLoading(true);
      const docRef = doc(db, "blog", id ? id : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGlobalLoading(false);
        if (docSnap.data().author != auth.currentUser?.uid)
          navigate(`/blog/${id}`, { replace: true });
      } else {
        setGlobalLoading(false);
        setPostExists(false);
      }
    })();
  }, [id]);

  async function handleDelete() {
    setLoading(true);
    const docRef = doc(db, "blog", id ? id : "");
    await deleteDoc(docRef);
    setLoading(false);
    navigate("/blog", { replace: true });
  }

  return (
    <>
      {globalLoading ? (
        <div className="flex flex-row justify-center items-center space-x-2 w-full h-full">
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          <span>Se incarca...</span>
        </div>
      ) : postExists ? (
        <div className="h-full w-full flex flex-col justify-center items-center space-y-4">
          <div className="font-semibold text-lg">
            Esti sigur ca vrei sa stergi aceasta postare?
          </div>
          <div className="flex flex-row justify-center items-center space-x-2">
            <button
              className={`${
                loading
                  ? "border-gray-400 text-gray-400"
                  : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-gray-50"
              } border-[0.15rem] transition-all duration-300 px-3 py-1 rounded-lg font-medium leading-snug text-center`}
              onClick={() => {
                navigate(`/blog/${id}`, { replace: true });
              }}
              disabled={loading}
            >
              Inapoi
            </button>
            <button
              onClick={() => {
                handleDelete();
              }}
              disabled={loading}
              className={`${
                loading
                  ? "border-gray-400 text-gray-400"
                  : "border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-gray-50"
              } border-[0.15rem] transition-all duration-300 px-3 py-1 rounded-lg font-medium leading-snug text-center`}
            >
              {loading ? "Se incarca..." : "Sterge"}
            </button>
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

export default BlogDelete;
