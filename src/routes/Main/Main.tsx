import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import usePathCondition from "../../lib/hooks/usePathCondition";

function Main() {
  usePathCondition();

  return (
    <div className="w-full flex flex-col bg-white font-custom">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Main;
