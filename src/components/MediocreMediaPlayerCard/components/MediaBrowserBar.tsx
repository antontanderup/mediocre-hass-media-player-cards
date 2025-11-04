import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediaBrowser } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  root: css({
    maxHeight: 300,
    paddingBottom: 12,
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    overflowY: "auto",
  }),
};

export const MediaBrowserBar = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { media_browser, entity_id } = config;

  if (!media_browser?.enabled) {
    return null;
  }

  return (
    <div css={styles.root}>
      <MediaBrowser
        entity_id={media_browser.entity_id ?? entity_id}
        horizontalPadding={12}
      />
    </div>
  );
};
