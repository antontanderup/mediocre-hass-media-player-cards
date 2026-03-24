import {
  CardContext,
  CardContextProvider,
  CardContextType,
  IconButton,
  MediaImage,
  usePlayer,
  VolumeSlider as SharedVolumeSlider,
} from "@components";
import { MediocreMediaPlayerCard } from "@components/MediocreMediaPlayerCard";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { useSupportedFeatures } from "@hooks";
import { usePlayerActions } from "@hooks/usePlayerActions";
import {
  MediocreMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { getDeviceIcon, getVolumeIcon } from "@utils";
import { memo } from "preact/compat";
import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";
import { NavigationRoute } from "../MediocreLargeMultiMediaPlayerCard";

export type MiniPlayerProps = {
  setNavigationRoute: (route: NavigationRoute) => void;
  navigationRoute: NavigationRoute;
};

const styles = {
  root: css({
    borderRadius: "12px",
    overflow: "hidden",
  }),
  compactRoot: css({
    borderRadius: theme.sizes.cardBorderRadius,
    overflow: "hidden",
  }),
  compactCard: css({
    borderRadius: theme.sizes.cardBorderRadius,
    overflow: "hidden",
  }),
  compactContainer: css({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "56px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 14,
    padding: 12,
    cursor: "pointer",
    outline: "none",
  }),
  compactContainerVolumeOpen: css({
    gridTemplateColumns: "56px minmax(84px, 0.65fr) minmax(220px, 1.75fr)",
  }),
  artwork: css({
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  }),
  textColumn: css({
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  }),
  title: css({
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.onCard,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  subtitle: css({
    fontSize: 12,
    color: theme.colors.onCardMuted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  actions: css({
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "end",
  }),
  volumeSliderActions: css({
    display: "grid",
    gridTemplateColumns: "40px minmax(0, 1fr)",
    alignItems: "center",
    gap: 8,
    justifySelf: "stretch",
    width: "100%",
    minWidth: 0,
  }),
  volumeSliderWrap: css({
    minWidth: 0,
    width: "100%",
  }),
  controlButton: css({
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 14,
    minWidth: 40,
    minHeight: 40,
    width: 40,
    height: 40,
    padding: 8,
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
      },
      "&:active": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
  }),
};

const PLAYER_STATE_TITLES = new Set([
  "Playing",
  "Paused",
  "Idle",
  "Off",
  "On",
  "Standby",
  "Buffering",
  "Unavailable",
]);

export const MiniPlayer = memo<MiniPlayerProps>(
  ({ setNavigationRoute, navigationRoute }) => {
    const { rootElement, config } =
      useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
        CardContext
      );

    const { selectedPlayer } = useSelectedPlayer();
    const mediaPlayer = selectedPlayer!;
    const miniPlayerMode =
      config.options?.secondary_view_mini_player_mode ?? "default";

    const cardConfig: MediocreMediaPlayerCardConfig = useMemo(() => {
      const { custom_buttons: _custom_buttons, ...rest } = mediaPlayer;
      const speakerGroupEntities = config.media_players
        .filter(player => player.can_be_grouped)
        .map(player => {
          if (player.name) {
            return {
              name: player.name,
              entity: player.speaker_group_entity_id ?? player.entity_id,
            };
          }
          return player.speaker_group_entity_id ?? player.entity_id;
        });
      return {
        type: "custom:mediocre-media-player-card",
        speaker_group:
          speakerGroupEntities.length > 0
            ? {
                entity_id:
                  mediaPlayer.speaker_group_entity_id || mediaPlayer.entity_id,
                entities: speakerGroupEntities,
              }
            : undefined,
        options: {
          show_volume_step_buttons:
            config.options?.show_volume_step_buttons ?? false,
          use_volume_up_down_for_step_buttons:
            config.options?.use_volume_up_down_for_step_buttons ?? false,
        },
        ...rest,
        use_art_colors: config.use_art_colors,
      };
    }, [mediaPlayer, config]);

    const handleOnClick = useCallback(() => {
      if (navigationRoute === "speaker-grouping") {
        return setNavigationRoute("massive");
      }
      return setNavigationRoute("speaker-grouping");
    }, [setNavigationRoute, navigationRoute]);

    if (miniPlayerMode === "hidden") {
      return null;
    }

    if (miniPlayerMode === "compact") {
      return (
        <CompactMiniPlayer
          mediaPlayerName={mediaPlayer.name}
          onClick={handleOnClick}
        />
      );
    }

    return (
      <div css={styles.root}>
        <CardContextProvider rootElement={rootElement} config={cardConfig}>
          <MediocreMediaPlayerCard
            isEmbeddedInMultiCard
            onClick={handleOnClick}
          />
        </CardContextProvider>
      </div>
    );
  }
);

type CompactMiniPlayerProps = {
  mediaPlayerName?: string | null;
  onClick: () => void;
};

const CompactMiniPlayer = ({
  mediaPlayerName,
  onClick,
}: CompactMiniPlayerProps) => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(CardContext);
  const { setLastInteraction, selectedPlayer } = useSelectedPlayer();
  const player = usePlayer();
  const {
    previousTrack,
    togglePlayback,
    nextTrack,
    stop,
    togglePower,
  } = usePlayerActions();
  const {
    supportNextTrack,
    supportPreviousTrack,
    supportsStop,
    supportsTogglePlayPause,
  } = useSupportedFeatures();

  const displayPlayerName =
    mediaPlayerName || player.attributes.friendly_name || player.entity_id;
  const isStateTitle = PLAYER_STATE_TITLES.has(player.title);
  const displayTitle = isStateTitle ? displayPlayerName : player.title;
  const displaySubtitle = isStateTitle
    ? player.title
    : player.subtitle || displayPlayerName;

  const imageUrl =
    player.attributes.entity_picture_local || player.attributes.entity_picture;
  const mdiIcon = getDeviceIcon({
    icon: player.attributes.icon,
    deviceClass: player.attributes.device_class,
  });

  const volumeLevel = player.attributes.volume_level ?? 0;
  const volumeMuted = player.attributes.is_volume_muted ?? false;
  const volumeIcon = getVolumeIcon(volumeLevel, volumeMuted);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumePercent = Math.round(volumeLevel * 100);
  const sliderSubtitle = volumeMuted
    ? `Volume ${volumePercent}% • Muted`
    : `Volume ${volumePercent}%`;

  const buttonAction = useCallback(
    (action: () => void) => (event: MouseEvent) => {
      event.stopPropagation();
      setLastInteraction();
      action();
    },
    [setLastInteraction]
  );

  const handleContainerClick = useCallback(() => {
    setLastInteraction();
    onClick();
  }, [onClick, setLastInteraction]);

  const handleContainerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleContainerClick();
      }
    },
    [handleContainerClick]
  );

  const playPauseAction = supportsTogglePlayPause
    ? togglePlayback
    : supportsStop
      ? stop
      : undefined;
  const volumeEntityId =
    selectedPlayer?.speaker_group_entity_id ??
    selectedPlayer?.entity_id ??
    player.entity_id;

  return (
    <div css={styles.compactRoot}>
      <ha-card css={styles.compactCard}>
        <div
          css={[
            styles.compactContainer,
            showVolumeSlider &&
              player.state !== "off" &&
              styles.compactContainerVolumeOpen,
          ]}
          role="button"
          tabIndex={0}
          onClick={handleContainerClick}
          onKeyDown={handleContainerKeyDown}
        >
          <div css={styles.artwork}>
            <MediaImage imageUrl={imageUrl} mdiIcon={mdiIcon} />
          </div>
          <div css={styles.textColumn}>
            <div css={styles.title}>{displayTitle}</div>
            <div css={styles.subtitle}>
              {showVolumeSlider ? sliderSubtitle : displaySubtitle}
            </div>
          </div>
          {player.state === "off" ? (
            <div css={styles.actions}>
              <IconButton
                icon="mdi:power"
                size="small"
                css={styles.controlButton}
                onClick={buttonAction(togglePower)}
              />
            </div>
          ) : showVolumeSlider ? (
            <div css={styles.volumeSliderActions}>
              <IconButton
                icon="mdi:chevron-left"
                size="small"
                css={styles.controlButton}
                onClick={buttonAction(() => setShowVolumeSlider(false))}
              />
              <div css={styles.volumeSliderWrap}>
                <SharedVolumeSlider
                  entityId={volumeEntityId}
                  syncGroupChildren={true}
                  sliderSize="small"
                  showStepButtons={
                    config.options?.show_volume_step_buttons ?? false
                  }
                  useVolumeUpDownForSteps={
                    config.options?.use_volume_up_down_for_step_buttons ?? false
                  }
                />
              </div>
            </div>
          ) : (
            <div css={styles.actions}>
              {supportPreviousTrack && (
                <IconButton
                  icon="mdi:skip-previous"
                  size="small"
                  css={styles.controlButton}
                  onClick={buttonAction(previousTrack)}
                />
              )}
              {!!playPauseAction && (
                <IconButton
                  icon={
                    supportsTogglePlayPause
                      ? player.state === "playing"
                        ? "mdi:pause"
                        : "mdi:play"
                      : "mdi:stop"
                  }
                  size="small"
                  css={styles.controlButton}
                  onClick={buttonAction(playPauseAction)}
                />
              )}
              {supportNextTrack && (
                <IconButton
                  icon="mdi:skip-next"
                  size="small"
                  css={styles.controlButton}
                  onClick={buttonAction(nextTrack)}
                />
              )}
              <IconButton
                icon={volumeIcon}
                size="small"
                css={styles.controlButton}
                onClick={buttonAction(() => setShowVolumeSlider(true))}
              />
            </div>
          )}
        </div>
      </ha-card>
    </div>
  );
};
