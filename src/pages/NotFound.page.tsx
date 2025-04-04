import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Components
import { Button } from "../components";

// Utils
import { setPageTitle } from "../utils";

const NotFound: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  setPageTitle("404");

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="flex flex-col text-center justify-center items-center mobile:w-[90%]">
        <span className="text-[4em] text-primary font-bold">404</span>
        <span className="text-xl text-primary">{t("pageNotFound")}</span>
        <span className="text-xl text-primary-transparent">
          {t("linkMightBeCorrupted")}
        </span>
        <span>{t("pageCouldBeRemoved")}</span>
        <div className="w-full py-5 flex justify-center">
          <Button width="100%" onClick={() => navigate("/")}>
            <span className="whitespace-nowrap text-white">
              {t("goBackToHome")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
