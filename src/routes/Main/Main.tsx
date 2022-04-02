import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Home() {
  return (
    <Suspense fallback={<div className="bg-gray-100"></div>}>
      <div className="h-full w-full flex flex-col bg-gray-100">
        <Navbar />
        <Outlet />
      </div>
    </Suspense>
  );
}

export default Home;
