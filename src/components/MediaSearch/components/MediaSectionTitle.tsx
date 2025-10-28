import { Icon } from "@components/Icon";
import { css } from "@emotion/react";

export type MediaSectionTitleProps = {
  children: string;
  onClick?: () => void;
};

const styles = {
  root: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    margin: "0 4px",
    padding: "4px var(--mmpc-search-padding, 0px)",
  }),
  title: css({
    fontSize: "16px",
    fontWeight: 500,
    color: "var(--primary-text-color)",
    margin: 0,
  }),
};

export const MediaSectionTitle = ({
  children,
  onClick,
}: MediaSectionTitleProps) => {
  return (
    <div css={styles.root} onClick={onClick}>
      <h3 css={styles.title}>{children}</h3>
      {!!onClick && <Icon icon="mdi:chevron-right" size={"small"} />}
    </div>
  );
};
