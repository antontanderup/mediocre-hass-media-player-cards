import { CardContext, CardContextType, MediaBrowser } from "@components";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useIntl } from "@components/i18n";
import { memo, useContext } from "preact/compat";
import { getHasMediaBrowserEntryArray } from "@utils";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";
import { MediocreMultiMediaPlayerCardConfig } from "@types";

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
  height: number;
};

export const MediaBrowserView = memo<MediaBrowserViewProps>(({ height }) => {
  const { t } = useIntl();
  const { selectedPlayer } = useSelectedPlayer();
  const { entity_id, media_browser, lms_entity_id } = selectedPlayer!;
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const configuredTitle = config?.options?.media_browser_view_title?.trim();
  const renderHeader = () => (
    <ViewHeader
      title={
        configuredTitle ||
        t({
          id: "MediocreMultiMediaPlayerCard.MediaBrowserView.browse_media_title",
        })
      }
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
        useExperimentalLmsMediaBrowser={
          config?.options?.use_experimental_lms_media_browser ?? false
        }
        lmsEntityId={lms_entity_id}
        horizontalPadding={16}
        renderHeader={renderHeader}
        maxHeight={height}
      />
    </div>
  );
});
