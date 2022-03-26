import * as React from "react";
import { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";

import HomeBG from "../../assets/svg/home-intro-bg.svg";

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
