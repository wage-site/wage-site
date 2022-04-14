import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";

function BlogDelete() {
  const navigate = useNavigate();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate(-1);
    }
  });

  let params = useParams();
  let id = params.id;

  return <div>Delete {id}</div>;
}

export default BlogDelete;
