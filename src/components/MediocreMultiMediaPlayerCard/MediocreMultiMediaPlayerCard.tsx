import { CardContext, CardContextType } from "@components/CardContext";
import {
  MediaPlayerEntity,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { useContext, useState } from "preact/hooks";
import {
  ArtworkColorWrap,
  MiniPlayer,
  SearchView,
  SpeakerGrouping,
} from "./components";
import { Fragment } from "preact/jsx-runtime";
import { useMeasure } from "@uidotdev/usehooks";
import { css } from "@emotion/react";
import { FooterActions } from "./components/FooterActions";
import { PlayerContextProvider } from "@components/PlayerContext";
import { useHass } from "@components/HassContext";
import { theme } from "@constants";
import { MassiveViewView } from "./components/MassiveView";
import { CustomButtonsView } from "./components/CustomButtonsView";

export type NavigationRoute =
  | "search"
  | "massive"
  | "speaker-grouping"
  | "custom-buttons"
  | "speaker-overview";

const styles = {
  root: css({
    display: "grid",
    minHeight: 0,
    gridTemplateRows: "1fr auto",
    gridTemplateColumns: "1fr",
    "*, *:before, *:after": {
      boxSizing: "border-box",
    },
  }),
  rootPanel: css({
    height: "100%",
    maxHeight: "calc(100vh - var(--header-height, 16px))", // This is for panel mode TODO: add config to make a fixed height if not on panel
  }),
  rootCard: css({
    height: 780,
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
  contentAreaCard: css({
    margin: "12px 0",
    borderRadius: "var(--ha-card-border-radius, 12px)",
  }),
  contentAreaPanelMassive: css({
    margin: "0px 8px 12px 8px",
    backgroundColor: "transparent",
    borderRadius: 0,
  }),
  footer: css({
    alignSelf: "end",
    padding: 12,
    gap: 12,
    display: "flex",
    flexDirection: "column",
    "--ha-card-border-radius": "max(var(--ha-card-border-radius, 12px), 12px)",
  }),
  footerCard: css({
    padding: 0,
    "--ha-card-border-radius": "var(--ha-card-border-radius, 12px)",
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
    let player = config.media_players.find(
      player => player.entity_id === config.entity_id
    );

    const playerState = hass.states[player?.entity_id || ""].state;
    if (player && (playerState == "playing" || playerState === "paused")) {
      const groupState =
        hass.states[player?.speaker_group_entity_id || player.entity_id];
      if (groupState.attributes.group_members?.[0] === groupState.entity_id) {
        return player;
      }
    }

    config.media_players.forEach(p => {
      const state = hass.states[p.entity_id] as MediaPlayerEntity;
      if (state.state === "playing" || state.state === "paused") {
        const groupState =
          hass.states[p.speaker_group_entity_id || p.entity_id];
        if (groupState.attributes.group_members?.[0] === groupState.entity_id) {
          player = p;
        }
      }
    });

    return player;
  });

  const [navigationRoute, setNavigationRoute] =
    useState<NavigationRoute>("massive");

  const [contentSizeRef, { height: contentHeight }] =
    useMeasure<HTMLDivElement>();

  return (
    <PlayerContextProvider
      entityId={selectedPlayer?.entity_id || config.entity_id}
    >
      <Fragment>
        {!selectedPlayer ? (
          <div>Please select a media player in the configuration.</div>
        ) : (
          <ArtworkColorWrap
            useArtColors={config.use_art_colors}
            css={[
              styles.root,
              config.mode === "panel" && styles.rootPanel,
              config.mode === "card" && styles.rootCard,
            ]}
            style={config.height ? { height: config.height } : {}}
          >
            <div
              css={[
                styles.contentArea,
                config.mode === "card" && styles.contentAreaCard,
                config.mode === "panel" &&
                  navigationRoute === "massive" &&
                  styles.contentAreaPanelMassive,
              ]}
              ref={contentSizeRef}
            >
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
              {navigationRoute === "massive" && contentHeight && (
                <MassiveViewView
                  mediaPlayer={selectedPlayer}
                  height={contentHeight}
                />
              )}
              {navigationRoute === "custom-buttons" && (
                <CustomButtonsView
                  mediaPlayer={selectedPlayer}
                  setSelectedPlayer={setSelectedPlayer}
                />
              )}
            </div>
            <div
              css={[styles.footer, config.mode === "card" && styles.footerCard]}
            >
              {navigationRoute !== "massive" && (
                <MiniPlayer mediaPlayer={selectedPlayer} />
              )}
              <FooterActions
                mediaPlayer={selectedPlayer}
                setNavigationRoute={setNavigationRoute}
                navigationRoute={navigationRoute}
              />
            </div>
          </ArtworkColorWrap>
        )}
      </Fragment>
    </PlayerContextProvider>
  );
};
