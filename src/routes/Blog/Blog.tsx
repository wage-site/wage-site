import { lazy, Suspense } from "react";

function Blog() {
  const Navbar = lazy(() => import("../../components/Navbar"));
  return (
    <Suspense fallback={<div className="bg-gray-100"></div>}>
      <div className="h-full w-full flex flex-col bg-gray-100">
        <Navbar />
      </div>
    </Suspense>
  );
}

export default Blog;
