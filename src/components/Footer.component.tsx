import React, { FC, ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

// Assets
import logoImg from "../assets/images/logo.png";
import { TRoute, ROUTES } from "../routes";

// Icons
import { EmailIcon, LocationIcon } from "../assets/icons";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";

type TColumn = { showLogo?: boolean; title: string; children: ReactNode };

const Footer: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { pathname } = useLocation();

  const currentPaths: string[] = pathname.split("/");
  const currentPathSection: string = currentPaths[1];
  const copyrightText: string = `@ ${process.env.REACT_APP_YEAR} - ${process.env.REACT_APP_WEBSITE_NAME}, made by
            Kevin De Marchi - All rights reserved`;

  const Column = ({ showLogo, title, children }: TColumn) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 mobile:gap-3">
          {showLogo && (
            <img
              src={logoImg}
              alt={t("imgNotFound")}
              className="w-16 mobile:w-10"
            />
          )}
          <span
            className={`transition-all duration-300 text-2xl font-bold uppercase ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {title}
          </span>
        </div>

        {children}
      </div>
    );
  };

  const informations: ReactNode = (
    <Column showLogo title={process.env.REACT_APP_WEBSITE_NAME as string}>
      <a
        href={`mailto: ${process.env.REACT_APP_EMAIL}`}
        className={`transition-all duration-300 flex flex-row items-center text-base gap-1 ${
          isDarkMode ? "text-white" : "text-black"
        } hover:text-primary`}
      >
        <EmailIcon className="text-2xl" />
        <span>{process.env.REACT_APP_EMAIL}</span>
      </a>
      <div
        className={`transition-all duration-300 flex flex-row items-center text-base gap-1 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <LocationIcon className="text-2xl" />
        <span>{process.env.REACT_APP_COUNTRY}</span>
      </div>
    </Column>
  );

  const links: ReactNode = (
    <Column title={t("links")}>
      <div className="flex justify-center flex-col items-center mobile:justify-start mobile:items-start">
        <Link
          to="/"
          className={`transition-all duration-300 p-1 rounded-full flex justify-center mobile:justify-start px-5 max-w-min ${
            isDarkMode ? "text-white" : "text-black"
          } ${
            pathname === "/"
              ? "bg-primary hover:cursor-default pointer-events-none text-white"
              : "bg-none hover:text-primary"
          }`}
        >
          {t("home")}
        </Link>
        {ROUTES.map((route: TRoute, index: number) => {
          const isRouteVisible: boolean = route.isHidden ? true : false;
          const routePathSection: string = route.path.split("/")[1];
          const isRouteActive: boolean =
            routePathSection === currentPathSection;

          return (
            !isRouteVisible && (
              <Link
                key={index}
                to={route.path}
                className={`transition-all duration-300 hover:text-primary p-1 rounded-full flex justify-center mobile:justify-start px-5 max-w-min ${
                  isDarkMode ? "text-white" : "text-black"
                } ${
                  isRouteActive
                    ? "bg-primary hover:cursor-default pointer-events-none text-white"
                    : "bg-none hover:text-primary"
                }`}
              >
                {t(route.name)}
              </Link>
            )
          );
        })}
      </div>
    </Column>
  );

  const copyright: ReactNode = (
    <span
      className={`transition-all duration-300 mobile:text-center text-sm ${
        isDarkMode ? "text-darkgray2" : "text-gray"
      }`}
    >
      {copyrightText}
    </span>
  );

  return (
    <div className="absolute bottom-0 w-full py-20 px-40 mobile:px-5 flex flex-col gap-10">
      <div className="flex justify-between mobile:flex-col mobile:gap-10">
        {informations}
        {links}
      </div>
      {copyright}
    </div>
  );
};

export default Footer;
