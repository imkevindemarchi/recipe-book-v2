import React, { FC, useState } from "react";

// Icons
import { ArrowUpIcon } from "../assets/icons";

interface IProps {
  isDarkMode: boolean;
}

const BackToTopButton: FC<IProps> = ({ isDarkMode }) => {
  const [state, setState] = useState(false);

  function checkScroll() {
    if (!state && window.pageYOffset > 20) setState(true);
    else if (state && window.pageYOffset <= 20) setState(false);
  }

  window.addEventListener("scroll", checkScroll);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        opacity: state ? ".8" : "0",
        zIndex: state ? "900" : "-900",
      }}
      className={`border-none outline-none p-3 rounded-lg fixed bottom-7 right-7 mobile:bottom-4 mobile:right-4 bg-primary
  `}
    >
      <ArrowUpIcon
        className={`transition-all duration-300 text-3xl ${
          isDarkMode ? "text-black" : "text-white"
        }`}
      />
    </button>
  );
};

export default BackToTopButton;
