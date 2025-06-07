import { Title, Track } from "./components";
import { PlaybackControls } from "./components/PlaybackControls";
import { PlayerActions } from "./components/PlayerActions";
import { useContext } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import {
  InteractionConfig,
  MediocreMassiveMediaPlayerCardConfig,
} from "@types";
import { useActionProps, useArtworkColors } from "@hooks";
import { AlbumArt } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  root: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "--mmpc-extra-horizontal-padding": "0px",
    boxSizing: "border-box",
    "*": {
      boxSizing: "border-box",
    },
    "--mmpc-surface-higher": theme.colors.card,
  }),
  rootPanelMode: css({
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(var(--app-header-background-color), rgba(255, 255, 255, 0))", // Gradient transitions from panel header color to transparent
    maxHeight: "calc(100vh - var(--header-height, 16px))",
  }),
  rootPopupMode: css({
    "--mmpc-extra-horizontal-padding": "12px",
  }),
  wrap: css({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: "16px",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: "16px",
    paddingBottom: "16px",
    height: "100%",
  }),
  wrapPanelMode: css({
    width: "90%",
    maxWidth: "400px",
    padding: "16px",
  }),
  wrapPopupMode: css({
    maxWidth: "100%",
    padding: "16px",
    paddingBottom: "max(calc(env(safe-area-inset-bottom) + 8px), 16px)",
  }),
  wrapCardMode: css({
    width: "100%",
    padding: "16px",
  }),
  controlsWrapper: css({
    display: "flex",
    flexDirection: "column",
    maxHeight: "300px",
    minHeight: "280px",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  }),
};

export const MediocreMassiveMediaPlayerCard = ({
  className,
}: {
  className?: string;
}) => {
  const { config, rootElement } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const { mode, use_art_colors, action } = config;

  const { artVars, haVars } = useArtworkColors();

  const artAction: InteractionConfig = action ?? {
    tap_action: { action: "more-info" },
  };

  const artActionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...artAction,
      entity: config.entity_id,
    },
  });

  const renderRoot = () => (
    <div
      className={className}
      css={[
        styles.root,
        mode === "panel" && styles.rootPanelMode,
        mode === "popup" && styles.rootPopupMode,
      ]}
      style={{
        ...(artVars ?? {}),
        ...(haVars && use_art_colors ? haVars : {}),
      }}
    >
      <div
        css={[
          styles.wrap,
          mode === "panel" && styles.wrapPanelMode,
          mode === "card" && styles.wrapCardMode,
          mode === "popup" && styles.wrapPopupMode,
        ]}
      >
        <AlbumArt iconSize="x-large" borderRadius={8} {...artActionProps} />
        <div css={styles.controlsWrapper}>
          <Title />
          <Track />
          <PlaybackControls />
          <PlayerActions />
        </div>
      </div>
    </div>
  );

  if (mode === "card") {
    return <ha-card>{renderRoot()}</ha-card>;
  }
  return renderRoot();
};
