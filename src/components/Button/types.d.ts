interface MainButtonProps {
  isHref?: boolean;
  isLink?: boolean;
  href?: string;
  onClick?: any;
  to?: string;
  children?: any;
  type:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  className?: string;
}

interface ButtonProps {
  isHref?: boolean;
  isLink?: boolean;
  href?: string;
  onClick?: any;
  to?: string;
  children?: any;
  className?: string;
}
