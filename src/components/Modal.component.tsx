import React, { FC, ReactNode } from "react";

// Components
import Backdrop from "./Backdrop.component";
import IconButton from "./IconButton.component";

// Icons
import { CloseIcon } from "../assets/icons";
import Button from "./Button.component";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit?: () => void;
  submitBtnText?: string;
  isDarkMode: boolean;
  children: ReactNode;
  onCancel?: () => void;
  cancelBtnText?: string;
}

const Modal: FC<IProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitBtnText,
  isDarkMode,
  onCancel,
  cancelBtnText,
  children,
}) => {
  const header: ReactNode = (
    <div className="w-full flex justify-between items-center">
      <span
        className={`transition-all duration-300 text-2xl font-bold ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {title}
      </span>
      <IconButton small onClick={onClose}>
        <CloseIcon className="text-3xl text-primary" />
      </IconButton>
    </div>
  );

  const footer: ReactNode = (
    <div className="flex justify-end">
      <div className="flex flex-row items-center gap-5">
        {onCancel && (
          <Button
            onClick={onCancel}
            styleType="secondaryRound"
            isDarkMode={isDarkMode}
          >
            <span className="text-primary">{cancelBtnText}</span>
          </Button>
        )}
        {onSubmit && (
          <Button onClick={onSubmit} styleType="round" isDarkMode={isDarkMode}>
            <span
              className={`transition-all duration-300 ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              {submitBtnText}
            </span>
          </Button>
        )}
      </div>
    </div>
  );

  return isOpen ? (
    <Backdrop isDarkMode={isDarkMode}>
      <div
        className={`rounded-3xl absolute p-5 w-[30%] flex flex-col gap-5 transition-all duration-300 mobile:w-[95%] ${
          isDarkMode ? "bg-black" : "bg-white"
        } `}
      >
        {header}
        {children}
        {footer}
      </div>
    </Backdrop>
  ) : null;
};

export default Modal;
