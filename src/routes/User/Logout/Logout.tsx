import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";

function Logout() {
  useDocumentTitle("Logout");
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        navigate("/user/login", { replace: true });
      }
    });
  }, [auth.currentUser]);

  useEffect(() => {
    auth.signOut();
  });

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      Logging out..
    </div>
  );
}

export default Logout;
