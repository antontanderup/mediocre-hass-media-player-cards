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
    rowGap: 12,
    "*, *:before, *:after": {
      boxSizing: "border-box",
    },
  }),
  rootDesktop: css({
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr auto", // Make first row stretch, second row auto-sized for footer
    gridTemplateAreas: `
      "massive content"
      "massive footer"
    `,
    columnGap: 12,
  }),
  rootPanel: css({
    height: "100%",
    padding: 12,
    maxHeight: "calc(100vh - 24px - var(--header-height, 16px))",
    // Below is needed because panel mode enforces 0px border radius for some reason
    "--ha-card-border-radius": `max(${theme.sizes.cardBorderRadius}, 12px)`,
    "*": {
      "--ha-card-border-radius": "inherit !important",
    },
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
    marginBottom: 0,
    borderWidth: "var(--ha-card-border-width, 1px)",
    borderColor: "var(--ha-card-border-color,var(--divider-color,#e0e0e0))",
    borderStyle: "var(--ha-card-border-style, solid)",
  }),
  contentAreaDesktop: css({
    gridArea: "content",
  }),
  contentAreaDesktopMassive: css({
    gridArea: "massive",
  }),
  contentAreaCard: css({
    borderRadius: theme.sizes.cardBorderRadius,
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
    gap: 12,
    display: "flex",
    flexDirection: "column",
  }),
  footerDesktop: css({
    gridArea: "footer",
  }),
  footerCard: css({
    padding: 0,
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

  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute>(
    config.options?.default_tab ?? "massive"
  );

  const [cardSizeRef, { height: cardHeight, width: cardWidth }] =
    useMeasure<HTMLDivElement>();
  const [contentSizeRef, { height: contentHeight }] =
    useMeasure<HTMLDivElement>();

  const desktopMode = cardWidth ? cardWidth > 800 : false;

  useEffect(() => {
    if (desktopMode && navigationRoute === "massive") {
      setNavigationRoute(config.options?.default_tab ?? "speaker-grouping");
    }
  }, [desktopMode]);

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
              desktopMode && styles.rootDesktop,
            ]}
            style={config.height ? { height: config.height } : {}}
            ref={cardSizeRef}
            onClick={handleCardClick}
          >
            {desktopMode ? (
              <div
                css={[
                  styles.contentArea,
                  styles.contentAreaDesktopMassive,
                  config.mode === "card" && styles.contentAreaCard,
                  config.options?.transparent_background_on_home &&
                    styles.contentAreaMassiveTransparent,
                  config.mode === "panel" &&
                    config.options?.transparent_background_on_home &&
                    styles.contentAreaMassiveTransparent,
                ]}
                ref={contentSizeRef}
              >
                <MassiveViewView
                  mediaPlayer={selectedPlayer}
                  setNavigationRoute={setNavigationRoute}
                  navigationRoute={navigationRoute}
                />
              </div>
            ) : null}
            <div
              css={[
                styles.contentArea,
                desktopMode && styles.contentAreaDesktop,
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
              {navigationRoute === "massive" && (
                <MassiveViewView
                  mediaPlayer={selectedPlayer}
                  setNavigationRoute={setNavigationRoute}
                  navigationRoute={navigationRoute}
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
              css={[
                styles.footer,
                desktopMode && styles.footerDesktop,
                config.mode === "card" && styles.footerCard,
              ]}
            >
              {!desktopMode &&
                navigationRoute !== "massive" &&
                cardHeight &&
                cardHeight > 500 && (
                  <MiniPlayer
                    mediaPlayer={selectedPlayer}
                    setNavigationRoute={setNavigationRoute}
                    navigationRoute={navigationRoute}
                  />
                )}
              <FooterActions
                mediaPlayer={selectedPlayer}
                setNavigationRoute={setNavigationRoute}
                navigationRoute={navigationRoute}
                desktopMode={desktopMode}
              />
            </div>
          </ArtworkColorWrap>
        )}
      </Fragment>
    </PlayerContextProvider>
  );
};
