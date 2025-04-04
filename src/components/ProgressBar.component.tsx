import React, { FC } from "react";

interface IProps {
  progress: number;
}

const ProgressBar: FC<IProps> = ({ progress }) => {
  return (
    <div className="w-[300px] h-4 bg-gray rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
