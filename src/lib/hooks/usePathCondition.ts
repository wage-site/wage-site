import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function usePathCondition() {
  const location = useLocation();

  useEffect(() => {
    if (window.location.pathname === "/proiecte/harta") {
      document.documentElement.classList.add(
        "h-full",
        "w-full",
        "overflow-hidden"
      );
      document.body.classList.add("h-full", "w-full", "overflow-hidden");
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
      document
        .getElementById("root")
        ?.classList.remove("h-full", "w-full", "overflow-hidden");
    }
  }, [location.pathname]);
}

export default usePathCondition;
