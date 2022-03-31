import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { lazy, Suspense } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const FontAwesomeIcon = lazy(() =>
    import("@fortawesome/react-fontawesome").then((module) => ({
      default: module.FontAwesomeIcon,
    }))
  );

  const location = useLocation();

  const navigation = [
    { name: "Proiecte", href: "", current: location.pathname == "/proiecte" },
    { name: "Blog", href: "/blog", current: location.pathname == "/blog" },
    {
      name: "Colaboratori",
      href: "/colab",
      current: location.pathname == "/colab",
    },
  ];
  return (
    <Suspense fallback={<div></div>}>
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-gray-100 transition-all duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:justify-start h-full">
                  <Link to="/" className="flex-shrink-0 flex items-center">
                    <FontAwesomeIcon
                      icon={faLeaf}
                      className="block lg:hidden h-8 w-auto text-green-600"
                    />
                    <div className="flex-row justify-center items-center hidden lg:flex space-x-4">
                      <FontAwesomeIcon
                        icon={faLeaf}
                        className="h-8 w-auto text-green-600"
                      />
                      <span className="text-lg font-semibold">WAGE Team</span>
                    </div>
                  </Link>
                  <div className="hidden sm:block sm:ml-6 h-full">
                    <div className="flex space-x-4 h-full justify-center items-center">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
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
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-1 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "text-gray-900 border-l-2 border-green-500 pl-[calc(0.5rem+2px)]"
                        : "text-gray-300 border-l-0 hover:border-l-2 border-gray-300 hover:border-green-500 hover:text-gray-900 bg-opacity-50 hover:pl-[calc(0.5rem+2px)] transition-all duration-100",
                      "block px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Suspense>
  );
}

export default Navbar;
