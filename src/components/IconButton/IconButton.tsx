import { ButtonHTMLAttributes } from "preact/compat";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export type ButtonSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  hasLongPress?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
};

const longPressIndicator = keyframes`
  0% {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }
  90% {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }

  100% {
    background-color: var(--primary-color, rgba(7, 114, 244));
  }
`;

const Button = styled.button<{
  $disabled: boolean;
  $size: ButtonSize;
  $hasLongPress: boolean;
}>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  padding: ${(props) => (props.$size === "xx-small" ? 0 : 4)}px;
  min-width: ${(props) => getButtonSize(props.$size)}px;
  aspect-ratio: 1;
  color: ${(props) =>
    props.disabled
      ? "var(--disabled-text-color, #999)"
      : "var(--primary-text-color, #333)"};

  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }

  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
    animation-name: ${longPressIndicator};
    animation-duration: 2.3s;
    animation-fill-mode: forwards;
    ${(props) => (!props.$hasLongPress ? "animation: none;" : "")}
  }
  > ha-icon {
    --mdc-icon-size: ${(props) => getButtonSize(props.$size)}px;
    width: ${(props) => getButtonSize(props.$size)}px;
    display: flex;
    pointer-events: none;
  }
`;

export const IconButton = ({
  icon,
  size = "medium",
  disabled = false,
  hasLongPress = false,
  className,
  ...buttonProps
}: IconButtonProps) => {
  const width = getButtonSize(size);
  return (
    <Button
      disabled={disabled}
      $disabled={disabled}
      $size={size}
      $hasLongPress={hasLongPress}
      className={className}
      {...buttonProps}
    >
      <ha-icon icon={icon} />
    </Button>
  );
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
    case "x-large":
      return 80;
    case "xx-large":
      return 120;
  }
};
