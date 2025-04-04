import { FC, FormEvent, ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Api
import { AUTH_API } from "../api";

// Assets
import logoImg from "../assets/images/logo.png";

// Components
import { Input, Button, IconButton } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";
import { AuthContext, TAuthContext } from "../providers/auth.provider";

// Icons
import {
  ClosedEyeIcon,
  EmailIcon,
  LockIcon,
  MoonIcon,
  OpenedEyeIcon,
  SunIcon,
} from "../assets/icons";

// Types
import { THTTPResponse } from "../types";

// Utils
import { validateEmail, setPageTitle, setToStorage } from "../utils";

interface IFormData {
  email: string | null;
  password: string | null;
}

const initialState: IFormData = {
  email: null,
  password: null,
};

type TPassword = "text" | "password";

const Login: FC = () => {
  const [formData, setFormData] = useState<IFormData>(initialState);
  const [passwordType, setPasswordType] = useState<TPassword>("password");
  const { t } = useTranslation();
  const { isDarkMode, onStateChange: onThemeChange }: TThemeContext =
    useContext(ThemeContext) as TThemeContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const navigate: NavigateFunction = useNavigate();
  const { setIsUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;

  const isBtnDisabled: boolean =
    !isValid(formData?.email as string) ||
    !isValid(formData?.password as string);

  setPageTitle("Log In");

  const onInputChange = (propLabel: string, value: string): void => {
    setFormData((prevState) => {
      return { ...prevState, [propLabel]: value };
    });
  };

  const onPasswordTypeChange = (): void => {
    switch (passwordType) {
      case "password": {
        setPasswordType("text");
        break;
      }
      case "text": {
        setPasswordType("password");
        break;
      }
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    const email: string = formData?.email as string;
    const password: string = formData?.password as string;
    event.preventDefault();
    setIsLoading(true);

    try {
      const isEmailValid: boolean = validateEmail(email);
      if (isEmailValid) {
        await Promise.resolve(AUTH_API.login(email, password)).then(
          (response: THTTPResponse) => {
            if (response.hasSuccess) {
              navigate("/admin");
              setToStorage("token", response.data?.access_token);
              setIsUserAuthenticated(true);
            } else openPopup(t("loginError"), "error");
          }
        );
      } else openPopup(t("invalidEmail"), "warning");
    } catch (error) {
      console.error("🚀 ~ error:", error);
      openPopup(t("loginError"), "error");
    }

    setIsLoading(false);
  }

  function isValid(value: string): boolean {
    if (value && value?.trim() !== "") return true;
    else return false;
  }

  const logo: ReactNode = (
    <img src={logoImg} alt={t("imgNotFound")} className="w-40" />
  );

  const form: ReactNode = (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 mobile:w-full">
      <Input
        value={formData?.email}
        onChange={(value: string) => onInputChange("email", value)}
        icon={<EmailIcon className="text-primary text-2xl" />}
        placeholder={t("email")}
        isDarkMode={isDarkMode}
      />
      <Input
        type={passwordType}
        value={formData?.password}
        onChange={(value: string) => onInputChange("password", value)}
        icon={<LockIcon className="text-primary text-2xl" />}
        endIcon={
          passwordType === "password" ? (
            <OpenedEyeIcon
              onClick={onPasswordTypeChange}
              className="text-gray text-2xl cursor-pointer"
            />
          ) : (
            <ClosedEyeIcon
              onClick={onPasswordTypeChange}
              className="text-gray text-2xl cursor-pointer"
            />
          )
        }
        placeholder={t("password")}
        isDarkMode={isDarkMode}
      />
      <Button
        type="submit"
        disabled={isBtnDisabled}
        isDarkMode={isDarkMode}
        width="100%"
      >
        <span
          className={`text-lg transition-all duration-300 ${
            isBtnDisabled && isDarkMode
              ? "text-darkgray2"
              : isBtnDisabled
              ? "text-gray"
              : "text-white"
          }`}
        >
          {t("login")}
        </span>
      </Button>
    </form>
  );

  const themeIcon: ReactNode = (
    <IconButton onClick={onThemeChange}>
      {isDarkMode ? (
        <MoonIcon className="text-primary text-2xl" />
      ) : (
        <SunIcon className="text-primary text-2xl" />
      )}
    </IconButton>
  );

  const firstContainer: ReactNode = (
    <div className="w-[65%] mobile:w-[90%] h-full flex justify-center items-center flex-col gap-10">
      {logo}
      {themeIcon}
      {form}
    </div>
  );

  const secondContainer: ReactNode = (
    <div className="w-[35%] mobile:hidden h-full flex justify-center items-center transition-all duration-300 bg-primary">
      <span className="text-white font-bold text-[4em]">
        {process.env.REACT_APP_WEBSITE_NAME}
      </span>
    </div>
  );

  return (
    <div className="w-full h-[100vh] mobile:h-[80vh] flex mobile:justify-center">
      {firstContainer}
      {secondContainer}
    </div>
  );
};

export default Login;
