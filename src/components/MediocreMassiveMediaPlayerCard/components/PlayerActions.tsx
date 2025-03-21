import { useCallback, useContext, useState } from "preact/hooks";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType } from "../../../utils";
import { ReactNode } from "preact/compat";
import { VolumeController, VolumeTrigger } from "./VolumeController";
import { SpeakerGrouping } from "./SpeakerGrouping";
import { InteractionConfig } from "../../../types";
import { Chip } from "../../Chip";
import { Icon } from "../../Icon";
import { useActionProps } from "../../../hooks";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon";

const PlaybackControlsWrap = styled.div`
  background-color: var(--card-background-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0 0px 80px var(--clear-background-color);
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
  background-color: var(--card-background-color);
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
  border-bottom: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
`;

const ModalContent = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: ${(props) => props.padding ?? "16px"};
`;

export const PlayerActions = () => {
  const { hass, config, rootElement } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { entity_id, custom_buttons, speaker_group } = config;

  if (!custom_buttons || custom_buttons.length === 0) {
    return null;
  }

  const [selected, setSelected] = useState<"volume" | "speaker-grouping">();

  const toggleSelected = useCallback(
    (key: "volume" | "speaker-grouping") => {
      setSelected(selected === key ? undefined : key);
    },
    [selected]
  );

  const moreInfoButtonProps = useActionProps({
    rootElement,
    hass,
    actionConfig: {
      tap_action: {
        action: "more-info",
      },
      entity: entity_id,
    },
  });

  const onTogglePower = useCallback(() => {
    hass.callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return (
    <PlaybackControlsWrap>
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
          Icon={"mdi:speaker-multiple"}
          onClick={() => toggleSelected("speaker-grouping")}
        />
      )}
      <IconButton
        size="small"
        {...moreInfoButtonProps}
        Icon="mdi:information"
      />
      {custom_buttons.map((button, index) => (
        <CustomButton key={index} button={button} type={"icon-button"} />
      ))}
      <IconButton size="small" Icon={"mdi:power"} onClick={onTogglePower} />
      <VolumeTrigger onClick={() => toggleSelected("volume")} />
    </PlaybackControlsWrap>
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
        <IconButton size="small" Icon={"mdi:close"} onClick={onClose} />
      </ModalHeader>
      <ModalContent padding={padding}>{children}</ModalContent>
    </ModalRoot>
  );
};

export const CustomButton = ({
  button,
  type = "chip",
}: {
  type?: "chip" | "icon-button";
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
}) => {
  const { hass, rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { icon, name, ...actionConfig } = button;
  const actionProps = useActionProps({
    hass,
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: config.entity_id,
    },
  });
  if (type === "icon-button") {
    return (
      <IconButton
        Icon={button.icon ?? "mdi:dots-vertical"}
        size={"small"}
        {...actionProps}
      />
    );
  }

  return (
    <Chip {...actionProps}>
      {!!icon && <Icon Icon={icon} size={"x-small"} />}
      {!!name && <span>{name}</span>}
    </Chip>
  );
};
