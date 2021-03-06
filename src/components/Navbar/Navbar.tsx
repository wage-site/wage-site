import {
  faArrowRight,
  faArrowRightFromBracket,
  faCircleUser,
  faUser,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Fragment, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import proiecte from "../../lib/global/proiecte";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const { user, userDb } = useContext(AuthContext);

  const location = useLocation();

  const navigation = [
    {
      name: "Proiecte",
      href: "/proiecte",
      current: location.pathname.split("/").includes("proiecte"),
      displayOnDesktop: false,
    },
    {
      name: "Blog",
      href: "/blog",
      current: location.pathname.split("/").includes("blog"),
      displayOnDesktop: true,
    },
    {
      name: "Colaboratori",
      href: "/colab",
      current: location.pathname.split("/").includes("colab"),
      displayOnDesktop: true,
    },
  ];

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-[100] flex flex-row justify-center items-center w-full space-y-2 shadow-md bg-white"
    >
      {({ open }) => (
        <>
          <div className="w-full max-w-6xl px-2 sm:px-6 lg:px-8 ">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-gray-100 transition-all duration-200">
                  <span className="sr-only">Main Menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:justify-between h-full">
                <div className="flex items-center justify-start h-full">
                  <Link to="/" className="flex-shrink-0 flex items-center">
                    <span className="sr-only">Home</span>
                    <img
                      src="/svg/LogoSquare.svg"
                      className="block lg:hidden h-10 w-auto text-green-600"
                      alt=""
                      loading="lazy"
                    />
                    <div className="flex-row justify-center items-center hidden lg:flex space-x-4">
                      <img
                        src="/svg/LogoSquare.svg"
                        className="h-9 w-auto text-green-600"
                        alt=""
                        loading="lazy"
                      />
                      <span className="text-lg font-semibold">
                        W.A.G.E. Team
                      </span>
                    </div>
                  </Link>
                  <div className="hidden sm:block sm:ml-6 h-full">
                    <div className="flex space-x-4 h-full justify-center items-center">
                      <Popover className="relative h-full z-50">
                        {({ open }) => (
                          <>
                            <Popover.Button
                              className={classNames(
                                location.pathname
                                  .split("/")
                                  .includes("proiecte") || open
                                  ? "border-b-2 border-green-500 text-gray-900 pt-[calc(0.5rem+2px)]"
                                  : "text-gray-300 border-gray-300 hover:border-green-500 border-b-0 hover:border-b-2 hover:pt-[calc(0.5rem+2px)] hover:text-gray-900",
                                "px-3 py-2 border-b-2 text-sm font-medium h-full flex justify-center items-center transition-all duration-100"
                              )}
                              aria-current={
                                location.pathname
                                  .split("/")
                                  .includes("proiecte")
                                  ? "page"
                                  : undefined
                              }
                            >
                              Proiecte
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
                              <Popover.Panel className="absolute z-10 w-96 px-4 mt-3 transform lg:-translate-x-1/2 lg:left-1/2 sm:px-0 lg:max-w-3xl">
                                {({ close }) => (
                                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative flex flex-col justify-start items-center space-y-3 bg-white p-4">
                                      <div className="w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-3 after:flex-1 space-x-2 after:bg-black after:opacity-50">
                                        <span className="flex-shrink text-lg font-semibold">
                                          Cel mai recent proiect
                                        </span>
                                      </div>
                                      {proiecte.slice(0, 1).map((proiect) => (
                                        <div
                                          className="w-full flex flex-col justify-start items-center rounded-lg bg-gray-100"
                                          key={proiect.title}
                                        >
                                          <Link
                                            to={proiect.location}
                                            replace
                                            className="relative w-full h-32 rounded-t-lg group"
                                          >
                                            <img
                                              src={proiect.image}
                                              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                                              alt=""
                                              loading="lazy"
                                            />
                                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute w-full h-full top-0 left-0 bg-black bg-opacity-70 flex flex-row justify-center items-center space-x-2 rounded-t-lg text-white">
                                              <span>Vezi Proiectul</span>
                                              <FontAwesomeIcon
                                                icon={faArrowRight}
                                              />
                                            </div>
                                          </Link>
                                          <div className="w-full p-4 flex flex-col justify-start items-start space-y-3">
                                            <div className="w-full flex flex-col justify-start items-start">
                                              <Link
                                                to={proiect.location}
                                                className="font-semibold group inline-flex flex-row justify-center items-center space-x-2"
                                              >
                                                <span>{proiect.title}</span>
                                                <FontAwesomeIcon
                                                  icon={faArrowRight}
                                                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                />
                                              </Link>
                                              <div className="font-light text-xs w-full">
                                                {proiect.subtitle}
                                              </div>
                                            </div>
                                            <div className="w-full h-px bg-black opacity-20" />
                                            <div className="text-sm text-neutral-800">
                                              {proiect.details}
                                            </div>
                                            <Link
                                              to={proiect.location}
                                              replace
                                              className="inline-flex flex-row justify-center items-center space-x-1.5 py-1 w-full text-center border-2 rounded-lg border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                                            >
                                              <span>Vezi Proiectul</span>
                                              <FontAwesomeIcon
                                                icon={faArrowRight}
                                                className="w-3.5 h-3.5"
                                              />
                                            </Link>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="p-4 bg-gray-50">
                                      <Link
                                        to="/proiecte"
                                        onClick={() => {
                                          close();
                                        }}
                                        className="flow-root px-2 py-2 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                      >
                                        <span className="flex items-center">
                                          <span className="text-sm font-medium text-gray-900">
                                            Toate proiectele
                                          </span>
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                          Vezi toate proiectele facute de noi
                                        </span>
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                      {navigation
                        .filter((x) => {
                          return x.displayOnDesktop;
                        })
                        .map((item) => (
                          <Link
                            to={item.href}
                            key={item.name}
                            className={classNames(
                              item.current
                                ? "border-b-2 border-green-500 text-gray-900 pt-[calc(0.5rem+2px)]"
                                : "text-gray-300 border-gray-300 hover:border-green-500 border-b-0 hover:border-b-2 hover:pt-[calc(0.5rem+2px)] hover:text-gray-900",
                              "px-3 py-2 border-b-2 text-sm font-medium h-full flex justify-center items-center transition-all duration-100"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
                {user && (
                  <Menu
                    as="div"
                    className="relative text-left hidden sm:inline-block z-50"
                  >
                    <div>
                      <Menu.Button className="flex flex-col justify-center items-center">
                        <span className="sr-only">User Menu</span>
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="rounded-full h-6 w-6 text-gray-300 hover:text-green-500 transition-all duration-200"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-3 space-y-0.5 flex flex-col justify-center items-start">
                          <div className="font-base text-sm">
                            {user.displayName}
                          </div>
                          <div className="font-light text-xs opacity-50">
                            @{userDb?.username}
                          </div>
                        </div>
                        <div className="px-1 py-1 space-y-0.5 flex flex-col justify-center items-center">
                          <Link
                            to="/user"
                            className="group flex flex-row justify-between rounded-md items-center w-full px-2.5 py-2 text-sm hover:bg-gray-100"
                          >
                            <span>Profilul Tau</span>
                            <FontAwesomeIcon icon={faUser} />
                          </Link>
                          <Link
                            to="/user/settings"
                            className="group flex flex-row justify-between rounded-md items-center w-full px-2.5 py-2 text-sm hover:bg-gray-100"
                          >
                            <span>Setari</span>
                            <FontAwesomeIcon icon={faUserGear} />
                          </Link>
                        </div>
                        <div className="px-1 py-1">
                          <Link
                            to="/user/logout"
                            className="group flex flex-row justify-between rounded-md items-center w-full px-2.5 py-2 text-sm hover:bg-gray-100"
                          >
                            <span>Deconecteaza-te</span>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                          </Link>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              {user && (
                <Menu
                  as="div"
                  className="absolute right-0 p-2 text-left inline-block sm:hidden z-50"
                >
                  <div>
                    <Menu.Button className="flex flex-col justify-center items-center">
                      <span className="sr-only">User Menu</span>
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="rounded-full h-6 w-6 text-gray-300 hover:text-green-500 transition-all duration-200"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-3 space-y-0.5 flex flex-col justify-center items-start">
                        <div className="font-base text-sm">
                          {user.displayName}
                        </div>
                        <div className="font-light text-xs opacity-50">
                          @{userDb?.username}
                        </div>
                      </div>
                      <div className="px-1 py-1 space-y-0.5 flex flex-col justify-center items-center">
                        <Link
                          to="/user"
                          className="group flex flex-row justify-between rounded-md items-center w-full px-2.5 py-2 text-sm hover:bg-gray-100"
                        >
                          <span>Profilul Tau</span>
                          <FontAwesomeIcon icon={faUser} />
                        </Link>
                        <Link
                          to="/user/settings"
                          className="group flex flex-row justify-between rounded-md items-center w-full px-2.5 py-2 text-sm hover:bg-gray-100"
                        >
                          <span>Setari</span>
                          <FontAwesomeIcon icon={faUserGear} />
                        </Link>
                      </div>
                      <div className="px-1 py-1">
                        <Link
                          to="/user/logout"
                          className="group flex flex-row justify-between rounded-md items-center w-full px-2.5 py-2 text-sm hover:bg-gray-100"
                        >
                          <span>Deconecteaza-te</span>
                          <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </Link>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
          </div>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            as={Fragment}
          >
            <Disclosure.Panel className="z-50 sm:hidden bg-white shadow-sm m-2 py-1 px-0.5 rounded-lg absolute top-16 w-[calc(100%-1rem)]">
              <div className="p-2 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "text-gray-900 border-2 rounded-lg border-green-500 p-[calc(0.5rem+2px)]"
                        : "text-gray-300 rounded-lg border-2 border-opacity-0 hover:border-opacity-100 border-gray-300 hover:border-green-500 hover:text-gray-900 bg-opacity-50 transition-all duration-100",
                      "block px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
