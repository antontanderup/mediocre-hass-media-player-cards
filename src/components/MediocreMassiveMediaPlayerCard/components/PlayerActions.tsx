import { useCallback, useContext, useState } from "preact/hooks";
import { css, keyframes } from "@emotion/react";
import {
  HaSearch,
  IconButton,
  MaQueue,
  MaSearch,
  usePlayer,
} from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { Fragment, ReactNode } from "preact/compat";
import { VolumeController, VolumeTrigger } from "./VolumeController";
import { SpeakerGrouping } from "./SpeakerGrouping";
import { useActionProps } from "@hooks";
import {
  MediocreMassiveMediaPlayerCardConfig,
  InteractionConfig,
} from "@types";
import { CustomButtons } from "./CustomButtons";
import { theme } from "@constants";
import { getHass } from "@utils";

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
    backgroundColor: "var(--mmpc-surface-higher)",
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
  modalRoot: css({
    position: "absolute",
    bottom: "calc(100% + 12px)",
    left: 0,
    width: "100%",
    backgroundColor: "var(--mmpc-surface-higher)",
    borderRadius: "12px",
    boxSizing: "border-box",
    animation: `${slideUpFadeIn} 0.3s ease forwards`,
    boxShadow: "0 0px 80px var(--clear-background-color)",
  }),
  modalHeader: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    color: "var(--primary-text-color, #fff)",
    borderBottom: `0.5px solid ${theme.colors.onCardDivider}`,
    "> h4": {
      margin: 0,
    },
  }),
  modalContent: css({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "var(--mmpc-modal-padding, 16px)",
  }),
};

export const PlayerActions = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const {
    entity_id,
    custom_buttons,
    speaker_group,
    ma_entity_id,
    search,
    queue,
    ma_favorite_button_entity_id,
    options: { always_show_power_button: alwaysShowPowerButton } = {},
  } = config;

  const { state } = usePlayer();

  // Determine if the player is on
  const isOn = state !== "off" && state !== "unavailable";

  const hasMaSearch = ma_entity_id && ma_entity_id.length > 0;
  const hasSearch = hasMaSearch || search?.enabled;
  const hasQueue = hasMaSearch && queue?.enabled;

  const [selected, setSelected] = useState<
    "volume" | "speaker-grouping" | "custom-buttons" | "search" | "queue"
  >();

  const toggleSelected = useCallback(
    (key: "volume" | "speaker-grouping" | "custom-buttons") => {
      setSelected(selected === key ? undefined : key);
    },
    [selected]
  );

  const togglePower = useCallback(() => {
    getHass().callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  const handleFavorite = useCallback(() => {
    if (ma_favorite_button_entity_id) {
      getHass().callService("button", "press", {
        entity_id: ma_favorite_button_entity_id,
      });
    }
  }, [ma_favorite_button_entity_id]);

  return (
    <div css={styles.root}>
      <Modal
        title="Volume"
        isOpen={selected === "volume"}
        onClose={() => setSelected(undefined)}
      >
        <VolumeController />
      </Modal>
      <Modal
        title="Speaker Grouping"
        isOpen={selected === "speaker-grouping"}
        onClose={() => setSelected(undefined)}
        padding="16px 0px 16px 0px"
      >
        <SpeakerGrouping />
      </Modal>
      <Modal
        title="Search"
        isOpen={selected === "search"}
        onClose={() => setSelected(undefined)}
        padding="16px 0px 16px 0px"
      >
        {ma_entity_id ? (
          <MaSearch
            maEntityId={ma_entity_id}
            horizontalPadding={16}
            searchBarPosition="bottom"
          />
        ) : (
          <HaSearch
            entityId={search?.entity_id ?? config.entity_id}
            showFavorites={search?.show_favorites ?? false}
            horizontalPadding={16}
            filterConfig={search?.media_types}
            searchBarPosition="bottom"
          />
        )}
      </Modal>
      <Modal
        title="Queue"
        isOpen={selected === "queue"}
        onClose={() => setSelected(undefined)}
        padding="16px 0px 16px 0px"
      >
        {ma_entity_id && (
          <MaQueue entityId={ma_entity_id} horizontalPadding={16} />
        )}
      </Modal>
      {!!speaker_group && (
        <IconButton
          size="small"
          icon={"mdi:speaker-multiple"}
          onClick={() => toggleSelected("speaker-grouping")}
        />
      )}
      {custom_buttons && custom_buttons.length === 1 ? (
        <CustomButton button={custom_buttons[0]} />
      ) : custom_buttons && custom_buttons.length > 1 ? (
        <Fragment>
          <IconButton
            size="small"
            icon={"mdi:dots-horizontal"}
            onClick={() => toggleSelected("custom-buttons")}
          />
          <Modal
            title="Shortcuts"
            isOpen={selected === "custom-buttons"}
            onClose={() => setSelected(undefined)}
            padding="16px 0px 16px 0px"
          >
            <CustomButtons />
          </Modal>
        </Fragment>
      ) : null}

      {ma_favorite_button_entity_id && (
        <IconButton
          size="small"
          icon={"mdi:heart-plus"}
          title="Mark current song as favorite"
          onClick={handleFavorite}
        />
      )}

      {hasSearch && (
        <IconButton
          size="small"
          icon={"mdi:magnify"}
          onClick={() => setSelected("search")}
        />
      )}
      {hasQueue && (
        <IconButton
          size="small"
          icon={"mdi:playlist-music"}
          onClick={() => setSelected("queue")}
        />
      )}
      {(!isOn || alwaysShowPowerButton) && (
        <IconButton size="x-small" onClick={togglePower} icon={"mdi:power"} />
      )}
      <VolumeTrigger onClick={() => toggleSelected("volume")} />
    </div>
  );
};

const Modal = ({
  children,
  title,
  isOpen,
  padding,
  onClose,
}: {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  padding?: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div css={styles.modalRoot}>
      <div css={styles.modalHeader}>
        <h4>{title}</h4>
        <IconButton
          type="button"
          size="small"
          icon={"mdi:close"}
          onClick={onClose}
        />
      </div>
      <div
        css={styles.modalContent}
        style={{
          "--mmpc-modal-padding": padding ?? "16px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const CustomButton = ({
  button,
}: {
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
}) => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const { icon: _icon, name: _name, ...actionConfig } = button;
  const actionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: config.entity_id,
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
