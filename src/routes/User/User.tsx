import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function User() {
  useDocumentTitle("Profil");
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/user/login");
      }
    });
  }, [auth.currentUser]);

  return <div>Logged in as {auth.currentUser?.displayName}</div>;
}

export default User;
