import type { ButtonHTMLAttributes } from "react";

export type IconName = "copy" | "edit" | "save" | "info" | "link" | "cross";
export type IconColor = "green" | "white" | "red";

export type IconButtonProps = {
  iconName: IconName;
  color?: IconColor;
  onClick: () => void;
  isDisabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;
