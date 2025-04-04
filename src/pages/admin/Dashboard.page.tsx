import React, { FC, ReactNode, useContext, useEffect, useState } from "react";

// Api
import { CATEGORY_API, RECIPE_API } from "../../api";

// Assets
import { useTranslation } from "react-i18next";
import { MONTHS } from "../../assets/constants";

// Components
import { Card, DoughnutChart, LineChart } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Types
import { TLineChartData } from "../../components/LineChart.component";
import { TDoughnutChartData } from "../../components/DoughnutChart.component";
import { THTTPResponse } from "../../types";
import { TCategory } from "../../types/category.type";
import { TRecipe } from "../../types/recipe.type";

// Utils
import { setPageTitle } from "../../utils";

const Dashboard: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const [totalRecipes, setTotalRecipes] = useState<number | null>(null);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [doughnutChartLabels, setDoughnutChartLabels] = useState<
    string[] | null
  >(null);
  const [doughnutChartData, setDoughnutChartData] = useState<number[] | null>(
    null
  );
  const [previousYearLineChartData, setPreviousYearLineChartData] =
    useState<any>(null);
  const [currentYearLineChartData, setCurrentYearLineChartData] = useState<
    number[] | null
  >(null);

  const pageTitle: string = t("dashboard");
  const elabDoughnutChartLabels: string[] = doughnutChartLabels?.map(
    (deck: string) => {
      return t(deck);
    }
  ) as string[];
  const currentYear: number = new Date().getFullYear();
  const previousYear: number = new Date().getFullYear() - 1;
  const elabDoughnutChartData: TDoughnutChartData = {
    label: t("category"),
    data: doughnutChartData as number[],
    backgroundColor: [
      process.env.REACT_APP_PRIMARY_COLOR as string,
      process.env.REACT_APP_SECONDARY_COLOR as string,
      process.env.REACT_APP_TERTIARY_COLOR as string,
      process.env.REACT_APP_FOURTH_COLOR as string,
      process.env.REACT_APP_FIFTH_COLOR as string,
    ],
  };
  const lineChartLabels: string[] = MONTHS.map((month: string) => {
    return t(month);
  });
  const elabLineChartData: TLineChartData[] = [
    {
      label: previousYear.toString(),
      data: previousYearLineChartData as number[],
      borderColor: process.env.REACT_APP_PRIMARY_COLOR as string,
    },
    {
      label: currentYear.toString(),
      data: currentYearLineChartData as number[],
      borderColor: process.env.REACT_APP_SECONDARY_COLOR as string,
    },
  ];

  setPageTitle(pageTitle);

  function splitTopsForMonth(recipes: TRecipe[]): any {
    const data: any = {};

    recipes.forEach((recipe: TRecipe) => {
      const recipeMonth: number = parseInt(
        (recipe?.createDate as string)?.split("-")[1]
      );

      if (!data[recipeMonth.toString()]) {
        data[recipeMonth] = [];
      }

      data[recipeMonth].push(recipe);
    });

    return data;
  }

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([RECIPE_API.getAll(), CATEGORY_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (
          response[0] &&
          response[0].hasSuccess &&
          response[1] &&
          response[1].hasSuccess
        ) {
          let totalApetizers: number = 0;
          let totalFirstDhises: number = 0;
          let totalSecondDhises: number = 0;
          let totalSideDhises: number = 0;
          let totalCakes: number = 0;

          response[0].data.forEach((recipe: TRecipe) => {
            switch (recipe.category?.label) {
              case "Antipasti": {
                totalApetizers += 1;
                break;
              }
              case "Primi": {
                totalFirstDhises += 1;
                break;
              }
              case "Secondi": {
                totalSecondDhises += 1;
                break;
              }
              case "Contorni": {
                totalSideDhises += 1;
                break;
              }
              case "Dolci": {
                totalCakes += 1;
                break;
              }
            }
          });

          const doughnutChartLabels: string[] = response[1].data.map(
            (category: TCategory) => {
              return category.label;
            }
          );

          setDoughnutChartLabels(doughnutChartLabels);
          setDoughnutChartData([
            totalApetizers,
            totalFirstDhises,
            totalSecondDhises,
            totalSideDhises,
            totalCakes,
          ]);

          const previousYearTops: TRecipe[] = response[0].data.filter(
            (recipe: TRecipe) => {
              const recipeYear: number = parseInt(
                (recipe?.createDate as string)?.split("-")[0]
              );

              return recipeYear === previousYear;
            }
          );
          const currentYearTops: TRecipe[] = response[0].data.filter(
            (recipe: TRecipe) => {
              const recipeYear: number = parseInt(
                (recipe?.createDate as string)?.split("-")[0]
              );

              return recipeYear === currentYear;
            }
          );

          const splittedPreviousYearTopsForMonth: any =
            splitTopsForMonth(previousYearTops);
          const splittedCurrentYearTopsForMonth: any =
            splitTopsForMonth(currentYearTops);

          const previousYearLineChartData: any = {};
          MONTHS.forEach((month: string, index: number) => {
            previousYearLineChartData[t(month)] =
              splittedPreviousYearTopsForMonth[index + 1]?.length;
          });
          const currentYearLineChartData: any = {};
          MONTHS.forEach((month: string, index: number) => {
            currentYearLineChartData[t(month)] =
              splittedCurrentYearTopsForMonth[index + 1]?.length;
          });

          setPreviousYearLineChartData(previousYearLineChartData);
          setCurrentYearLineChartData(currentYearLineChartData);

          setTotalRecipes(response[0]?.totalRecords as number);
        } else openPopup(t("unableLoadRecipes"), "error");
      }
    );

    setIsLoading(false);
  }

  const title: ReactNode = (
    <span className="text-primary text-2xl">{pageTitle}</span>
  );

  const totalTopsComponent: ReactNode = (
    <Card filled isDarkMode={isDarkMode}>
      <div
        className={`flex flex-col transition-all duration-300 ${
          isDarkMode ? "text-black" : "text-white"
        }`}
      >
        <span>{t("totalRecipes")}</span>
        <span className="text-[3em] font-bold">{totalRecipes}</span>
      </div>
    </Card>
  );

  const tops: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <LineChart
        labels={lineChartLabels}
        data={elabLineChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  const bestDecks: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <DoughnutChart
        labels={elabDoughnutChartLabels}
        data={elabDoughnutChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title}
      <div className="flex flex-row w-full gap-5 mobile:flex-col">
        <div className="w-[40%] flex flex-row justify-between flex-wrap gap-5 mobile:w-full">
          <div className="h-72 w-[30vh] mobile:w-full mobile:h-40">
            {totalTopsComponent}
          </div>
          <div className="h-72 w-[30vh] mobile:w-full">{bestDecks}</div>
        </div>
        <div className="w-[60%] mobile:w-full">{tops}</div>
      </div>
    </div>
  );
};

export default Dashboard;
