import { css } from "@emotion/react";

export type ProgressBarProps = {
  min: number;
  max: number;
  value: number;
};

const styles = {
  root: css({
    display: "flex",
    flexDirection: "row",
    height: "4px",
    width: "100%",
    backgroundColor: "var(--divider-color)",
    borderRadius: "2px",
    overflow: "hidden",
  }),
  progress: css({
    height: "100%",
    backgroundColor: "var(--secondary-text-color)",
    width: "0%",
    transition: "width 1s linear",
  }),
};

export const ProgressBar = ({ min, max, value }: ProgressBarProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div css={styles.root}>
      <div css={styles.progress} style={{ width: `${percentage}%` }} />
    </div>
  );
};
