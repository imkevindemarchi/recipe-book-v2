import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Components
import Card from "./Card.component";

// Types
import { TCategory } from "../types/category.type";

export type TCategoryCard = TCategory & {
  totalRecipes: number;
};

interface IProps {
  data: TCategoryCard;
  isDarkMode: boolean;
}

const CategoryCard: FC<IProps> = ({ data, isDarkMode, ...props }) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/categories/${data.id}`)}
      isDarkMode={isDarkMode}
      visibleBackground
      className="w-full relative pb-40 transition-all duration-300 hover:opacity-50 cursor-pointer mobile:hover:opacity-100 mobile:h-60"
      {...props}
    >
      <div className="absolute left-0 top-[-30%] w-full h-full flex justify-center items-center flex-col gap-5 mobile:top-[-35%]">
        <img
          src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${data.id}`}
          alt={t("imgNotFound")}
          className="w-40 mobile:w-60"
        />
        <span
          className={`transition-all duration-300 text-xl font-bold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {data.label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`transition-all duration-300 text-base ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {t("recipes")}:
          </span>
          <span className="text-2xl text-primary">{data.totalRecipes}</span>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
