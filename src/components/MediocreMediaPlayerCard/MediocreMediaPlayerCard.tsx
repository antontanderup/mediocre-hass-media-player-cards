import { CardContext, type CardContextType } from "../../utils";
import { useCallback, useContext, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "../MediaPlayerCommon/config";

import {
  AlbumArt,
  CustomButton,
  CustomButtons,
  MetaInfo,
  PlaybackControls,
  PlayerInfo,
  SpeakerGrouping,
} from "./components";
import { IconButton } from "../IconButton";
import { VolumeSlider, VolumeTrigger } from "./components/VolumeSlider";
import { Fragment } from "preact/jsx-runtime";
import { useSupportedFeatures } from "../../hooks/useSupportedFeatures";
import { InteractionConfig } from "../../types";
import { useActionProps } from "../../hooks";
import styled from "@emotion/styled";
import { MassivePopUp } from "./components/MassivePopUp";

const Card = styled.div`
  border-radius: var(--ha-card-border-radius, 12px);
  overflow: hidden;
`;

const CardContent = styled.div<{ isOn: boolean }>`
  display: flex;
  gap: 14px;
  padding: 12px;
  opacity: ${props => (props.isOn ? 1 : 0.7)};
  transition: opacity 0.3s ease;
  position: relative;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 12px;
  overflow: hidden;
`;

const ContentLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  justify-content: space-between;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-start;
`;

export const MediocreMediaPlayerCard = () => {
  const { rootElement, hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id, custom_buttons, action, tap_opens_popup } = config;

  const hasCustomButtons = custom_buttons && custom_buttons.length > 0;

  const [showGrouping, setShowGrouping] = useState(false);
  const [showCustomButtons, setShowCustomButtons] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Get the media player entity from hass
  const entity = hass.states[entity_id];

  if (!entity) {
    return (
      <ha-card>
        <Card>
          <div>Entity {entity_id} not found</div>
        </Card>
      </ha-card>
    );
  }

  const supportedFeatures = useSupportedFeatures(entity);
  const hasNoPlaybackControls =
    !supportedFeatures.supportsTogglePlayPause &&
    !supportedFeatures.supportNextTrack &&
    !supportedFeatures.supportPreviousTrack &&
    !supportedFeatures.supportsShuffle &&
    !supportedFeatures.supportsRepeat;

  // Extract state and attributes
  const { state } = entity;

  // Determine if the player is on
  const isOn = !["off", "unavailable"].includes(state);

  // Check if grouping is available
  const hasGroupingFeature =
    config.speaker_group &&
    config.speaker_group.entities &&
    config.speaker_group.entities.length > 0;

  const toggleGrouping = () => {
    setShowGrouping(!showGrouping);
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const artAction: InteractionConfig = action ?? {
    tap_action: { action: "more-info" },
  };

  const artActionProps = useActionProps({
    hass,
    rootElement,
    actionConfig: {
      ...artAction,
      entity: config.entity_id,
    },
    overrideCallback: {
      onTap: tap_opens_popup
        ? () => {
            setIsPopupVisible(true);
          }
        : undefined,
    },
  });

  const togglePower = useCallback(() => {
    hass.callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return (
    <Fragment>
      <ha-card>
        <Card>
          <CardContent isOn={isOn}>
            <AlbumArt maxHeight="100px" {...artActionProps} />
            <ContentContainer>
              <ContentLeft>
                <MetaInfo />
                <PlayerInfo />
                {showVolumeSlider || hasNoPlaybackControls ? (
                  <VolumeSlider />
                ) : (
                  <PlaybackControls />
                )}
              </ContentLeft>
              <ContentRight>
                <ContentRow>
                  {hasCustomButtons && (
                    <Fragment>
                      {custom_buttons.length === 1 ? (
                        <CustomButton
                          button={custom_buttons[0]}
                          type="icon-button"
                        />
                      ) : (
                        <IconButton
                          size="x-small"
                          onClick={() =>
                            setShowCustomButtons(!showCustomButtons)
                          }
                          icon={"mdi:dots-vertical"}
                        />
                      )}
                    </Fragment>
                  )}
                  {hasGroupingFeature && (
                    <IconButton
                      size="x-small"
                      onClick={toggleGrouping}
                      icon={"mdi:speaker-multiple"}
                    />
                  )}
                </ContentRow>
                <ContentRow>
                  {!!isOn && !hasNoPlaybackControls && (
                    <VolumeTrigger
                      sliderVisible={showVolumeSlider}
                      setSliderVisible={setShowVolumeSlider}
                    />
                  )}
                  {(!isOn || hasNoPlaybackControls) && (
                    <IconButton
                      size="small"
                      onClick={togglePower}
                      icon={"mdi:power"}
                    />
                  )}
                </ContentRow>
              </ContentRight>
            </ContentContainer>
          </CardContent>
          {showGrouping && hasGroupingFeature && <SpeakerGrouping />}
          {showCustomButtons && <CustomButtons />}
        </Card>
      </ha-card>
      <MassivePopUp visible={isPopupVisible} setVisible={setIsPopupVisible} />
    </Fragment>
  );
};
