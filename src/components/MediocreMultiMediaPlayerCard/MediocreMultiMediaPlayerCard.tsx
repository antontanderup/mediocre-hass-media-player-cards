import { CardContext, CardContextType } from "@components/CardContext";
import {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { useContext, useMemo, useState } from "preact/hooks";
import { MiniPlayer, SearchView, SpeakerGrouping } from "./components";
import { Fragment } from "preact/jsx-runtime";
import { useMeasure } from "@uidotdev/usehooks";
import { css } from "@emotion/react";
import { FooterActions } from "./components/FooterActions";
import { PlayerContextProvider } from "@components/PlayerContext";
import { useHass } from "@components/HassContext";
import { theme } from "@constants";

export type NavigationRoute =
  | "search"
  | "speaker-grouping"
  | "speaker-overview";

const styles = {
  root: css({
    display: "grid",
    height: "100%",
    maxHeight: "calc(100vh - var(--header-height, 16px))", // This is for panel mode TODO: add config to make a fixed height if not on panel
    minHeight: 0,
    gridTemplateRows: "1fr auto",
    gridTemplateColumns: "1fr",
    "* > *": {
      boxSizing: "border-box",
    },
  }),
  contentArea: css({
    alignSelf: "stretch",
    overflow: "hidden",
    minHeight: 0,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    margin: 12,
    marginBottom: 0,
  }),
  footer: css({
    alignSelf: "end",
    padding: 12,
    gap: 12,
    display: "flex",
    flexDirection: "column",
    "--ha-card-border-radius": "max(var(--ha-card-border-radius, 12px), 12px)",
  }),
};

export const MediocreMultiMediaPlayerCard = () => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const hass = useHass();

  const [selectedPlayer, setSelectedPlayer] = useState<
    MediocreMultiMediaPlayer | undefined
  >(() => {
    return config.media_players.find(
      player => player.entity_id === config.entity_id
    );
  });

  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute>(
    () => {
      if (selectedPlayer?.ma_entity_id || selectedPlayer?.search?.enabled) {
        return "search";
      }
      return "speaker-overview";
    }
  );

  const [contentSizeRef, { height: contentHeight }] =
    useMeasure<HTMLDivElement>();

  return (
    <PlayerContextProvider
      hass={hass}
      entityId={selectedPlayer?.entity_id || config.entity_id}
    >
      <Fragment>
        {!selectedPlayer ? (
          <div>Please select a media player in the configuration.</div>
        ) : (
          <div css={styles.root}>
            <div css={styles.contentArea} ref={contentSizeRef}>
              {navigationRoute === "search" && contentHeight && (
                <SearchView
                  height={contentHeight}
                  mediaPlayer={selectedPlayer}
                />
              )}
              {navigationRoute === "speaker-grouping" && (
                <SpeakerGrouping
                  mediaPlayer={selectedPlayer}
                  setSelectedPlayer={setSelectedPlayer}
                />
              )}
            </div>
            <div css={styles.footer}>
              <MiniPlayer mediaPlayer={selectedPlayer} />
              <FooterActions
                mediaPlayer={selectedPlayer}
                setNavigationRoute={setNavigationRoute}
                navigationRoute={navigationRoute}
              />
            </div>
          </div>
        )}
      </Fragment>
    </PlayerContextProvider>
  );
};
