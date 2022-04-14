import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";

function BlogEdit() {
  const navigate = useNavigate();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate(-1);
    }
  });

  let params = useParams();
  let id = params.id;

  return <div>Edit {id}</div>;
}

export default BlogEdit;
