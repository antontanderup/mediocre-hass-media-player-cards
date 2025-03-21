import styled from "@emotion/styled";

export type ProgressBarProps = {
  min: number;
  max: number;
  value: number;
};

const Root = styled.div`
  display: flex;
  flex-direction: row;
  height: 4px;
  width: 100%;
  background-color: var(--secondary-background-color);
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--primary-text-color);
  width: 0%;
  transition: width 1s linear;
`;

export const ProgressBar = ({ min, max, value }: ProgressBarProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <Root>
      <Progress style={{ width: `${percentage}%` }} />
    </Root>
  );
};
