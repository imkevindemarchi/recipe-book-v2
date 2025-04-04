import { createContext, JSX, ReactNode, useState } from "react";

// Utils
import { getFromStorage, setToStorage } from "../utils";

interface IProps {
  children: ReactNode;
}

export type TThemeContext = {
  isDarkMode: boolean;
  onStateChange: () => void;
};

type TTheme = "light" | "dark";

export const ThemeContext = createContext<TThemeContext | null>(null);

export const ThemeProvider = ({ children }: IProps): JSX.Element => {
  const [state, setState] = useState<TTheme>(
    getFromStorage("theme") || "light"
  );

  const isDarkMode: boolean = state === "dark";

  function onStateChange(): void {
    const newState: TTheme = state === "light" ? "dark" : "light";
    setState(newState);
    setToStorage("theme", newState);
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, onStateChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
