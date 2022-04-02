import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Home() {
  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Home;
