import React, { FC, useContext } from "react";

// Contexts
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { CheckIcon, CloseIcon, ErrorIcon, WarningIcon } from "../assets/icons";

const Popup: FC = () => {
  const { state, onClose }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { message, isOpen, type } = state;

  const isSuccess: boolean = type === "success";
  const isError: boolean = type === "error";
  const isWarning: boolean = type === "warning";

  return (
    <div
      className={`fixed top-32 px-5 py-2 rounded-lg min-w-60 justify-between items-center mobile:top-20 text-white gap-20 mobile:gap-5 transition-all duration-300 flex mobile:max-w-[90%]
        ${
          isSuccess ? "bg-green" : isError ? "bg-red" : isWarning && "bg-orange"
        }
        ${isOpen ? "right-5 opacity-100" : "-right-96 opacity-0"}  
      `}
    >
      <div className="flex gap-2 mobile:gap-5 items-center">
        {isSuccess && <CheckIcon className="text-2xl" />}
        {isWarning && <WarningIcon className="text-2xl" />}
        {isError && <ErrorIcon className="text-2xl" />}
        <span className="text-base">{message}</span>
      </div>
      <CloseIcon
        className="text-2xl text-white cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};

export default Popup;
