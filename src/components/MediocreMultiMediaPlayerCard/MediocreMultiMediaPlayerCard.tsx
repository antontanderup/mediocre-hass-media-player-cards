import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMultiMediaPlayer, MediocreMultiMediaPlayerCardConfig } from "@types";
import { useContext, useMemo, useState } from "preact/hooks";
import { MiniPlayer, SearchView } from "./components";
import { Fragment } from "preact/jsx-runtime";
import { useMeasure } from "@uidotdev/usehooks";

export type NavigationRoutes = "search" | "speaker-grouping" | "speaker-overview"

const styles = {
  root: {
    display: "grid",
    height: "100%",
    maxHeight: "calc(100vh - var(--header-height, 16px))", // This is for panel mode
    minHeight: 0,
    gridTemplateRows: "1fr auto",
    gridTemplateColumns: "1fr",
  },
  contentArea: {
    alignSelf: "stretch",
    overflow: "auto",
    minHeight: 0,
  },
  footer: {
    alignSelf: "end",
  }
}

export const MediocreMultiMediaPlayerCard = () => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<
    number | undefined
  >(undefined);

  const selectedPlayer: MediocreMultiMediaPlayer | undefined = useMemo(() => {
    if (selectedPlayerIndex === undefined) {
      const player = config.media_players.find(
        (player) => player.entity_id === config.entity_id
      );
      return player;
    }
    return config.media_players[selectedPlayerIndex];
  }, [config, selectedPlayerIndex]);

  const [navigationRoute, setNavigationRoute] = useState<NavigationRoutes | undefined>(() => {
    if (selectedPlayer?.ma_entity_id || selectedPlayer?.search?.enabled) {
      return "search";
    }
    return "speaker-overview";
  });

  const [contentSizeRef, { height: contentHeight }] = useMeasure<HTMLDivElement>();
  console.log({contentHeight});
  return (
    <Fragment>
      {!selectedPlayer ? (
        <div>Please select a media player in the configuration.</div>
      ) : (
        <div css={styles.root}>
          <div css={styles.contentArea} ref={contentSizeRef}>
            {navigationRoute === "search" && contentHeight && <SearchView height={contentHeight} mediaPlayer={selectedPlayer} />}
          </div>
          <div css={styles.footer}>
            <MiniPlayer mediaPlayer={selectedPlayer} />
          </div>
        </div>
      )}
    </Fragment>
  );
};
