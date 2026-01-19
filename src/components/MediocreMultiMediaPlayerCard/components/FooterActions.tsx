import { useContext, useMemo } from "preact/hooks";
import { css } from "@emotion/react";
import { IconButton, usePlayer } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import {
  InteractionConfig,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { NavigationRoute } from "@components/MediocreMultiMediaPlayerCard";
import { theme } from "@constants";
import { useActionProps } from "@hooks";
import { memo } from "preact/compat";
import {
  getCanDisplayLmsQueue,
  getHasMediaBrowser,
  getHass,
  getHasSearch,
  getIsLmsPlayer,
} from "@utils";

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
    borderWidth: "var(--ha-card-border-width, 1px)",
    borderColor: "var(--ha-card-border-color,var(--divider-color,#e0e0e0))",
    borderStyle: "var(--ha-card-border-style, solid)",
  }),
};

export type FooterActionsProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  setNavigationRoute: (route: NavigationRoute) => void;
  navigationRoute: NavigationRoute;
};

export const FooterActions = memo<FooterActionsProps>(
  ({ mediaPlayer, setNavigationRoute, navigationRoute }) => {
    const { rootElement } =
      useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
        CardContext
      );

    const {
      entity_id,
      ma_entity_id,
      search,
      custom_buttons,
      media_browser,
      lms_entity_id,
    } = mediaPlayer;

    const hasSearch = getHasSearch(search, ma_entity_id);
    const hasMediaBrowser = getHasMediaBrowser(media_browser);
    const player = usePlayer();
    const hasQueue = useMemo(
      () =>
        lms_entity_id &&
        getIsLmsPlayer(player, lms_entity_id) &&
        getCanDisplayLmsQueue(),
      [player, lms_entity_id]
    );

    return (
      <div css={styles.root}>
        <IconButton
          size="small"
          icon={"mdi:home"}
          onClick={() => setNavigationRoute("massive")}
          selected={navigationRoute === "massive"}
        />
        {hasSearch && (
          <IconButton
            size="small"
            icon={"mdi:magnify"}
            onClick={() => setNavigationRoute("search")}
            selected={navigationRoute === "search"}
          />
        )}
        {hasMediaBrowser && (
          <IconButton
            size="small"
            icon={"mdi:folder-music"}
            onClick={() => setNavigationRoute("media-browser")}
            selected={navigationRoute === "media-browser"}
          />
        )}
        {hasQueue && (
          <IconButton
            size="small"
            icon={"mdi:playlist-music"}
            onClick={() => setNavigationRoute("queue")}
            selected={navigationRoute === "queue"}
          />
        )}
        {custom_buttons && custom_buttons.length === 1 && !ma_entity_id ? (
          <CustomButton
            button={custom_buttons[0]}
            rootElement={rootElement}
            entityId={entity_id}
          />
        ) : (custom_buttons && custom_buttons.length > 1) || ma_entity_id ? (
          <IconButton
            size="small"
            icon={"mdi:dots-horizontal"}
            onClick={() => setNavigationRoute("custom-buttons")}
            selected={navigationRoute === "custom-buttons"}
          />
        ) : null}
        <IconButton
          size="small"
          icon={"mdi:speaker-multiple"}
          onClick={() => setNavigationRoute("speaker-grouping")}
          selected={navigationRoute === "speaker-grouping"}
        />
      </div>
    );
  }
);

const CustomButton = ({
  button,
  rootElement,
  entityId,
}: {
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
  rootElement: HTMLElement;
  entityId: string;
}) => {
  const { icon: _icon, name: _name, ...actionConfig } = button;
  const actionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: entityId,
    },
  });

  return (
    <IconButton
      icon={button.icon ?? "mdi:dots-vertical"}
      size={"small"}
      {...actionProps}
    />
  );
};
