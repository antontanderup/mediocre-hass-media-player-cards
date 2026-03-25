import { CardContext, CardContextType, MediaBrowser } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getHasMediaBrowser, getHasMediaBrowserEntryArray } from "@utils";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";
import { useContext } from "preact/hooks";
import { MediocreMultiMediaPlayerCardConfig } from "@types";

const styles = {
  root: css({
    maxHeight: 300,
    paddingBottom: 12,
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    overflowY: "auto",
  }),
};

export const MediaBrowserBar = () => {
  const {
    selectedPlayer: { media_browser, entity_id, lms_entity_id, ma_entity_id } = {},
  } = useSelectedPlayer();

  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  if (getHasMediaBrowser(media_browser, ma_entity_id) === false) {
    return null;
  }

  return (
    <div css={styles.root}>
      <MediaBrowser
        mediaBrowserEntryArray={getHasMediaBrowserEntryArray(
          media_browser,
          entity_id ?? "",
          ma_entity_id
        )}
        maEntityId={ma_entity_id}
        useExperimentalLmsMediaBrowser={
          config?.options?.use_experimental_lms_media_browser ?? false
        }
        lmsEntityId={lms_entity_id}
        horizontalPadding={12}
      />
    </div>
  );
};
