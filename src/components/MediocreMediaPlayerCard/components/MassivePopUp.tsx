import { useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon";
import { MediocreMassiveMediaPlayerCard } from "../../MediocreMassiveMediaPlayerCard";
import { IconButton } from "../../IconButton/IconButton";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Icon } from "../../Icon";
import { getDeviceIcon } from "./PlayerInfo";

const slideUp = keyframes`
  from {
    transform: translateY(15%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8; // Above header and below dialogs
  transition: opacity 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  @media screen and (min-height: 832px) {
    align-items: center;
  }
`;

const ClickableBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const PopUpContainer = styled.div`
  animation: ${slideUp} 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  max-height: 98vh;
  height: fit-content;
  width: 424px;
  max-width: 98vw;
  margin-botton: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  background-color: var(--ha-card-background, #fff);
  overflow: hidden;
  border-top-left-radius: var(--ha-dialog-border-radius, 28px);
  border-top-right-radius: var(--ha-dialog-border-radius, 28px);
  @media screen and (min-height: 832px) {
    border-radius: var(--ha-dialog-border-radius, 28px);
  }
`;

const PopUpContent = styled.div`
  display: grid;
  height: 100%;
`;

const headerHeight = 58;
const PopUpHeader = styled.div`
  display: flex;
  height: ${headerHeight}px;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 16px;
  border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  background-color: var(--ha-card-background, #fff);
  gap: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--primary-text-color, #212121);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CloseButton = styled(IconButton)`
  margin-left: auto;
`;

const PopupMediocreMassiveMediaPlayerCard = styled(
  MediocreMassiveMediaPlayerCard
)`
  max-height: calc(98vh - ${headerHeight}px);
  max-width: 98vw;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const MassivePopUp = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { hass, config, rootElement } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { entity_id, speaker_group } = config;
  const {
    friendly_name: friendlyName,
    icon,
    device_class: deviceClass,
  } = hass.states[entity_id].attributes;

  const groupMembers =
    hass.states[speaker_group?.entity_id ?? entity_id]?.attributes
      ?.group_members;
  const mdiIcon = getDeviceIcon({ icon, deviceClass });

  const massiveConfig = useMemo(() => {
    const { tap_opens_popup, ...commonConfig } = config;
    return {
      ...commonConfig,
      mode: "popup",
    };
  }, [config]);

  if (!visible) {
    return null;
  }
  return (
    <Overlay>
      <ClickableBackground onClick={() => setVisible(false)} />
      <PopUpContainer>
        <PopUpHeader>
          <Icon size={"small"} icon={mdiIcon} />
          <Title>
            {friendlyName}
            {groupMembers?.length > 1 && (
              <span> +{groupMembers.length - 1}</span>
            )}
          </Title>
          <CloseButton
            icon="mdi:close"
            size="small"
            onClick={() => setVisible(false)}
          />
        </PopUpHeader>
        <PopUpContent>
          <CardContextProvider
            rootElement={rootElement}
            hass={hass}
            config={massiveConfig}
          >
            <PopupMediocreMassiveMediaPlayerCard />
          </CardContextProvider>
        </PopUpContent>
      </PopUpContainer>
    </Overlay>
  );
};
