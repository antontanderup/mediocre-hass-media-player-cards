import { ButtonHTMLAttributes } from "preact/compat";
import styled from "@emotion/styled";
import { Icon } from "../Icon";
import { keyframes } from "@emotion/react";

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ChipButton = styled.button<{ $loading?: boolean }>`
  position: relative;
  background: none;
  border: none;
  display: flex;
  flex: 0;
  flex-direction: row;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  line-height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  margin-right: 5px;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  cursor: pointer;
  opacity: ${props => (props.$loading ? 0.3 : 0.8)};
  ha-icon {
    pointer-events: none;
    animation: ${spinAnimation} 1s linear infinite;
    ${props => (!props.$loading ? "animation: none;" : "")}
  }
`;

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
};

export const Chip = ({
  loading,
  icon,
  iconPosition = "left",
  children,
  ...buttonProps
}: ChipProps) => {
  const renderIcon = () => {
    if (loading) {
      return <Icon size="x-small" icon="mdi:loading" />;
    }
    if (!!icon) {
      return <Icon size="x-small" icon={icon} />;
    }
  };

  return (
    <ChipButton $loading={loading} {...buttonProps}>
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </ChipButton>
  );
};
