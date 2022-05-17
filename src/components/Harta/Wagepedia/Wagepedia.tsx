import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import wMdP from "./wagepedia.md";

function Wagepedia({
  type,
  closeFunc,
}: {
  type?: "mobile" | "desktop";
  closeFunc: any;
}) {
  const [wMd, setWMd] = useState("");

  useEffect(() => {
    (async function () {
      const md = await (await fetch(wMdP)).text();
      setWMd(md);
    })();
  });

  return (
    <div className="p-4 w-full flex flex-col space-y-6 overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200 h-full">
      <div className="grid grid-cols-3 grid-rows-1 justify-items-center justify-between items-start text-2xl h-full">
        <div />
        <span className="text-3xl font-bold pt-4">Wagepedia</span>
        <div className="flex flex-row justify-end w-full">
          <button
            onClick={() => {
              closeFunc();
            }}
            className=" text-white flex flex-row justify-center items-center space-x-1.5 bg-gray-900 bg-opacity-50 hover:bg-opacity-75 pl-1 pr-2 transition-all duration-200 rounded-full py-0.5"
          >
            <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" />
            <span className="text-sm">Inchide</span>
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center py-4">
        <ReactMarkdown
          children={wMd}
          className="prose overflow-auto prose-green"
        />
      </div>
    </div>
  );
}

export default Wagepedia;
