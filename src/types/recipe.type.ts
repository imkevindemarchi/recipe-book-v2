import { TCategory } from "./category.type";
import { TRecipeIngredient } from "./ingredient.type";

export type TRecipe = {
  id: string | null;
  name: string | null;
  time: string | null;
  isFavourite: boolean | null;
  people: number | null;
  createDate: Date | string | null;
  category: TCategory | null;
  procedure: string[] | null;
  ingredients: TRecipeIngredient[] | null;
};
