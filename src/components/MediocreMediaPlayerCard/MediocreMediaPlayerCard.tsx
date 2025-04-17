import { CardContext, CardContextType } from "@components/CardContext";
import { useCallback, useContext, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import {
  CustomButton,
  CustomButtons,
  MetaInfo,
  PlaybackControls,
  PlayerInfo,
  SpeakerGrouping,
} from "./components";
import { AlbumArt, IconButton, usePlayer } from "@components";
import { VolumeSlider, VolumeTrigger } from "./components/VolumeSlider";
import { Fragment } from "preact/jsx-runtime";
import { useSupportedFeatures, useActionProps, useArtworkColors } from "@hooks";
import { InteractionConfig } from "@types";
import styled from "@emotion/styled";
import { MassivePopUp } from "./components/MassivePopUp";
import { getHass } from "@utils";

const Card = styled.div<{
  $artColorVars?: string;
  $haColorVars?: string;
  $useArtColors?: boolean;
}>`
  border-radius: var(--ha-card-border-radius, 12px);
  overflow: hidden;
  ${props => props.$artColorVars ?? ""}
  ${props => {
    if (props.$useArtColors && !!props.$haColorVars) {
      return props.$haColorVars;
    } else return "";
  }}
  ${props =>
    props.$useArtColors &&
    `
    background: 
      radial-gradient( circle at bottom right, var(--art-color, transparent) -500%, transparent 40% ),
      radial-gradient( circle at top center, var(--art-color, transparent) -500%, transparent 40% ),
      radial-gradient( circle at bottom center, var(--art-color, transparent) -500%, transparent 40% ),
      radial-gradient( circle at top left, var(--art-color, transparent) -500%, transparent 40% );
  `}
`;

const CardContent = styled.div<{ $isOn: boolean; $useArtColors?: boolean }>`
  display: flex;
  gap: 14px;
  padding: 12px;
  opacity: ${props => (props.$isOn ? 1 : 0.7)};
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
  const { rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id, custom_buttons, action, tap_opens_popup, use_art_colors } =
    config;

  const hasCustomButtons = custom_buttons && custom_buttons.length > 0;

  const [showGrouping, setShowGrouping] = useState(false);
  const [showCustomButtons, setShowCustomButtons] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const { artVars, haVars } = useArtworkColors();

  const {
    state,
    attributes: {
      media_title: title,
      media_artist: artist,
      media_album_name: albumName,
    },
  } = usePlayer();

  const supportedFeatures = useSupportedFeatures();
  const hasNoPlaybackControls =
    !supportedFeatures.supportsTogglePlayPause &&
    !supportedFeatures.supportNextTrack &&
    !supportedFeatures.supportPreviousTrack &&
    !supportedFeatures.supportsShuffle &&
    !supportedFeatures.supportsRepeat;

  // Determine if the player is on
  const isOn = state !== "off" && state !== "unavailable";

  // Check if grouping is available
  const hasGroupingFeature =
    config.speaker_group &&
    config.speaker_group.entities &&
    config.speaker_group.entities.length > 0;

  const toggleGrouping = () => {
    setShowGrouping(!showGrouping);
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const artSize =
    state === "off" || (!title && !artist && !albumName) ? 68 : 100;

  const artAction: InteractionConfig = action ?? {
    tap_action: { action: "more-info" },
  };

  const artActionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...artAction,
      entity: config.entity_id,
    },
    overrideCallback: tap_opens_popup
      ? {
          onTap: () => {
            setIsPopupVisible(true);
          },
        }
      : {},
  });

  const togglePower = useCallback(() => {
    getHass().callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return (
    <ha-card>
      <Card
        $artColorVars={artVars}
        $haColorVars={haVars}
        $useArtColors={use_art_colors}
      >
        <CardContent $isOn={isOn} $useArtColors={use_art_colors}>
          <AlbumArt size={artSize} iconSize="large" {...artActionProps} />
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
        {isPopupVisible && (
          <MassivePopUp
            visible={isPopupVisible}
            setVisible={setIsPopupVisible}
          />
        )}
      </Card>
    </ha-card>
  );
};
