import { createContext, JSX, ReactNode, useState } from "react";

interface IProps {
  children: ReactNode;
}

type IType = "success" | "error" | "warning";

type IState = {
  message: string | null;
  type: IType | null;
  isOpen: boolean;
};

export type TPopupContext = {
  state: IState;
  onStateChange: (newState: IState) => void;
  onClose: () => void;
  onOpen: (message: string, type: IType) => void;
};

export const PopupContext = createContext<TPopupContext | null>(null);

export const PopupProvider = ({ children }: IProps): JSX.Element => {
  const [state, setState] = useState<IState>({
    message: null,
    type: null,
    isOpen: false,
  });

  function onStateChange(newState: IState): void {
    setState(newState);
  }

  function onClose(): void {
    setState((prevState: IState) => {
      return { ...prevState, isOpen: false };
    });

    setTimeout(() => {
      setState((prevState: IState) => {
        return { ...prevState, message: null, type: null };
      });
    }, 1000);
  }

  function onOpen(message: string, type: IType) {
    const newState: IState = { isOpen: true, message, type };

    setState(newState);

    setTimeout(() => {
      onClose();
    }, 3000);
  }

  return (
    <PopupContext.Provider value={{ state, onStateChange, onClose, onOpen }}>
      {children}
    </PopupContext.Provider>
  );
};
