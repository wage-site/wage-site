import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function User() {
  useDocumentTitle("Profil");
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !loading) {
      navigate("/user/login", { replace: true });
    }
  }, [user]);

  return <div>Logged in as {user?.displayName}</div>;
}

export default User;
