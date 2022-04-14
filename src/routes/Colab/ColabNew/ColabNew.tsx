import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function ColabNew() {
  const navigate = useNavigate();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate(-1);
    }
  });

  return <div>New</div>;
}

export default ColabNew;
