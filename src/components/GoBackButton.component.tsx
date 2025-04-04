import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Icons
import { ArrowLeftIcon } from "../assets/icons";

const GoBackButton: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary underline transition-all duration-300 hover:opacity-50"
      >
        <ArrowLeftIcon />
        <span>{t("goBack")}</span>
      </button>
    </div>
  );
};

export default GoBackButton;
