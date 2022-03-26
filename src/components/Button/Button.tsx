import * as React from "react";
import { useState, useEffect } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

import cln from "classnames";

function Button({
  isHref = false,
  isLink = false,
  href = "",
  onClick,
  to = "",
  children,
  type,
  className,
}: ButtonProps) {
  const styles: Styles = {
    primary:
      "border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-gray-50",
    secondary:
      "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-gray-50",
    danger: "border-red-600 text-red-600 hover:bg-red-600 hover:text-gray-50",
    info: "border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-gray-50",
    success:
      "border-green-500 text-green-500 hover:bg-green-500 hover:text-gray-50",
    warning:
      "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-50",
    dark: "border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-gray-50",
    light: "border-zinc-50 text-zinc-50 hover:bg-zinc-50 hover:text-zinc-900",
  };
  const mainStyle = `border-[0.15rem] transition-all duration-300 px-3 py-1 rounded-lg font-medium leading-snug text-center`;
  return (
    <>
      {isHref ? (
        <a
          href={href}
          className={cln(mainStyle, _.get(styles, type), className)}
        >
          {children}
        </a>
      ) : isLink ? (
        <Link
          to={to}
          className={cln(mainStyle, _.get(styles, type), className)}
        >
          {children}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={cln(mainStyle, _.get(styles, type), className)}
        >
          {children}
        </button>
      )}
    </>
  );
}

export default Button;
