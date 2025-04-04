import { FC, MouseEventHandler } from "react";

interface IProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: any;
  small?: boolean;
  big?: boolean;
}

const IconButton: FC<IProps> = ({ onClick, small, big, children }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full desktop:hover:opacity-50 bg-primary-transparent transition-all duration-300 ${
        small ? "p-2" : big ? "p-4" : "p-3"
      }`}
    >
      {children}
    </button>
  );
};

export default IconButton;
