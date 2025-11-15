// 1. Updated import path from '@components' to relative '../'
import IconButton from "../icon-button/IconButton";
import type { DeleteButtonProps } from "./types";
import "./DeleteButton.scss";

const DeleteButton = ({ onClick, isDisabled = false }: DeleteButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="delete-button">
      <IconButton
        iconName="cross"
        color="red"
        onClick={handleClick}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default DeleteButton;
