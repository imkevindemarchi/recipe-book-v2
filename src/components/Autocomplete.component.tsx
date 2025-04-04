import { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from "react";

// Spinner
import { useClickOutside } from "../hooks";

export type TAutocompleteValue = { id: string | null; label: string | null };

interface IProps {
  value: TAutocompleteValue;
  onChange: (value: TAutocompleteValue) => void;
  icon?: ReactNode;
  endIcon?: ReactNode;
  placeholder: string;
  type?: "text" | "password";
  isDarkMode?: boolean;
  onSearch?: () => Promise<void>;
  width?: string;
  data: TAutocompleteValue[];
  errorMessage?: string;
}

const Autocomplete: FC<IProps> = ({
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
  type = "text",
  isDarkMode,
  width,
  data,
  errorMessage,
}) => {
  const inputRef = useRef<any>(null);
  const [state, setState] = useState<string | null>(value?.label);
  const [dropdown, setDropdown] = useState<boolean>(false);

  const error: ReactNode = errorMessage ? (
    <span className="text-red">{errorMessage}</span>
  ) : (
    <></>
  );

  useClickOutside(inputRef, () => {
    setDropdown(false);
    setState(value?.label);
  });

  const filteredData: TAutocompleteValue[] = data.filter(
    (element: TAutocompleteValue) => {
      return element?.label
        ?.toLowerCase()
        .startsWith(state?.toLowerCase() as string);
    }
  );
  const elabData: TAutocompleteValue[] =
    state && state.trim() !== "" ? filteredData : data;

  function onBorderColorChange(): void {
    if (inputRef.current) {
      inputRef.current.style.borderColor = errorMessage
        ? "#ff0000"
        : isDarkMode
        ? "#4d4d4d"
        : "#ececec";
    }
  }

  useEffect(() => {
    if (value?.label) setState(value?.label);
    else setState(null);
  }, [value]);

  useEffect(() => {
    onBorderColorChange();

    // eslint-disable-next-line
  }, [isDarkMode, errorMessage]);

  return (
    <div className="flex flex-col gap-2 mobile:w-full">
      <div
        ref={inputRef}
        className={`rounded-full border-2 px-5 py-3 transition-all duration-300 flex items-center justify-between w-96 overflow-hidde mobile:w-full relative ${
          isDarkMode
            ? "border-darkgray text-white"
            : "border-lightgray text-black"
        }`}
        style={{ width }}
      >
        <div className="flex gap-2 items-center w-full">
          {icon}
          <input
            type={type}
            value={state || ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setState(event.target.value)
            }
            onFocus={() => {
              setDropdown(true);
              if (inputRef.current) {
                inputRef.current.style.borderColor = process.env
                  .REACT_APP_PRIMARY_COLOR as string;
              }
            }}
            onBlur={() => {
              if (inputRef.current) {
                inputRef.current.style.borderColor = isDarkMode
                  ? "#4d4d4d"
                  : "#ececec";
              }
            }}
            placeholder={placeholder}
            style={{ backgroundColor: "transparent" }}
            className="border-none outline-none text-base w-full"
          />
        </div>
        {endIcon}
        <div
          className={`absolute w-full top-0 transition-all duration-300 opacity-0 pointer-events-none rounded-lg shadow-xl max-h-80 overflow-y-scroll ${
            dropdown && "top-14 opacity-100 pointer-events-auto overflow-hidden"
          } ${isDarkMode ? "bg-darkgray" : "bg-lightgray"}`}
          style={{
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: "900",
          }}
        >
          {elabData.map((element: TAutocompleteValue, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  onChange(element);
                  setDropdown(false);
                }}
                className={`transition-all duration-300 hover:bg-primary-transparent cursor-pointer px-5 py-2 ${
                  isDarkMode ? "border-darkgray3" : "border-gray"
                }`}
              >
                <span className="text-sm">{element.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {error}
    </div>
  );
};

export default Autocomplete;
