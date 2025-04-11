import { useCallback, useContext, useState } from "preact/hooks";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { IconButton } from "@components";
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
import { getHass } from "@utils";

const PlayerActionsWrap = styled.div`
  background-color: var(--mmpc-surface-higher);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0 15px 100px var(--clear-background-color);
`;

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

const ModalRoot = styled.div`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  width: 100%;
  background-color: var(--mmpc-surface-higher);
  border-radius: 12px;
  box-sizing: border-box;
  animation: ${slideUpFadeIn} 0.3s ease forwards;
  box-shadow: 0 0px 80px var(--clear-background-color);
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > h4 {
    margin: 0;
  }
  padding: 8px 16px;
  color: var(--primary-text-color, #fff);
  border-bottom: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
`;

const ModalContent = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: ${props => props.padding ?? "16px"};
`;

export const PlayerActions = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { entity_id, custom_buttons, speaker_group } = config;

  const [selected, setSelected] = useState<
    "volume" | "speaker-grouping" | "custom-buttons"
  >();

  const toggleSelected = useCallback(
    (key: "volume" | "speaker-grouping" | "custom-buttons") => {
      setSelected(selected === key ? undefined : key);
    },
    [selected]
  );

  const onTogglePower = useCallback(() => {
    getHass().callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return (
    <PlayerActionsWrap>
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
      {!!speaker_group && (
        <IconButton
          size="small"
          icon={"mdi:speaker-multiple"}
          onClick={() => toggleSelected("speaker-grouping")}
        />
      )}
      {custom_buttons
        ?.slice(0, 2)
        .map((button, index) => <CustomButton key={index} button={button} />)}
      {custom_buttons?.length > 3 && (
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
      <IconButton size="small" icon={"mdi:power"} onClick={onTogglePower} />
      <VolumeTrigger onClick={() => toggleSelected("volume")} />
    </PlayerActionsWrap>
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
    <ModalRoot>
      <ModalHeader>
        <h4>{title}</h4>
        <IconButton
          type="button"
          size="small"
          icon={"mdi:close"}
          onClick={onClose}
        />
      </ModalHeader>
      <ModalContent padding={padding}>{children}</ModalContent>
    </ModalRoot>
  );
};

export const CustomButton = ({
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
