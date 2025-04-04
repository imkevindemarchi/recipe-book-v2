import { FC, ReactNode } from "react";

type TStyleType = "primary" | "secondary" | "round" | "secondaryRound";
interface IProps {
  type?: "button" | "submit";
  children: ReactNode;
  disabled?: boolean;
  isDarkMode?: boolean;
  onClick?: () => void;
  styleType?: TStyleType;
  className?: string;
  width?: string;
}

const Button: FC<IProps> = ({
  type = "button",
  disabled,
  isDarkMode,
  onClick,
  styleType = "primary",
  className,
  width,
  children,
}) => {
  return styleType === "round" ? (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`rounded-full border-2 w-12 h-12 flex flex-row items-center justify-center transition-all duration-300 desktop:hover:opacity-50 ${
        disabled && isDarkMode
          ? "bg-darkgray border-darkgray"
          : disabled
          ? "bg-lightgray border-lightgray"
          : "bg-primary border-primary"
      }`}
    >
      {children}
    </button>
  ) : styleType === "secondaryRound" ? (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className="rounded-full border-2 w-12 h-12 flex flex-row items-center justify-center bg-none border-primary desktop:hover:opacity-50 transition-all duration-300"
    >
      {children}
    </button>
  ) : styleType === "secondary" ? (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`rounded-full py-2 border-2 mobile:w-full w-32 flex flex-row items-center justify-center gap-1 transition-all duration-300 ${
        disabled && isDarkMode
          ? "bg-darkgray border-darkgray cursor-not-allowed"
          : disabled
          ? "bg-lightgray border-lightgray cursor-not-allowed"
          : "border-primary desktop:hover:opacity-50"
      } ${className}`}
      style={{ width }}
    >
      {children}
    </button>
  ) : (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`rounded-full py-2 border-2 mobile:w-full w-32 flex flex-row items-center justify-center gap-1 transition-all duration-300 ${
        disabled && isDarkMode
          ? "bg-darkgray border-darkgray cursor-not-allowed"
          : disabled
          ? "bg-lightgray border-lightgray cursor-not-allowed"
          : "bg-primary border-primary desktop:hover:opacity-50"
      } ${className}`}
      style={{ width }}
    >
      {children}
    </button>
  );
};

export default Button;
