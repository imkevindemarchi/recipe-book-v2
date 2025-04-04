import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";

// Assets
import logoImg from "../assets/images/logo.png";

// Components
import Backdrop from "./Backdrop.component";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";

interface IProps {
  isDarkMode: boolean;
}

const Loader: FC<IProps> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const { state: isLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;

  return isLoading ? (
    <Backdrop isDarkMode={isDarkMode} hideBackground>
      <img
        src={logoImg}
        alt={t("imgNotFound")}
        className="w-60 mobile:w-40"
        style={{ animation: "animateLogo  linear 1s infinite alternate" }}
      />
    </Backdrop>
  ) : (
    <></>
  );
};

export default Loader;
