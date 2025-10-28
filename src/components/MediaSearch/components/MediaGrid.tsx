import { css } from "@emotion/react";
import { ComponentChildren } from "preact";

export type MediaGridProps = {
  numberOfColumns?: number;
  children: ComponentChildren;
};

const styles = {
  root: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gridGap: "8px",
    padding: "0px var(--mmpc-search-padding, 0px)",
  }),
};

export const MediaGrid = ({
  numberOfColumns = 3,
  children,
}: MediaGridProps) => {
  return (
    <div
      css={styles.root}
      style={{
        gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};
