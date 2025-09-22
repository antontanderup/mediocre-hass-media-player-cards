import { useContext } from "preact/hooks";
import { css } from "@emotion/react";
import { IconButton } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import {
  InteractionConfig,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { NavigationRoute } from "@components/MediocreMultiMediaPlayerCard";
import { theme } from "@constants";
import { useActionProps } from "@hooks";

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
  navigationRoute,
}: FooterActionsProps) => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const { entity_id, ma_entity_id, search, custom_buttons } = mediaPlayer;

  const { speaker_group } = config;

  const hasMaSearch = ma_entity_id && ma_entity_id.length > 0;
  const hasSearch = hasMaSearch || search?.enabled;

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
      {!!speaker_group && (
        <IconButton
          size="small"
          icon={"mdi:speaker-multiple"}
          onClick={() => setNavigationRoute("speaker-grouping")}
          selected={navigationRoute === "speaker-grouping"}
        />
      )}
    </div>
  );
};

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
