import React, { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  isDarkMode: boolean;
  filled?: boolean;
  visibleBackground?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: FC<IProps> = ({
  isDarkMode,
  filled,
  visibleBackground,
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-10 rounded-3xl shadow-sm w-full h-full transition-all duration-300 mobile:p-5
        ${
          !filled &&
          (isDarkMode && visibleBackground
            ? "bg-darkgray"
            : visibleBackground
            ? "bg-lightgray"
            : isDarkMode
            ? "bg-black"
            : "bg-white")
        } ${className}
      `}
      style={{
        background: filled
          ? `linear-gradient(to right,  ${process.env.REACT_APP_PRIMARY_COLOR} 50%, ${process.env.REACT_APP_SECONDARY_COLOR} 100%)`
          : "",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
