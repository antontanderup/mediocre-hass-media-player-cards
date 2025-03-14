import { CardContext, type CardContextType } from "../../utils";
import { useCallback, useContext, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "./config";
import styled from "styled-components";
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
import { fireEvent } from "custom-card-helpers";
import { VolumeSlider, VolumeTrigger } from "./components/VolumeSlider";
import { Fragment } from "preact/jsx-runtime";
import { useSupportedFeatures } from "./hooks/useSupportedFeatures";

const Card = styled.div`
  border-radius: var(--ha-card-border-radius, 12px);
  overflow: hidden;
`;

const CardContent = styled.div<{ isOn: boolean }>`
  display: flex;
  gap: 14px;
  padding: 12px;
  opacity: ${(props) => (props.isOn ? 1 : 0.7)};
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
  const { entity_id, custom_buttons } = config;

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

  const toggleMore = useCallback(() => {
    fireEvent(rootElement, "hass-more-info", {
      entityId: entity_id,
    });
  }, [showCustomButtons]);

  const togglePower = useCallback(() => {
    hass.callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return (
    <ha-card>
      <Card>
        <CardContent isOn={isOn}>
          <AlbumArt onClick={toggleMore} />
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
                        onClick={() => setShowCustomButtons(!showCustomButtons)}
                        Icon={"mdi:dots-vertical"}
                      />
                    )}
                  </Fragment>
                )}
                {hasGroupingFeature && (
                  <IconButton
                    size="x-small"
                    onClick={toggleGrouping}
                    Icon={"mdi:speaker-multiple"}
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
                    Icon={"mdi:power"}
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
  );
};
