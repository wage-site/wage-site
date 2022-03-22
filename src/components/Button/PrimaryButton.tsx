import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PrimaryButton({
  isHref = false,
  isLink = false,
  href = "",
  onClick,
  to = "",
  children,
  className,
}: ButtonProps) {
  const globalStyle =
    "border-2 px-3 py-1 rounded-lg border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-gray-200 transition-all duration-300";
  return (
    <>
      {isHref ? (
        <a className={`${globalStyle} ${className}`} href={href}>
          {children}
        </a>
      ) : isLink ? (
        <Link className={`${globalStyle} ${className}`} to={to}>
          {children}
        </Link>
      ) : (
        <button
          className={`${globalStyle} ${className}`}
          onClick={onClick ? onClick : () => {}}
        >
          {children}
        </button>
      )}
    </>
  );
}

export default PrimaryButton;
