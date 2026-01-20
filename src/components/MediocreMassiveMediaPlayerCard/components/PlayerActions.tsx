import { useCallback, useContext, useState } from "preact/hooks";
import { css, keyframes } from "@emotion/react";
import {
  AdditionalActionsMenu,
  IconButton,
  Queue,
  usePlayer,
} from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { Fragment, ReactNode } from "preact/compat";
import { VolumeController, VolumeTrigger } from "./VolumeController";
import { SpeakerGrouping } from "./SpeakerGrouping";
import { useActionProps, useCanDisplayQueue } from "@hooks";
import {
  MediocreMassiveMediaPlayerCardConfig,
  InteractionConfig,
} from "@types";
import { CustomButtons } from "./CustomButtons";
import { theme } from "@constants";
import {
  getHasMediaBrowser,
  getHasMediaBrowserEntryArray,
  getHass,
  getHasSearch,
} from "@utils";
import { MediaBrowser } from "@components/MediaBrowser/MediaBrowser";
import { useIntl } from "@components/i18n";
import { Search } from "./Search";

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
    "--mmpc-surface-shadow": `hsl(from var(--mmpc-surface-higher) h calc(s / 2) calc(l - 10))`,
    boxShadow: "0px 0px 20px var(--mmpc-surface-shadow)",
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
    boxShadow: "0px 0px 20px var(--mmpc-surface-shadow)",
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
    padding: "var(--mmpc-modal-padding, 16px)",
  }),
};

export const PlayerActions = () => {
  const { t } = useIntl();

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
    media_browser,
    ma_favorite_button_entity_id,
    lms_entity_id,
    options: { always_show_power_button: alwaysShowPowerButton } = {},
  } = config;

  const player = usePlayer();
  const { state } = player;
  // Determine if the player is on
  const isOn = state !== "off" && state !== "unavailable";

  const hasSearch = getHasSearch(search, ma_entity_id);

  const hasMediaBrowser = getHasMediaBrowser(media_browser);

  const hasQueue = useCanDisplayQueue({ ma_entity_id, lms_entity_id });

  const [selected, setSelected] = useState<
    | "volume"
    | "speaker-grouping"
    | "custom-buttons"
    | "search"
    | "media-browser"
    | "queue"
    | undefined
  >();

  const toggleSelected = useCallback(
    (
      key:
        | "volume"
        | "speaker-grouping"
        | "custom-buttons"
        | "media-browser"
        | "search"
        | "queue"
    ) => {
      setSelected(selected === key ? undefined : key);
    },
    [selected]
  );

  const togglePower = useCallback(() => {
    getHass().callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return (
    <div css={styles.root}>
      <Modal
        title={t({
          id: "MediocreMassiveMediaPlayerCard.PlayerActions.volume_modal_title",
          defaultMessage: "Volume",
        })}
        isOpen={selected === "volume"}
        onClose={() => setSelected(undefined)}
      >
        <VolumeController />
      </Modal>
      <Modal
        title={t({
          id: "MediocreMassiveMediaPlayerCard.PlayerActions.speaker_grouping_modal_title",
          defaultMessage: "Speaker Grouping",
        })}
        isOpen={selected === "speaker-grouping"}
        onClose={() => setSelected(undefined)}
        padding="16px 0px 16px 0px"
      >
        <SpeakerGrouping />
      </Modal>
      <Modal
        title={t({
          id: "MediocreMassiveMediaPlayerCard.PlayerActions.media_browser_modal_title",
          defaultMessage: "Media Browser",
        })}
        isOpen={selected === "media-browser"}
        onClose={() => setSelected(undefined)}
        padding="0px"
      >
        <MediaBrowser
          mediaBrowserEntryArray={getHasMediaBrowserEntryArray(
            media_browser,
            entity_id
          )}
          horizontalPadding={16}
        />
      </Modal>
      <Modal
        title={t({
          id: "MediocreMassiveMediaPlayerCard.PlayerActions.queue_view_modal_title",
          defaultMessage: "Up Next",
        })}
        isOpen={selected === "queue"}
        onClose={() => setSelected(undefined)}
        padding="6px 16px"
      >
        <Queue lms_entity_id={lms_entity_id} ma_entity_id={ma_entity_id} />
      </Modal>
      <Modal
        title={t({
          id: "MediocreMassiveMediaPlayerCard.PlayerActions.search_modal_title",
          defaultMessage: "Search",
        })}
        isOpen={selected === "search"}
        onClose={() => setSelected(undefined)}
        padding="16px 0px 16px 0px"
      >
        <Search />
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
            title={t({
              id: "MediocreMassiveMediaPlayerCard.PlayerActions.shortcuts_modal_title",
              defaultMessage: "Shortcuts",
            })}
            isOpen={selected === "custom-buttons"}
            onClose={() => setSelected(undefined)}
            padding="16px 0px 16px 0px"
          >
            <CustomButtons />
          </Modal>
        </Fragment>
      ) : null}

      <AdditionalActionsMenu
        ma_entity_id={ma_entity_id ?? undefined}
        ma_favorite_button_entity_id={ma_favorite_button_entity_id ?? undefined}
        lms_entity_id={config.lms_entity_id ?? undefined}
        noSourceSelection
        side="top"
        align="center"
        renderTrigger={triggerProps => (
          <IconButton
            icon={"mdi:dots-vertical"}
            size="small"
            {...triggerProps}
          />
        )}
      />
      {hasSearch && (
        <IconButton
          size="small"
          icon={"mdi:magnify"}
          onClick={() => toggleSelected("search")}
        />
      )}
      {hasMediaBrowser && (
        <IconButton
          size="small"
          icon={"mdi:folder-music"}
          onClick={() => toggleSelected("media-browser")}
        />
      )}
      {hasQueue && (
        <IconButton
          size="small"
          icon={"mdi:playlist-music"}
          onClick={() => toggleSelected("queue")}
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
