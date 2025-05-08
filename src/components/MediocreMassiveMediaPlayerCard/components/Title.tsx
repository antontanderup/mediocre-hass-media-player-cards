import { usePlayer } from "@components";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
    color: "var(--primary-text-color, #fff)",
    paddingLeft: "var(--mmpc-extra-horizontal-padding, 0px)",
    paddingRight: "var(--mmpc-extra-horizontal-padding, 0px)",
    "> h2, > h3": {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      width: "100%",
    },
  }),
  titleH2: css({
    margin: 0,
  }),
  titleH3: css({
    margin: 0,
    fontWeight: "normal",
    color: "var(--secondary-text-color, #fff)",
  }),
};

export const Title = () => {
  const { title, subtitle } = usePlayer();

  return (
    <div css={styles.root}>
      {!!title && <h2 css={styles.titleH2}>{title}</h2>}
      {!!subtitle && <h3 css={styles.titleH3}>{subtitle}</h3>}
    </div>
  );
};
