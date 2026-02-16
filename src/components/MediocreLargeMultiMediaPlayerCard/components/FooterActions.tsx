import { useContext } from "preact/hooks";
import { css } from "@emotion/react";
import { IconButton } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig, MediocreMultiMediaPlayerCardConfig } from "@types";
import { NavigationRoute } from "@components/MediocreLargeMultiMediaPlayerCard";
import { theme } from "@constants";
import { useActionProps, useCanDisplayQueue } from "@hooks";
import { memo } from "preact/compat";
import { getHasMediaBrowser, getHasSearch, isDarkMode } from "@utils";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

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
  footerInCard: css({
    "--mmpc-surface-higher": `hsl(from ${theme.colors.card} h s calc(l ${isDarkMode() ? "+" : "-"} 5))`,
    "--mmpc-surface-shadow": `hsl(from var(--mmpc-surface-higher) h calc(s / 2) calc(l - 10))`,
    "--ha-card-border-width": "0px",
    backgroundColor: "var(--mmpc-surface-higher)",
    boxShadow: "0px 0px 20px var(--mmpc-surface-shadow)",
  }),
};

export type FooterActionsProps = {
  setNavigationRoute: (route: NavigationRoute) => void;
  navigationRoute: NavigationRoute;
  desktopMode?: boolean;
};

export const FooterActions = memo<FooterActionsProps>(
  ({ setNavigationRoute, navigationRoute, desktopMode }) => {
    const { rootElement, config } =
      useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
        CardContext
      );
    const { selectedPlayer } = useSelectedPlayer();

    const {
      entity_id,
      ma_entity_id,
      search,
      custom_buttons,
      media_browser,
      lms_entity_id,
    } = selectedPlayer!;

    const hasSearch = getHasSearch(search, ma_entity_id);
    const hasMediaBrowser = getHasMediaBrowser(media_browser);
    const hasQueue = useCanDisplayQueue({ ma_entity_id, lms_entity_id });

    if (config.size && config.size !== "large") return null;

    return (
      <div
        css={[styles.root, config.mode === "in-card" && styles.footerInCard]}
      >
        {!desktopMode && (
          <IconButton
            size="small"
            icon={"mdi:home"}
            onClick={() => setNavigationRoute("massive")}
            selected={navigationRoute === "massive"}
          />
        )}
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
