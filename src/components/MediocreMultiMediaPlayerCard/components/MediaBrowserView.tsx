import type { MediocreMultiMediaPlayer } from "@types";
import { MediaBrowser } from "@components";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useIntl } from "@components/i18n";
import { memo } from "preact/compat";
import { getHasMediaBrowserEntryArray } from "@utils";

const styles = {
  root: css({
    height: "100%",
    overflowY: "auto",
  }),
  header: css({
    padding: "12px 16px 12px 16px",
  }),
};

export type MediaBrowserViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const MediaBrowserView = memo<MediaBrowserViewProps>(
  ({ mediaPlayer: { entity_id, media_browser, lms_entity_id }, height }) => {
    const { t } = useIntl();
    const renderHeader = () => (
      <ViewHeader
        title={t({
          id: "MediocreMultiMediaPlayerCard.MediaBrowserView.browse_media_title",
        })}
        css={styles.header}
      />
    );

    return (
      <div css={styles.root} style={{ maxHeight: height }}>
        <MediaBrowser
          mediaBrowserEntryArray={getHasMediaBrowserEntryArray(
            media_browser,
            entity_id
          )}
          lmsEntityId={lms_entity_id}
          horizontalPadding={16}
          renderHeader={renderHeader}
          maxHeight={height}
        />
      </div>
    );
  }
);
