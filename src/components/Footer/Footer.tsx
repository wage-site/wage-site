import { HTMLAttributes } from "react";

function Footer(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`${
        props.className ? `${props.className} ` : ""
      }w-full h-96 flex flex-col justify-start items-center`}
      {...props}
    ></div>
  );
}

export default Footer;
