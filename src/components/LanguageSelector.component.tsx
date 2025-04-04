import React, { FC, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";

// Hooks
import { useClickOutside } from "../hooks";

interface IProps {
  value: string;
  onChange: (countryCode: string) => void;
  isDarkMode: boolean;
}

type ILanguage = {
  id: string;
  label: string;
};

const LANGUAGES: ILanguage[] = [
  { id: "it", label: "italian" },
  { id: "en", label: "english" },
];

const LanguageSelector: FC<IProps> = ({ value, isDarkMode, onChange }) => {
  const [state, setState] = useState<boolean>(false);
  const ref: any | null = useRef(null);
  const {
    t,
    i18n: { language: currentLanguage },
  } = useTranslation();

  const elabValue: string = value === "en" ? "gb" : value;

  useClickOutside(ref, () => setState(false));

  return (
    <div ref={ref} className="relative">
      <ReactCountryFlag
        countryCode={elabValue}
        svg
        style={{
          width: "1.5em",
          height: "1.5em",
        }}
        className="cursor-pointer"
        onClick={() => setState(!state)}
      />
      <div
        className={`absolute top-0 transition-all duration-300 opacity-0 pointer-events-none rounded-lg ${
          state && "top-10 opacity-100 pointer-events-auto"
        } ${isDarkMode ? "bg-darkgray" : "bg-lightgray"}`}
        style={{
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        <div className="flex flex-col w-40 justify-center items-center py-3">
          {LANGUAGES.map((language: ILanguage, index: number) => {
            const isSelectedLanguage: boolean = language.id === currentLanguage;
            const countryCode: string =
              language.id === "en" ? "gb" : language.id;

            return (
              <button
                key={index}
                onClick={() => onChange(language.id)}
                className={`flex items-center gap-2 py-2 px-5 rounded-lg ${
                  isSelectedLanguage
                    ? "bg-gray cursor-auto"
                    : isDarkMode
                    ? "hover:bg-black cursor-pointer"
                    : "hover:bg-white cursor-pointer"
                }`}
              >
                <ReactCountryFlag
                  countryCode={countryCode}
                  svg
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                  }}
                />
                <span
                  className={`text-sm ${
                    isDarkMode && isSelectedLanguage
                      ? "text-black"
                      : isDarkMode
                      ? "text-white"
                      : isSelectedLanguage
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {t(language.label)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
