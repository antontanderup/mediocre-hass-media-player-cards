/* tslint:disable:no-bitwise */
import { usePlayer } from "@components";
import { useMemo } from "preact/hooks";
import { checkSupportsShuffle, checkSupportsRepeat } from "@utils/supportedFeaturesUtils";

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
  const supportsShuffle = checkSupportsShuffle(
    isOff,
    shuffle,
    source,
    supportedFeatures
  );
  const supportsRepeat = checkSupportsRepeat(
    isOff,
    repeat,
    source,
    supportedFeatures
  );
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
