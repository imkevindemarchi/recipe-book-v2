import React, { ChangeEvent, FC, MouseEvent, ReactNode, useRef } from "react";

// Components
import IconButton from "./IconButton.component";

// Icons
import { ImageIcon } from "../assets/icons";

interface IProps {
  file: File | null;
  onChange: (image: File) => void;
  errorMessage?: string;
}

const ImageSelector: FC<IProps> = ({ file, onChange, errorMessage }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const files: FileList | null = event.target.files;
    files && files.length > 0 && onChange(files[0]);
  }

  function onIconButtonClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  }

  const iconButton: ReactNode = (
    <IconButton onClick={onIconButtonClick} big>
      <ImageIcon className="text-primary text-xl" />
    </IconButton>
  );

  const fileName: ReactNode = file ? (
    <span className="text-primary">{file?.name}</span>
  ) : (
    <></>
  );

  const input: ReactNode = (
    <input
      ref={hiddenFileInput}
      type="file"
      id="file-upload"
      onChange={onInputChange}
      accept="image/png, image/gif, image/jpeg, image/jpg"
    />
  );

  const error: ReactNode = errorMessage ? (
    <span className="text-red">{errorMessage}</span>
  ) : (
    <></>
  );

  return (
    <div className="flex flex-row items-center gap-2">
      {iconButton}
      {fileName}
      {input}
      {error}
    </div>
  );
};

export default ImageSelector;
