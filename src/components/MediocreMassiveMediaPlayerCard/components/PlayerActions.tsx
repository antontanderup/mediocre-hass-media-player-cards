import { useCallback, useContext, useState } from "preact/hooks";
import { css, keyframes } from "@emotion/react";
import { IconButton, MaSearch } from "@components";
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
    borderBottom: "0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12))",
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

  const { custom_buttons, speaker_group, ma_entity_id } = config;

  const [selected, setSelected] = useState<
    "volume" | "speaker-grouping" | "custom-buttons" | "search"
  >();

  const toggleSelected = useCallback(
    (key: "volume" | "speaker-grouping" | "custom-buttons") => {
      setSelected(selected === key ? undefined : key);
    },
    [selected]
  );

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
        <MaSearch
          maEntityId={ma_entity_id}
          horizontalPadding={16}
          searchBarPosition="bottom"
        />
      </Modal>
      {!!speaker_group && (
        <IconButton
          size="small"
          icon={"mdi:speaker-multiple"}
          onClick={() => toggleSelected("speaker-grouping")}
        />
      )}
      {custom_buttons
        ?.slice(0, 1)
        .map((button, index) => <CustomButton key={index} button={button} />)}
      {custom_buttons?.length > 2 && (
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
      )}
      {!!ma_entity_id && (
        <IconButton
          size="small"
          icon={"mdi:magnify"}
          onClick={() => setSelected("search")}
        />
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
          "--mmpc-modal-padding": padding ?? 16,
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
