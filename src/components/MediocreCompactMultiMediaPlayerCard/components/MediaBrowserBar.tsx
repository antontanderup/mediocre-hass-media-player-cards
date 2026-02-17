import { MediaBrowser } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getHasMediaBrowser, getHasMediaBrowserEntryArray } from "@utils";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  root: css({
    maxHeight: 300,
    paddingBottom: 12,
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    overflowY: "auto",
  }),
};

export const MediaBrowserBar = () => {
  const { selectedPlayer: { media_browser, entity_id, lms_entity_id } = {} } =
    useSelectedPlayer();

  if (getHasMediaBrowser(media_browser) === false) {
    return null;
  }

  return (
    <div css={styles.root}>
      <MediaBrowser
        mediaBrowserEntryArray={getHasMediaBrowserEntryArray(
          media_browser,
          entity_id ?? ""
        )}
        lmsEntityId={lms_entity_id}
        horizontalPadding={12}
      />
    </div>
  );
};
