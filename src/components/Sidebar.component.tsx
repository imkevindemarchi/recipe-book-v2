import { FC, ReactNode, useContext } from "react";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

// Api
import { AUTH_API } from "../api";

// Assets
import logoImg from "../assets/images/logo.png";
import { ADMIN_ROUTES, TRoute, ROUTES } from "../routes";

// Components
import IconButton from "./IconButton.component";
import LanguageSelector from "./LanguageSelector.component";

// Contexts
import { ThemeContext } from "../providers";
import { SidebarContext, TSidebarContext } from "../providers/sidebar.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { AuthContext, TAuthContext } from "../providers/auth.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { SunIcon, MoonIcon, LogoutIcon, LoginIcon } from "../assets/icons";

// Types
import { TThemeContext } from "../providers/theme.provider";
import { THTTPResponse } from "../types";

// Utils
import { removeFromStorage, setToStorage } from "../utils";

interface IProps {
  isAdminSection: boolean;
}

const Sidebar: FC<IProps> = ({ isAdminSection }) => {
  const navigate: NavigateFunction = useNavigate();
  const { isDarkMode, onStateChange: onThemeChange }: TThemeContext =
    useContext(ThemeContext) as TThemeContext;
  const { isOpen, onStateChange: onSidebarStateChange }: TSidebarContext =
    useContext(SidebarContext) as TSidebarContext;
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { setIsUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { pathname } = useLocation();

  const currentPaths: string[] = pathname.split("/");
  const currentPathSection: string = currentPaths[isAdminSection ? 2 : 1];
  const routes: TRoute[] = isAdminSection ? ADMIN_ROUTES : ROUTES;

  function goToHome(): void {
    navigate(isAdminSection ? "/admin" : "/");
    onSidebarStateChange();
  }

  function onLanguageChange(countryCode: string): void {
    changeLanguage(countryCode);
    setToStorage("language", countryCode);
  }
  async function onLogout() {
    setIsLoading(true);

    await Promise.resolve(AUTH_API.logout()).then((response: THTTPResponse) => {
      if (response.hasSuccess) {
        navigate("/log-in");
        removeFromStorage("token");
        setIsUserAuthenticated(false);
      } else openPopup(t("logoutError"), "error");
    });
    onSidebarStateChange();

    setIsLoading(false);
  }

  const logo: ReactNode = (
    <img
      src={logoImg}
      alt={t("imgNotFound")}
      className="w-32"
      onClick={goToHome}
    />
  );

  const routesComponent: ReactNode = (
    <div className="flex flex-col justify-center items-center">
      {routes.map((route: TRoute, index: number) => {
        const isRouteHidden: boolean = route.isHidden ? true : false;
        const routePathSection: string =
          route.path.split("/")[isAdminSection ? 2 : 1];
        const isRouteActive: boolean = routePathSection === currentPathSection;

        return (
          !isRouteHidden && (
            <Link
              to={route.path}
              onClick={!isRouteActive ? () => onSidebarStateChange() : () => {}}
              key={index}
              className={`px-4 py-2 rounded-lg w-full flex justify-center ${
                isRouteActive ? "bg-primary" : "bg-none"
              } 
              ${
                isRouteActive
                  ? "hover:cursor-default pointer-events-none"
                  : "hover:bg-primary-transparent"
              }`}
            >
              <span
                className={`uppercase text-2xl font-bold ${
                  isRouteActive ? "text-white" : "text-primary"
                }`}
              >
                {t(route.name)}
              </span>
            </Link>
          )
        );
      })}
    </div>
  );

  const loginIcon: ReactNode = (
    <LoginIcon
      onClick={() => {
        navigate("/admin");
        onSidebarStateChange();
      }}
      className="text-primary text-2xl cursor-pointer hover:opacity-50 transition-all duration-300"
    />
  );

  const languageSelector: ReactNode = (
    <LanguageSelector
      value={language}
      onChange={onLanguageChange}
      isDarkMode={isDarkMode}
    />
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

  const logoutIcon: ReactNode = (
    <LogoutIcon
      onClick={onLogout}
      className="text-primary text-2xl cursor-pointer hover:opacity-50 transition-all duration-300"
    />
  );

  return (
    <div
      className={`fixed left-0 w-full h-full flex justify-center items-center flex-col gap-10 desktop:hidden transition-all duration-300
        ${isDarkMode ? "bg-black" : "bg-white"}
        ${isOpen ? "top-0 opacity-100" : "top-[-100%] opacity-0"}
      `}
      style={{ zIndex: "900" }}
    >
      {logo}
      {routesComponent}
      {languageSelector}
      <div className="flex gap-5 items-center">
        {themeIcon}
        {isAdminSection && logoutIcon}
        {!isAdminSection && loginIcon}
      </div>
    </div>
  );
};

export default Sidebar;
