import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Api
import { RECIPE_API } from "../api";

// Components
import { Input, RecipeCard } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { SearchIcon } from "../assets/icons";

// Types
import { THTTPResponse } from "../types";
import { TRecipe } from "../types/recipe.type";

// Utils
import { setPageTitle, sortArray } from "../utils";

const Saved: FC = () => {
  const { t } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [recipes, setRecipes] = useState<TRecipe[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;

  const filteredRecipes: TRecipe[] = sortArray(
    recipes.filter((recipe: TRecipe) => {
      return (
        !filter ||
        filter.trim() === "" ||
        recipe.name
          ?.toLowerCase()
          ?.trim()
          ?.includes(filter?.toLowerCase()?.trim() as string)
      );
    }),
    "name"
  );

  setPageTitle(t("recipes"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(RECIPE_API.getAll()).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) {
          setRecipes(response.data);
        } else openPopup(t("unableLoadRecipes"), "error");
      }
    );

    setIsLoading(false);
  }

  const input: ReactNode = (
    <Input
      autofocus
      value={filter}
      onChange={(value: string) => setFilter(value)}
      icon={<SearchIcon className="text-primary text-2xl" />}
      placeholder={t("name")}
      isDarkMode={isDarkMode}
      width="100%"
    />
  );

  const list: ReactNode = (
    <div className="flex items-center gap-10 flex-wrap justify-center mobile:gap-5">
      {filteredRecipes
        .filter((recipe: TRecipe) => recipe.isFavourite)
        .map((recipe: TRecipe, index: number) => {
          return (
            <RecipeCard key={index} data={recipe} isDarkMode={isDarkMode} />
          );
        })}
    </div>
  );

  const noData: ReactNode = (
    <span
      className={`transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      {t("noData")}
    </span>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {recipes.filter((recipe: TRecipe) => recipe.isFavourite).length > 0 ? (
        <>
          {input}
          {list}
        </>
      ) : (
        noData
      )}
    </div>
  );
};

export default Saved;
