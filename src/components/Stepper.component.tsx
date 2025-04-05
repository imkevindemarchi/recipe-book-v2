import React, { FC, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import Card from "./Card.component";
import ProgressBar from "./ProgressBar.component";
import { ArrowLeft } from "../assets/icons/arrow-left.icon";
import { ArrowRight } from "../assets/icons/arrow-right.icon";

interface IProps {
  steps: string[];
  isDarkMode: boolean;
}

const Stepper: FC<IProps> = ({ steps, isDarkMode }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(1);

  function calculateProgress(): number {
    return (currentStep / steps?.length) * 100;
  }

  function onStepHandler(step: number): void {
    setCurrentStep(step);
  }

  const progressBar: ReactNode = (
    <div className="flex items-center gap-5">
      <ProgressBar progress={calculateProgress()} />
      <span
        className={`transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {`${currentStep}/${steps?.length}`}
      </span>
    </div>
  );

  return steps && steps.length > 0 ? (
    <Card
      isDarkMode={isDarkMode}
      visibleBackground
      className="flex flex-col gap-5"
    >
      {progressBar}
      <span
        className={`transition-all duration-300 font-bold ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("stepN", { step: currentStep })}
      </span>
      <span
        className={`transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {steps[currentStep - 1]}
      </span>
      <div className="w-full flex justify-between">
        <div
          onClick={() => currentStep > 1 && onStepHandler(currentStep - 1)}
          className={`flex items-center gap-2 underline transition-all duration-300 ${
            currentStep > 1
              ? "text-primary cursor-pointer hover:opacity-50 mobile:hover:opacity-100"
              : isDarkMode
              ? "text-gray cursor-not-allowed"
              : "text-darkgray2 cursor-not-allowed"
          }`}
        >
          <ArrowLeft className="mobile:text-3xl" />
          <span className="mobile:hidden">{t("previousStep")}</span>
        </div>
        {currentStep < steps.length && (
          <div
            onClick={() => onStepHandler(currentStep + 1)}
            className="flex items-center gap-2 underline transition-all duration-300 text-primary cursor-pointer hover:opacity-50 mobile:hover:opacity-100"
          >
            <span className="mobile:hidden">{t("nextStep")}</span>
            <ArrowRight className="mobile:text-3xl" />
          </div>
        )}
      </div>
    </Card>
  ) : null;
};

export default Stepper;
