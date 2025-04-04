import { HassEntity } from "home-assistant-js-websocket";
import { useMemo } from "preact/hooks";

export function useSupportedFeatures(player: HassEntity) {
  const {
    attributes: {
      shuffle,
      repeat,
      source,
      supported_features: supportedFeatures,
    },
  } = player;

  const supportPreviousTrack = (supportedFeatures | 16) === supportedFeatures;
  const supportNextTrack = (supportedFeatures | 32) === supportedFeatures;
  const supportsShuffle =
    shuffle !== undefined &&
    !["optical", "aux"].includes(source?.toLowerCase());
  const supportsRepeat =
    repeat !== undefined && !["optical", "aux"].includes(source?.toLowerCase());
  const supportsTogglePlayPause =
    (supportedFeatures & 4096) === 4096 ||
    (supportedFeatures & 16384) === 16384;

  return useMemo(
    () => ({
      supportPreviousTrack,
      supportNextTrack,
      supportsShuffle,
      supportsRepeat,
      supportsTogglePlayPause,
    }),
    [
      supportPreviousTrack,
      supportNextTrack,
      supportsShuffle,
      supportsRepeat,
      supportsTogglePlayPause,
    ]
  );
}
