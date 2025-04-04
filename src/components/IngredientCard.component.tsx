import React, { FC } from "react";

// Types
import { TRecipeIngredient } from "../types/ingredient.type";

interface IProps {
  data: TRecipeIngredient;
  isDarkMode: boolean;
  filled?: boolean;
  visibleBackground?: boolean;
  className?: string;
  onClick?: () => void;
}

const IngredientCard: FC<IProps> = ({
  isDarkMode,
  filled,
  visibleBackground,
  data,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`px-5 py-2 rounded-xl flex justify-between shadow-sm h-full w-60 overflow-hidden transition-all duration-300 mobile:p-5
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
      <div className="w-[90%] overflow-hidden text-ellipsis">
        <span
          className={`transition-all duration-300 whitespace-nowrap w-full ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >{`${data.icon} ${data.label}`}</span>
      </div>
      <span
        className={`transition-all duration-300 whitespace-nowrap ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {data.quantity}
      </span>
    </div>
  );
};

export default IngredientCard;
