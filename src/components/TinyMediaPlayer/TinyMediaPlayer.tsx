import { MediaTrack, MediaTrackProps } from "@components/MediaSearch";
import { usePlayer } from "@components/PlayerContext";
import { useSupportedFeatures } from "@hooks";
import { usePlayerActions } from "@hooks/usePlayerActions";
import { getDeviceIcon, getSourceIcon } from "@utils";
import { useMemo } from "preact/hooks";

type TinyMediaPlayerProps = Omit<
  MediaTrackProps,
  "imageUrl" | "title" | "artist"
> & { name?: string };

export const TinyMediaPlayer = (props: TinyMediaPlayerProps) => {
  const player = usePlayer();

  const playerName = useMemo(() => {
    if (props.name) return props.name;
    return player.attributes.friendly_name || player.entity_id;
  }, [props.name, player.attributes.friendly_name, player.entity_id]);

  const currentItemTitle = `${player.title}${player.subtitle ? ` - ${player.subtitle}` : ""}`;

  const albumArt =
    player.attributes.entity_picture_local || player.attributes.entity_picture;

  const supportedFeatures = useSupportedFeatures();
  const playerActions = usePlayerActions();

  const playbackButtons: TinyMediaPlayerProps["buttons"] = useMemo(() => {
    const buttons: TinyMediaPlayerProps["buttons"] = [];
    if (player.state === "off") {
      buttons.push({
        icon: "mdi:power",
        onClick: playerActions.togglePower,
        priority: 1,
        size: "x-small"
      });
      return buttons;
    }
    const {
      supportsStop,
      supportNextTrack,
      supportPreviousTrack,
      supportsRepeat,
      supportsShuffle,
      supportsTogglePlayPause,
    } = supportedFeatures;
    if (supportsShuffle) {
      buttons.push({
        icon: player.attributes.shuffle
          ? "mdi:shuffle-variant"
          : "mdi:shuffle-disabled",
        onClick: playerActions.toggleShuffle,
        priority: 3,
        size: "xx-small",
      });
    }
    if (supportPreviousTrack) {
      buttons.push({
        icon: "mdi:skip-previous",
        onClick: playerActions.previousTrack,
        priority: 2,
        size: "x-small",
      });
    }
    if (supportsTogglePlayPause) {
      buttons.push({
        icon:
          player.state === "playing" ? "mdi:pause-circle" : "mdi:play-circle",
        onClick: playerActions.togglePlayback,
        priority: 1,
        size: "small",
      });
    } else if (supportsStop) {
      buttons.push({
        icon: "mdi:stop-circle",
        onClick: playerActions.stop,
        priority: 1,
        size: "small",
      });
    }
    if (supportNextTrack) {
      buttons.push({
        icon: "mdi:skip-next",
        onClick: playerActions.nextTrack,
        priority: 2,
        size: "x-small",
      });
    }
    if (supportsRepeat) {
      const repeat = player.attributes.repeat;
      buttons.push({
        icon:
          repeat === "one"
            ? "mdi:repeat-once"
            : repeat === "all"
              ? "mdi:repeat"
              : "mdi:repeat-off",
        onClick: playerActions.toggleRepeat,
        priority: 3,
        size: "xx-small",
      });
    }

    return buttons;
  }, [supportedFeatures, player, playerActions]);

  return (
    <MediaTrack
      {...props}
      buttons={playbackButtons}
      mdiIcon={
        player.state === "off" || !player.attributes.source
          ? getDeviceIcon({
              icon: player.attributes.icon,
              deviceClass: player.attributes.device_class,
            })
          : getSourceIcon({ source: player.attributes.source })
      }
      imageUrl={albumArt}
      title={playerName}
      artist={currentItemTitle}
      buttonIconSize="small"
    />
  );
};
