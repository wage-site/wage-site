import * as React from "react";
import { useState, useEffect } from "react";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

function Navbar({ type }: { type: "mobile" | "desktop" }) {
  switch (type) {
    case "desktop":
      return <DesktopNavbar />;
    case "mobile":
      return <MobileNavbar />;
    default:
      return <></>;
  }
}

export default Navbar;
