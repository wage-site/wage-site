import * as React from "react";
import { useState, useEffect } from "react";

import { PrimaryButton } from "./index";

function Button({
  isHref = false,
  isLink = false,
  href = "",
  onClick,
  to = "",
  children,
  type,
  className,
}: MainButtonProps) {
  switch (type) {
    case "primary":
      return (
        <PrimaryButton
          isHref={isHref ? isHref : false}
          onClick={onClick}
          isLink={isLink ? isLink : false}
          href={href}
          to={to}
          className={className}
        >
          {children}
        </PrimaryButton>
      );
      break;
    default:
      return <></>;
  }
}

export default Button;
