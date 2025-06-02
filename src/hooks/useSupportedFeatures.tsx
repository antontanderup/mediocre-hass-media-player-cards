/* tslint:disable:no-bitwise */
import { usePlayer } from "@components";
import { useMemo } from "preact/hooks";

export function useSupportedFeatures() {
  const {
    attributes: {
      shuffle,
      repeat,
      source,
      supported_features: supportedFeatures,
    },
    state,
  } = usePlayer();

  const isOff = state === "off";
  const supportPreviousTrack =
    !isOff &&
    supportedFeatures !== undefined &&
    (supportedFeatures | 16) === supportedFeatures;
  const supportNextTrack =
    !isOff &&
    supportedFeatures !== undefined &&
    (supportedFeatures | 32) === supportedFeatures;
  const supportsShuffle =
    !isOff &&
    shuffle !== undefined &&
    !["optical", "aux"].includes(source?.toLowerCase() || "");
  const supportsRepeat =
    !isOff &&
    repeat !== undefined &&
    !["optical", "aux"].includes(source?.toLowerCase() || "");
  const supportsTogglePlayPause =
    !isOff &&
    supportedFeatures !== undefined &&
    ((supportedFeatures & 4096) === 4096 ||
      (supportedFeatures & 16384) === 16384);

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
