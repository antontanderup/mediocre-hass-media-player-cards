/* tslint:disable:no-bitwise */
import { usePlayer } from "@components";
import { useMemo } from "preact/hooks";
import { getSupportedFeatures } from "@utils/supportedFeaturesUtils";

export function useSupportedFeatures() {
  const { attributes, state } = usePlayer();

  const supportedFeatures = getSupportedFeatures(state, attributes);

  return useMemo(
    () => supportedFeatures,
    [
      supportedFeatures.supportPreviousTrack,
      supportedFeatures.supportNextTrack,
      supportedFeatures.supportsShuffle,
      supportedFeatures.supportsRepeat,
      supportedFeatures.supportsTogglePlayPause,
    ]
  );
}
