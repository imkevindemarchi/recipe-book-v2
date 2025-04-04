import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Components
import Button from "./Button.component";

// Icons
import { ClockIcon, PersonIcon } from "../assets/icons";

// Types
import { TRecipe } from "../types/recipe.type";

interface IProps {
  data: TRecipe;
  isDarkMode: boolean;
}

const RecipeCard: FC<IProps> = ({ data, isDarkMode, ...props }) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  return (
    <div
      className={`transition-all duration-300 rounded-3xl flex flex-col justify-between w-60 py-5 px-5 h-[30vh] mobile:h-[40vh] mobile:w-full mobile:gap-2 ${
        isDarkMode ? "bg-darkgray" : "bg-lightgray"
      }`}
      {...props}
    >
      <div className="rounded-3xl overflow-hidden border-primary mobile:w-full">
        <img
          src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${data?.id}`}
          alt={t("imgNotFound")}
        />
      </div>
      <span
        className={`transition-all duration-300 text-ellipsis text-xl font-bold ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {data.name}
      </span>
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isDarkMode ? "text-gray" : "text-darkgray2"
          }`}
        >
          <ClockIcon />
          <span>{data.time}</span>
        </div>
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isDarkMode ? "text-gray" : "text-darkgray2"
          }`}
        >
          <PersonIcon />
          <span>{data.people}</span>
        </div>
      </div>
      <Button width="100%" onClick={() => navigate(`/recipes/${data.id}`)}>
        <span className="text-white text-xs mobile:text-sm">
          {t("viewRecipe")}
        </span>
      </Button>
    </div>
  );
};

export default RecipeCard;
