import { FC, MouseEventHandler } from "react";

interface IProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
  isDarkMode: boolean;
}

const Hamburger: FC<IProps> = ({ onClick, isActive, isDarkMode }: IProps) => {
  const lines: number[] = [1, 2, 3];

  return (
    <button
      onClick={onClick}
      className="desktop:hidden flex flex-col top-7 left-7 justify-around w-10 h-10 fixed z-[999]"
    >
      {lines.map((line: number) => (
        <div
          key={line}
          style={{ transformOrigin: "1px" }}
          className={`w-10 h-1 relative rounded-sm first:rotate-0 even:opacity-1 even:translate-x-0 last:rotate-0 transition-all duration-300
            ${!isActive && (isDarkMode ? "bg-white" : "bg-black")}
            ${
              isActive &&
              "bg-primary first:rotate-45 even:opacity-0 even:translate-x-20 last:rotate-[-45deg]"
            }
            `}
        />
      ))}
    </button>
  );
};

export default Hamburger;
