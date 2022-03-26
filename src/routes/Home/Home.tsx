import Navbar from "../../components/Navbar";

function Home() {
  return (
    <>
      <div className="md:hidden block">
        <Navbar type="mobile" />
      </div>
      <div className="md:block hidden">
        <Navbar type="desktop" />
      </div>
    </>
  );
}

export default Home;
