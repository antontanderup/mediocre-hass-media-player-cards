import { useContext } from "preact/hooks";
import { css } from "@emotion/react";
import { IconButton, usePlayer } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { NavigationRoute } from "../MediocreMultiMediaPlayerCard";
import { theme } from "@constants";

const styles = {
  root: css({
    backgroundColor: theme.colors.card,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "12px",
    padding: "12px",
    width: "100%",
    position: "relative",
    boxSizing: "border-box",
    boxShadow: "0 15px 100px var(--clear-background-color)",
  }),
};

export type FooterActionsProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  setNavigationRoute: (route: NavigationRoute) => void;
  navigationRoute: NavigationRoute;
};

export const FooterActions = ({
  mediaPlayer,
  setNavigationRoute,
}: FooterActionsProps) => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const { entity_id, ma_entity_id, search, ma_favorite_button_entity_id } =
    mediaPlayer;

  const { speaker_group } = config;

  const { state } = usePlayer();

  // Determine if the player is on
  const isOn = state !== "off" && state !== "unavailable";

  const hasMaSearch = ma_entity_id && ma_entity_id.length > 0;
  const hasSearch = hasMaSearch || search?.enabled;

  return (
    <div css={styles.root}>
      {hasSearch && (
        <IconButton
          size="small"
          icon={"mdi:magnify"}
          onClick={() => setNavigationRoute("search")}
        />
      )}
      {!!speaker_group && (
        <IconButton
          size="small"
          icon={"mdi:speaker-multiple"}
          onClick={() => setNavigationRoute("speaker-grouping")}
        />
      )}
    </div>
  );
};
