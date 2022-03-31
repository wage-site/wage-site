import { lazy, Suspense } from "react";

function Home() {
  const Navbar = lazy(() => import("../../components/Navbar"));

  return (
    <Suspense fallback={<div className="bg-gray-100"></div>}>
      <div className="h-full w-full flex flex-col bg-gray-100">
        <Navbar />
        <div className="h-96 w-full flex flex-col justify-center items-center">
          <div>
            <div className="rounded-lg"></div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default Home;
