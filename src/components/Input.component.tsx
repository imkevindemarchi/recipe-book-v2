import { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from "react";

// Spinner
import { ClipLoader as Spinner } from "react-spinners";

interface IProps {
  autofocus?: boolean;
  value: string | number | null;
  onChange: (value: string) => void;
  icon?: ReactNode;
  endIcon?: ReactNode;
  placeholder: string;
  type?: "text" | "password" | "number";
  isDarkMode?: boolean;
  onSearch?: () => Promise<void>;
  width?: string;
  errorMessage?: string;
}

const Input: FC<IProps> = ({
  autofocus,
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
  type = "text",
  isDarkMode,
  onSearch,
  width,
  errorMessage,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [isValueChanged, setIsValueChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const error: ReactNode = errorMessage ? (
    <span className="text-red">{errorMessage}</span>
  ) : (
    <></>
  );

  function onBorderColorChange(): void {
    if (inputRef.current) {
      inputRef.current.style.borderColor = errorMessage
        ? "#ff0000"
        : autofocus
        ? (process.env.REACT_APP_PRIMARY_COLOR as string)
        : isDarkMode
        ? "#4d4d4d"
        : "#ececec";
    }
  }

  useEffect(() => {
    const timeOut: NodeJS.Timeout = setTimeout(async () => {
      if (isValueChanged && onSearch) {
        await onSearch();
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeOut);

    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    onBorderColorChange();

    // eslint-disable-next-line
  }, [isDarkMode, errorMessage]);

  return (
    <div className="flex flex-col gap-2 mobile:w-full">
      <div
        ref={inputRef}
        className="rounded-full border-2 px-5 py-3 transition-all duration-300 flex items-center justify-between w-96 overflow-hidde mobile:w-full"
        style={{ width }}
      >
        <div className="flex gap-2 items-center w-full">
          {icon}
          <input
            autoFocus={autofocus}
            type={type}
            value={value || ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange(event.target.value);
              if (onSearch) {
                setIsValueChanged(true);
                setIsLoading(true);
              }
            }}
            onFocus={() => {
              if (inputRef.current) {
                inputRef.current.style.borderColor = process.env
                  .REACT_APP_PRIMARY_COLOR as string;
              }
            }}
            onBlur={() => onBorderColorChange()}
            placeholder={placeholder}
            style={{ backgroundColor: "transparent" }}
            className={`border-none outline-none text-base w-full ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          />
        </div>
        {endIcon}
        {isLoading && (
          <Spinner
            size={20}
            color={process.env.REACT_APP_PRIMARY_COLOR}
            className="ml-2"
          />
        )}
      </div>
      {error}
    </div>
  );
};

export default Input;
