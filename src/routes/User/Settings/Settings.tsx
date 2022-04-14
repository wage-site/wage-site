import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";

function Settings() {
  useDocumentTitle("Setari");
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/user/login");
      }
    });
  }, [auth.currentUser]);
  return (
    <div className="w-full h-full p-2 flex flex-col justify-center items-center">
      <div className="w-full h-full rounded-lg bg-white shadow-sm p-4 flex flex-row relative">
        <div className="w-full h-min flex flex-row justify-between items-center">
          <div className="font-bold text-2xl">Setari</div>
          <div className="hidden sm:block">
            <span>Logged in as {auth.currentUser?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
