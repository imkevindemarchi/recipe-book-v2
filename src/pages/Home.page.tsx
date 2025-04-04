import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Api
import { CATEGORY_API, RECIPE_API } from "../api";

// Assets
import sushiImg from "../assets/images/sushi.png";

// Components
import { Button, CategoryCard } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import { THTTPResponse } from "../types";
import { TCategory } from "../types/category.type";
import { TCategoryCard } from "../components/CategoryCard.component";
import { TRecipe } from "../types/recipe.type";

// Utils
import { setPageTitle } from "../utils";

const Home: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [categories, setCategories] = useState<TCategoryCard[]>([]);
  const navigate: NavigateFunction = useNavigate();

  setPageTitle(t("home"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([CATEGORY_API.getAll(), RECIPE_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess) {
          if (response[1] && response[1].hasSuccess) {
            const elabCategories: TCategoryCard[] = response[0].data.map(
              (category: TCategory) => {
                const totalRecipes: number = response[1].data.filter(
                  (recipe: TRecipe) => recipe.category?.id === category.id
                ).length;

                return { ...category, totalRecipes };
              }
            );

            setCategories(elabCategories);
          } else openPopup(t("unableLoadRecipes"), "error");
        } else openPopup(t("unableLoadCategories"), "error");
      }
    );

    setIsLoading(false);
  }

  const image: ReactNode = (
    <img
      src={sushiImg}
      alt={t("imgNotFound")}
      className="w-[30%] mobile:w-[80%]"
    />
  );

  const categoriesComponent: ReactNode = (
    <div className="flex justify-between mt-60 gap-20 mobile:mt-40 mobile:flex-col mobile:gap-28">
      {categories.map((category: TCategoryCard, index: number) => {
        return (
          <CategoryCard key={index} data={category} isDarkMode={isDarkMode} />
        );
      })}
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center mobile:flex-col mobile:gap-10">
        <div className="flex flex-col">
          <span
            className={`text-[3em] font-bold transition-all duration-300 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {process.env.REACT_APP_WEBSITE_NAME}
          </span>
          <div className="py-20 mobile:py-10">
            <span
              className={`transition-all duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t("homeDescription")}
            </span>
          </div>
          <Button
            onClick={() => navigate("/recipes")}
            className="w-40 mobile:w-36"
          >
            <span
              className={`transition-all duration-300 ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              {t("exploreRecipes")}
            </span>
          </Button>
        </div>
        {image}
      </div>
      {categoriesComponent}
    </div>
  );
};

export default Home;
