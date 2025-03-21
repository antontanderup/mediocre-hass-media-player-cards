import { ButtonHTMLAttributes } from "preact/compat";
import styled from "@emotion/styled";

const ChipButton = styled.button<{ $loading?: boolean }>`
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
  opacity: ${(props) => (props.$loading ? 0.3 : 0.8)};
`;

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const Chip = ({ loading, ...buttonProps }: ChipProps) => {
  return <ChipButton $loading={loading} {...buttonProps} />;
};
