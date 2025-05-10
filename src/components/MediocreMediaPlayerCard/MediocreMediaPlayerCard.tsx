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
import { MassivePopUp } from "./components/MassivePopUp";
import { getHass } from "@utils";
import { css } from "@emotion/react";

const styles = {
  card: css({
    borderRadius: "var(--ha-card-border-radius, 12px)",
    overflow: "hidden",
  }),
  cardArtBackground: css({
    background: `
      radial-gradient( circle at bottom right, var(--art-color, transparent) -500%, transparent 40% ),
      radial-gradient( circle at top center, var(--art-color, transparent) -500%, transparent 40% ),
      radial-gradient( circle at bottom center, var(--art-color, transparent) -500%, transparent 40% ),
      radial-gradient( circle at top left, var(--art-color, transparent) -500%, transparent 40% )`,
  }),
  cardContent: css({
    display: "flex",
    gap: "14px",
    padding: "12px",
    opacity: 1,
    transition: "opacity 0.3s ease",
    position: "relative",
  }),
  cardRowRight: css({
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gap: "4px",
    minWidth: "max-content",
  }),
  cardRow: css({
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  alignStart: css({
    alignItems: "start",
  }),
  cardColumn: css({
    display: "flex",
    flexDirection: "column",
    flex: 1,
  }),
  grid: css({
    display: "grid",
  }),
  controlsContainer: css({
    display: "flex",
    flexGrow: 1,
    containerType: "inline-size",
  }),
};

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
    search,
  } = config;

  const hasCustomButtons = custom_buttons && custom_buttons.length > 0;
  const hasMaSearch = ma_entity_id && ma_entity_id.length > 0;
  const hasSearch = hasMaSearch || search?.enabled;

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
      <div
        css={[styles.card, use_art_colors && styles.cardArtBackground]}
        style={{
          ...(artVars ?? {}),
          ...(haVars && use_art_colors ? haVars : {}),
        }}
      >
        <div css={styles.cardContent} style={{ opacity: isOn ? 1 : 0.7 }}>
          <AlbumArt size={artSize} iconSize="large" {...artActionProps} />
          <div css={styles.cardColumn}>
            <div css={[styles.cardRow, styles.alignStart]}>
              <div css={styles.grid}>
                <MetaInfo />
                <PlayerInfo />
              </div>
              <div css={styles.cardRowRight}>
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
                {hasSearch && (
                  <IconButton
                    size="x-small"
                    onClick={() => setShowSearch(!showSearch)}
                    icon={"mdi:magnify"}
                  />
                )}
              </div>
            </div>
            <div
              css={styles.cardRow}
              style={{
                marginTop: "auto",
                minHeight: hasNoPlaybackControls ? "unset" : "36px",
              }}
            >
              <div css={styles.controlsContainer}>
                {showVolumeSlider || hasNoPlaybackControls ? (
                  <VolumeSlider />
                ) : (
                  <PlaybackControls />
                )}
              </div>
              <div css={styles.cardRowRight}>
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
              </div>
            </div>
          </div>
        </div>

        {showGrouping && hasGroupingFeature && <SpeakerGrouping />}
        {showCustomButtons && <CustomButtons />}
        {showSearch && <Search />}
        {isPopupVisible && (
          <MassivePopUp
            visible={isPopupVisible}
            setVisible={setIsPopupVisible}
          />
        )}
      </div>
    </ha-card>
  );
};
