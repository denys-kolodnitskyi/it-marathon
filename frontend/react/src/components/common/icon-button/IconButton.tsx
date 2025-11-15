import type { IconButtonProps } from "./types";
import { ICONS_PATH } from "./utils";
import "./IconButton.scss";

const IconButton = ({
  iconName,
  color = "green",
  onClick,
  isDisabled = false,
  ...restProps
}: IconButtonProps) => {
  return (
    <button
      className={`icon-button icon-button--${color}`}
      onClick={onClick}
      type="button"
      disabled={isDisabled}
      {...restProps}
    >
      <svg className="icon-button__icon">
        <use href={`${ICONS_PATH}${iconName}`} />
      </svg>
    </button>
  );
};

export default IconButton;
