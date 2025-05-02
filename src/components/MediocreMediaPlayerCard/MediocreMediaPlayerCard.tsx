import { CardContext, CardContextType } from "@components/CardContext";
import { useCallback, useContext, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import {
  CustomButton,
  CustomButtons,
  MetaInfo,
  PlaybackControls,
  PlayerInfo,
  Search,
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

const CardRow = styled.div<{ $align?: "start" | "center" | "end" }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: ${props => props.$align || "center"};
  justify-content: space-between;
`;

const CardRowRight = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 4px;
  min-width: max-content;
`;

export const MediocreMediaPlayerCard = () => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const {
    entity_id,
    custom_buttons,
    action,
    tap_opens_popup,
    use_art_colors,
    ma_entity_id,
  } = config;

  const hasCustomButtons = custom_buttons && custom_buttons.length > 0;
  const hasMaSearch = ma_entity_id && ma_entity_id.length > 0;

  const [showGrouping, setShowGrouping] = useState(false);
  const [showCustomButtons, setShowCustomButtons] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { artVars, haVars } = useArtworkColors();

  const { state, subtitle } = usePlayer();

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
    state === "off" || (!subtitle && hasNoPlaybackControls) ? 68 : 100;

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
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <CardRow $align="start">
              <div
                css={{
                  display: "grid",
                }}
              >
                <MetaInfo />
                <PlayerInfo />
              </div>
              <CardRowRight>
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
                {hasMaSearch && (
                  <IconButton
                    size="x-small"
                    onClick={() => setShowSearch(!showSearch)}
                    icon={"mdi:magnify"}
                  />
                )}
              </CardRowRight>
            </CardRow>
            <CardRow
              css={{
                marginTop: "auto",
                minHeight: hasNoPlaybackControls ? "unset" : "36px",
              }}
              $align={"center"}
            >
              <div
                css={{
                  display: "flex",
                  flexGrow: 1,
                  containerType: "inline-size",
                }}
              >
                {showVolumeSlider || hasNoPlaybackControls ? (
                  <VolumeSlider />
                ) : (
                  <PlaybackControls />
                )}
              </div>
              <CardRowRight>
                {!!isOn && !hasNoPlaybackControls && (
                  <VolumeTrigger
                    sliderVisible={showVolumeSlider}
                    setSliderVisible={setShowVolumeSlider}
                  />
                )}
                {!!isOn && hasGroupingFeature && (
                  <IconButton
                    size="x-small"
                    onClick={toggleGrouping}
                    icon={"mdi:speaker-multiple"}
                  />
                )}
                {(!isOn || hasNoPlaybackControls) && (
                  <IconButton
                    size="x-small"
                    onClick={togglePower}
                    icon={"mdi:power"}
                  />
                )}
              </CardRowRight>
            </CardRow>
          </div>
        </CardContent>

        {showGrouping && hasGroupingFeature && <SpeakerGrouping />}
        {showCustomButtons && <CustomButtons />}
        {showSearch && <Search />}
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
