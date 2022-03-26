import {
  faLeaf,
  faList,
  faSquareRss,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ArrowCircleRightIcon } from "@heroicons/react/outline";

import { Fragment } from "react";

import { Link } from "react-router-dom";

import { Popover, Transition } from "@headlessui/react";

import HartaBG from "../../assets/image/LogoHartaP.png";
import { Button } from "../Button";

function DesktopNavbar() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 h-14 bg-slate-100 px-12 lg:px-40">
      <Link
        to="/"
        className="flex flex-row justify-start items-center space-x-3"
      >
        <FontAwesomeIcon icon={faLeaf} className="text-green-500 h-6 w-6" />
        <span className="font-semibold text-lg">WAGE Team</span>
      </Link>
      <div className="flex flex-row justify-end items-center space-x-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "" : "text-opacity-90"}
                flex flex-row justify-center items-center text-lime-500 px-3 py-1 space-x-2 rounded-lg hover:bg-lime-500 hover:text-gray-50 transitiom-all duration-200`}
              >
                <FontAwesomeIcon icon={faList} className="pt-[1px]" />
                <span>Proiecte</span>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-[32rem] px-4 mt-4 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 grid-cols-2">
                      <div className="bg-gray-100 rounded-lg flex flex-col justify-center items-start">
                        <img
                          src={HartaBG}
                          alt=""
                          className="rounded-t-lg object-cover"
                        />
                        <div className="m-3 mt-0 flex flex-col justify-center items-start">
                          <Link
                            to="/proiecte/harta"
                            className="text-lg flex flex-row justify-between items-center w-full group mt-2"
                          >
                            <span className="peer">Harta Poluarii</span>
                            <ArrowCircleRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          </Link>
                          <div className="h-[1px] mt-1 w-full rounded-full opacity-20 bg-gray-900" />
                          <div className="text-sm mt-2 text-gray-600">
                            Echipa W.A.G.E. a infiintat o retea de senzori ce
                            masoara calitatea aerului in diferite zone ale
                            Orasului Campulung.
                          </div>
                        </div>
                        <div className="p-3 pt-0 flex flex-col w-full">
                          <Button
                            type="primary"
                            isLink
                            to="/proiecte/harta"
                            className="text-sm"
                          >
                            Vezi Proiectul
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <a
                        href="/proiecte"
                        className="flex flex-row justify-between px-2 py-2 transition duration-150 ease-in-out rounded-md hover:bg-gray-100"
                      >
                        <span>Vezi toate proiectele</span>
                        <ArrowCircleRightIcon className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Link
          to="/blog"
          className="flex flex-row justify-center items-center text-lime-500 px-3 py-1 space-x-2 rounded-lg hover:bg-lime-500 hover:text-gray-50 transitiom-all duration-200"
        >
          <FontAwesomeIcon
            icon={faSquareRss}
            className="pt-[2px] h-3.5 w-3.5"
          />
          <span>Blog</span>
        </Link>
        <Link
          to="/colab"
          className="flex flex-row justify-center items-center  text-lime-500 px-3 py-1 space-x-2 rounded-lg hover:bg-lime-500 hover:text-gray-50 transitiom-all duration-200"
        >
          <FontAwesomeIcon icon={faUsers} className="pt-[1px] h-4 w-4" />
          <span>Colaboratori</span>
        </Link>
      </div>
    </div>
  );
}

export default DesktopNavbar;
