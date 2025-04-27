import { ButtonHTMLAttributes, JSX } from "preact/compat";
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
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  renderLongPressIndicator?: () => JSX.Element | null;
};

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Button = styled.button<{
  $disabled: boolean;
  $size: ButtonSize;
  $loading: boolean;
}>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  padding: ${props => (props.$size === "xx-small" ? 0 : 4)}px;
  min-width: ${props => getButtonSize(props.$size)}px;
  aspect-ratio: 1;
  color: ${props =>
    props.disabled
      ? "var(--disabled-text-color, #999)"
      : "var(--primary-text-color, #333)"};

  /* iOS fixes for stuck hover states */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }

  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }

  /* iOS-specific override to ensure hover doesn't get stuck */
  @media (hover: none) {
    &:hover {
      background-color: transparent;
    }
    &:active {
      background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
    }
  }

  > ha-icon {
    --mdc-icon-size: ${props => getButtonSize(props.$size)}px;
    width: ${props => getButtonSize(props.$size)}px;
    display: flex;
    pointer-events: none;
    animation: ${spinAnimation} 1s linear infinite;
    ${props => (!props.$loading ? "animation: none;" : "")};
  }
`;

export const IconButton = ({
  icon,
  size = "medium",
  disabled = false,
  loading = false,
  className,
  renderLongPressIndicator,
  ...buttonProps
}: IconButtonProps) => {
  return (
    <Button
      disabled={disabled}
      $disabled={disabled}
      $size={size}
      $loading={loading}
      className={className}
      {...buttonProps}
    >
      {loading ? <ha-icon icon="mdi:loading" /> : <ha-icon icon={icon} />}
      {renderLongPressIndicator && renderLongPressIndicator()}
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
