type ButtonTypes =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

type Styles = {
  [key in ButtonTypes]?: string;
};
interface ButtonProps {
  isHref?: boolean;
  isLink?: boolean;
  href?: string;
  onClick?: any;
  to?: string;
  children?: any;
  type: ButtonTypes;
  className?: string;
  disabled?: boolean;
}
