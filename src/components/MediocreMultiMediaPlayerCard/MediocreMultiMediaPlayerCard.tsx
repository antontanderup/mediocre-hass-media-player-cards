import { CardContext, CardContextType } from "@components/CardContext";
import {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "preact/hooks";
import { selectActiveMultiMediaPlayer } from "@utils/selectActiveMultiMediaPlayer";
import {
  ArtworkColorWrap,
  MediaBrowserView,
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
import { AdditionalActionsView } from "./components/AdditionalActionsView";
import { QueueView } from "./components/QueueView";

export type NavigationRoute =
  | "search"
  | "media-browser"
  | "massive"
  | "speaker-grouping"
  | "custom-buttons"
  | "queue"
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
    borderWidth: "var(--ha-card-border-width, 1px)",
    borderColor: "var(--ha-card-border-color,var(--divider-color,#e0e0e0))",
    borderStyle: "var(--ha-card-border-style, solid)",
  }),
  contentAreaCard: css({
    margin: "0 0 12px 0",
    borderRadius: "var(--ha-card-border-radius, 12px)",
  }),
  contentAreaMassiveTransparent: css({
    backgroundColor: "transparent",
    borderStyle: "none",
  }),
  contentAreaPannelMassiveTransparent: css({
    margin: "12px 8px 12px 8px",
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

  const lastInteractionRef = useRef<number | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<
    MediocreMultiMediaPlayer | undefined
  >(() => selectActiveMultiMediaPlayer(hass, config));

  // Update selectedPlayer when hass or config changes, unless card was interacted with in last 2 minutes
  useEffect(() => {
    const now = Date.now();
    if (
      lastInteractionRef.current &&
      now - lastInteractionRef.current < 2 * 60 * 1000
    ) {
      return;
    }
    const newSelectedPlayer = selectActiveMultiMediaPlayer(
      hass,
      config,
      selectedPlayer
    );
    if (newSelectedPlayer?.entity_id !== selectedPlayer?.entity_id) {
      setSelectedPlayer(newSelectedPlayer);
    }
  }, [hass, config, selectedPlayer]);

  const [navigationRoute, setNavigationRoute] =
    useState<NavigationRoute>("massive");

  const [cardSizeRef, { height: cardHeight }] = useMeasure<HTMLDivElement>();
  const [contentSizeRef, { height: contentHeight }] =
    useMeasure<HTMLDivElement>();

  const handleCardClick = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

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
            ref={cardSizeRef}
            onClick={handleCardClick}
          >
            <div
              css={[
                styles.contentArea,
                config.mode === "card" && styles.contentAreaCard,
                navigationRoute === "massive" &&
                  config.options?.transparent_background_on_home &&
                  styles.contentAreaMassiveTransparent,
                navigationRoute === "massive" &&
                  config.mode === "panel" &&
                  config.options?.transparent_background_on_home &&
                  styles.contentAreaMassiveTransparent,
              ]}
              ref={contentSizeRef}
            >
              {navigationRoute === "search" && contentHeight && (
                <SearchView
                  height={contentHeight}
                  mediaPlayer={selectedPlayer}
                />
              )}
              {navigationRoute === "media-browser" && contentHeight && (
                <MediaBrowserView
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
              {navigationRoute === "queue" && contentHeight && (
                <QueueView
                  mediaPlayer={selectedPlayer}
                  height={contentHeight}
                />
              )}
              {navigationRoute === "massive" && contentHeight && (
                <MassiveViewView
                  mediaPlayer={selectedPlayer}
                  height={contentHeight}
                />
              )}
              {navigationRoute === "custom-buttons" && (
                <AdditionalActionsView
                  mediaPlayer={selectedPlayer}
                  setSelectedPlayer={setSelectedPlayer}
                />
              )}
            </div>
            <div
              css={[styles.footer, config.mode === "card" && styles.footerCard]}
            >
              {navigationRoute !== "massive" &&
                cardHeight &&
                cardHeight > 500 && <MiniPlayer mediaPlayer={selectedPlayer} />}
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
