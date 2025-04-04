import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

// Icons
import { ArrowRight } from "../assets/icons/arrow-right.icon";

interface IProps {
  isDarkMode: boolean;
}

const Breadcrumb: FC<IProps> = ({ isDarkMode }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const splittedPathname = pathname.split("/").slice(2);
  const hasEdit: boolean = splittedPathname.find(
    (path: string) => path === "edit"
  )
    ? true
    : false;
  hasEdit && splittedPathname.pop();

  let paths: string[] = pathname.split("/");
  paths.pop();
  hasEdit && paths.pop();

  const previousPage: string = paths.join("/");

  return (
    <div className="flex flex-row gap-3 items-center">
      {splittedPathname.map((path: string, index: number) => {
        const isLastElement: boolean = index === splittedPathname.length - 1;

        return isLastElement ? (
          <span key={index} className="text-primary">
            {t(path)}
          </span>
        ) : (
          <div key={index} className="flex flex-row items-center gap-3">
            <Link
              to={previousPage}
              className={`transition-all duration-300 ${
                isDarkMode
                  ? "text-white hover:underline cursor-pointer"
                  : "hover:underline cursor-pointer text-black"
              }`}
            >
              {t(path)}
            </Link>
            <ArrowRight
              className={`transition-all duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
