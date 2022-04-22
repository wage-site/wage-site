import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Auth";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";

function Settings() {
  useDocumentTitle("Setari");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (!user) navigate("/user/login", { replace: true });
  }, [user]);
  return (
    <div className="w-full h-full p-2 flex flex-col justify-center items-center">
      <div className="w-full h-full rounded-lg bg-white shadow-sm p-4 flex flex-row relative">
        <div className="w-full h-min flex flex-row justify-between items-center">
          <div className="font-bold text-2xl">Setari</div>
          <div className="hidden sm:block">
            <span>Logged in as {user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
