import type { MediocreMultiMediaPlayer } from "@types";
import { MediaBrowser } from "@components";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useTranslation } from "react-i18next";
import { memo } from "preact/compat";

const styles = {
  root: css({
    height: "100%",
    overflowY: "auto",
  }),
  header: css({
    padding: 16,
    paddingBottom: 0,
  }),
};

export type MediaBrowserViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const MediaBrowserView = memo<MediaBrowserViewProps>(
  ({ mediaPlayer: { entity_id, media_browser }, height }) => {
    const { t } = useTranslation();
    const renderHeader = () => (
      <ViewHeader
        title={t(
          "MediocreMultiMediaPlayerCard.MediaBrowserView.browse_media_title"
        )}
        css={styles.header}
      />
    );

    return (
      <div css={styles.root} style={{ maxHeight: height }}>
        <MediaBrowser
          entity_id={media_browser?.entity_id ?? entity_id}
          horizontalPadding={16}
          renderHeader={renderHeader}
          maxHeight={height}
        />
      </div>
    );
  }
);
