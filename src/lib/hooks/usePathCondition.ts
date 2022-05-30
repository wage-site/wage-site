import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const fullscreenLocations = [
  "/proiecte/harta",
  "/user/login",
  "/user/register",
  "/user/logout",
  "/user/settings",
  "/user",
];

function usePathCondition(all = false) {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (
      fullscreenLocations.includes(window.location.pathname) ||
      window.location.pathname === `/user/${params.id}` ||
      all
    ) {
      document.documentElement.classList.add(
        "h-full",
        "w-full",
        "overflow-hidden"
      );
      document.body.classList.add("h-full", "w-full", "overflow-hidden");
      document.getElementById("main")?.classList.add("h-full");
      document.getElementById("footer")?.classList.add("hidden");
      document
        .getElementById("root")
        ?.classList.add("h-full", "w-full", "overflow-hidden");
    } else {
      document.documentElement.classList.remove(
        "h-full",
        "w-full",
        "overflow-hidden"
      );
      document.body.classList.remove("h-full", "w-full", "overflow-hidden");
      document.getElementById("main")?.classList.remove("h-full");
      document.getElementById("footer")?.classList.remove("hidden");
      document
        .getElementById("root")
        ?.classList.remove("h-full", "w-full", "overflow-hidden");
    }
  }, [location.pathname, params.id, all]);
}

export default usePathCondition;
