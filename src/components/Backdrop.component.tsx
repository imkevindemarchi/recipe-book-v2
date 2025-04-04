import React, { FC, ReactNode } from "react";

interface IProps {
  isDarkMode: boolean;
  children: ReactNode;
  hideBackground?: boolean;
}

const Backdrop: FC<IProps> = ({ isDarkMode, hideBackground, children }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${
        isDarkMode && !hideBackground
          ? "bg-white-transparent"
          : !hideBackground && "bg-black-transparent"
      }`}
    >
      {children}
    </div>
  );
};

export default Backdrop;
