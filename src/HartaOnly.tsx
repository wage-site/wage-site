import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Harta = lazy(() => import("./routes/Proiecte/Harta"));
const Page404 = lazy(() => import("./routes/404"));

function HartaOnly() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="w-full h-screen flex flex-row justify-center items-center space-x-2 font-custom">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
            <span>Se incarca...</span>
          </div>
        }
      >
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/" element={<Harta backButton={false} />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default HartaOnly;
