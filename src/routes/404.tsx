import * as React from "react";
import { useState, useEffect } from "react";

import BG from "../assets/svg/404bg.svg";

import { Button } from "../components/Button";

function Page404() {
  return (
    <>
      <img
        src={BG}
        alt=""
        className="-z-10 h-full w-full absolute object-cover opacity-50"
      />
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="text-xl font-bold">Se pare ca te ai pierdut!</div>
        <div className="text-sm mt-2">Aceasta pagina nu exista</div>
        <Button isLink to="/" type="primary" className="mt-3">
          Inapoi Acasa
        </Button>
      </div>
    </>
  );
}

export default Page404;
