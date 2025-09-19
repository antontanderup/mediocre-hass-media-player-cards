import { useContext } from "preact/hooks";
import { css, keyframes } from "@emotion/react";
import { IconButton, usePlayer } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import {
  InteractionConfig,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { NavigationRoute } from "../MediocreMultiMediaPlayerCard";
import { theme } from "@constants";
import { useActionProps } from "@hooks";

const slideUpFadeIn = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

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
  const { rootElement, config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const {
    entity_id,
    ma_entity_id,
    search,
    custom_buttons,
  } = mediaPlayer;

  const { speaker_group } = config;

  const hasMaSearch = ma_entity_id && ma_entity_id.length > 0;
  const hasSearch = hasMaSearch || search?.enabled;

  return (
    <div css={styles.root}>
      <IconButton
        size="small"
        icon={"mdi:home"}
        onClick={() => setNavigationRoute("massive")}
      />
      {hasSearch && (
        <IconButton
          size="small"
          icon={"mdi:magnify"}
          onClick={() => setNavigationRoute("search")}
        />
      )}
      {custom_buttons && custom_buttons.length === 1 ? (
        <CustomButton
          button={custom_buttons[0]}
          rootElement={rootElement}
          entityId={entity_id}
        />
      ) : custom_buttons && custom_buttons.length > 1 ? (
        <IconButton
          size="small"
          icon={"mdi:dots-horizontal"}
          onClick={() => setNavigationRoute("custom-buttons")}
        />
      ) : null}
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
