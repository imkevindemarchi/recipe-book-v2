import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

// Api
import { CATEGORY_API, RECIPE_API } from "../api";

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
import { TCategory } from "../types/category.type";
import { TRecipe } from "../types/recipe.type";

// Utils
import { setPageTitle, sortArray } from "../utils";

const Category: FC = () => {
  const { t } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { categoryId } = useParams();
  const [recipes, setRecipes] = useState<TRecipe[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const [category, setCategory] = useState<TCategory | null>(null);

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

  setPageTitle(category?.label as string);

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([
      RECIPE_API.getAll(),
      CATEGORY_API.get(categoryId as string),
    ]).then((response: THTTPResponse[]) => {
      if (response[0] && response[0].hasSuccess) {
        const recipes: TRecipe[] = response[0].data.filter(
          (recipe: TRecipe) => {
            return recipe.category?.id === categoryId;
          }
        );

        setRecipes(recipes);
      } else openPopup(t("unableLoadRecipes"), "error");

      if (response[1] && response[1].hasSuccess) setCategory(response[1].data);
      else openPopup(t("unableLoadCategory"), "error");
    });

    setIsLoading(false);
  }

  const title: ReactNode = (
    <span className="text-primary text-3xl">{category?.label}</span>
  );

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
      {filteredRecipes.map((recipe: TRecipe, index: number) => {
        return <RecipeCard key={index} data={recipe} isDarkMode={isDarkMode} />;
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
      {title}
      {recipes.length > 0 ? (
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

export default Category;
