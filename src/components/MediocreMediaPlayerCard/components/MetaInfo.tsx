import { Fragment } from "preact/jsx-runtime";
import { usePlayer } from "@components/PlayerContext";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  titleText: css({
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.colors.onCard,
  }),
  artistText: css({
    margin: 0,
    fontSize: "14px",
    color: theme.colors.onCardMuted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

export const MetaInfo = () => {
  const { title, subtitle } = usePlayer();

  return (
    <Fragment>
      {!!title && <h3 css={styles.titleText}>{title}</h3>}
      {!!subtitle && <p css={styles.artistText}>{subtitle}</p>}
    </Fragment>
  );
};
