import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

// Api
import { RECIPE_API } from "../api";

// Components
import { GoBackButton, IngredientCard, Stepper } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { BookMarkFilledIcon, BookMarkIcon } from "../assets/icons";

// Types
import { THTTPResponse } from "../types";
import { TRecipe } from "../types/recipe.type";
import { TRecipeIngredient } from "../types/ingredient.type";

// Utils
import { setPageTitle } from "../utils";

const Recipe: FC = () => {
  const { t } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [recipe, setRecipe] = useState<TRecipe | null>(null);
  const { recipeId } = useParams();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;

  setPageTitle(recipe?.name as string);

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(RECIPE_API.get(recipeId as string)).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) setRecipe(response.data);
        else openPopup(t("unableLoadRecipe"), "error");
      }
    );

    setIsLoading(false);
  }

  const goBackButton: ReactNode = <GoBackButton />;

  const image = (
    <div className="h-96 overflow-hidden rounded-t-3xl relative mobile:h-40">
      <img
        src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${recipe?.id}`}
        alt={t("imgNotFound")}
        className="w-full h-full object-cover"
      />
      <div
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className={`transition-all duration-300 absolute flex justify-center items-center w-full h-full ${
          isDarkMode ? "bg-black-transparent" : "bg-white-transparent"
        }`}
      >
        <span className="font-bold text-white uppercase text-3xl mobile:text-xl">
          {recipe?.name}
        </span>
      </div>
    </div>
  );

  async function onFavouriteRecipeHandler(): Promise<void> {
    const data: TRecipe = {
      ...(recipe as TRecipe),
      isFavourite: !recipe?.isFavourite,
    };

    await Promise.resolve(RECIPE_API.update(data, recipeId as string)).then(
      async (recipeRes: THTTPResponse) => {
        if (recipeRes && recipeRes.hasSuccess)
          await Promise.resolve(RECIPE_API.get(recipeId as string)).then(
            (response: THTTPResponse) => {
              if (response && response.hasSuccess) setRecipe(response.data);
              else openPopup(t("unableLoadRecipe"), "error");
            }
          );
        else openPopup(t("unableUpdateRecipe"), "error");
      }
    );
  }

  const info: ReactNode = (
    <div
      className={`transition-all duration-300 mt-[-2vh] p-10 rounded-3xl absolute w-full flex flex-col gap-5 mobile:p-5 ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="flex justify-between">
        <span
          className={`transition-all duration-300 font-bold text-2xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("ingredients")}
        </span>
        <div
          onClick={onFavouriteRecipeHandler}
          className="transition-all duration-300 text-3xl text-primary hover:opacity-50 cursor-pointer mobile:hover:opacity-100"
        >
          {recipe?.isFavourite ? <BookMarkFilledIcon /> : <BookMarkIcon />}
        </div>
      </div>
      <div
        style={{ overflowX: "scroll" }}
        className="w-full flex-wrap flex items-center gap-5 mobile:flex-col"
      >
        {recipe?.ingredients?.map(
          (ingredient: TRecipeIngredient, index: number) => {
            return (
              <IngredientCard
                key={index}
                isDarkMode={isDarkMode}
                visibleBackground
                data={ingredient}
                className="mobile:w-full"
              />
            );
          }
        )}
      </div>
      <span
        className={`transition-all duration-300 font-bold text-2xl ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("procedure")}
      </span>
      <Stepper isDarkMode={isDarkMode} steps={recipe?.procedure as string[]} />
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {goBackButton}
      <div className="relative h-[70vh] mobile:h-[110vh]">
        {image}
        {info}
      </div>
    </div>
  );
};

export default Recipe;
