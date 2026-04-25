/* tslint:disable:no-bitwise */
import { usePlayer } from "@components";
import { useMemo } from "preact/hooks";
import { getSupportedFeatures } from "@utils/supportedFeaturesUtils";

export function useSupportedFeatures() {
  const { attributes, state } = usePlayer();

  const supportedFeatures = getSupportedFeatures(state, attributes);

  return useMemo(
    () => supportedFeatures,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally tracks individual feature flags, not the object reference
    [
      supportedFeatures.supportPreviousTrack,
      supportedFeatures.supportNextTrack,
      supportedFeatures.supportsShuffle,
      supportedFeatures.supportsRepeat,
      supportedFeatures.supportsTogglePlayPause,
      supportedFeatures.supportsPause,
      supportedFeatures.supportsStop,
    ]
  );
}
