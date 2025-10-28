/* tslint:disable:no-bitwise */

interface MediaPlayerAttributes {
  shuffle?: boolean;
  repeat?: string;
  source?: string;
  supported_features?: number;
}

interface SupportedFeatures {
  supportPreviousTrack: boolean;
  supportNextTrack: boolean;
  supportsShuffle: boolean;
  supportsRepeat: boolean;
  supportsTogglePlayPause: boolean;
}

/**
 * Determines all supported features based on player state and attributes
 */
export function getSupportedFeatures(
  state: string,
  attributes: MediaPlayerAttributes
): SupportedFeatures {
  const {
    shuffle,
    repeat,
    source,
    supported_features: supportedFeatures,
  } = attributes;
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
    !["optical", "aux"].includes(source?.toLowerCase() || "") &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 32768) === 32768;

  const supportsRepeat =
    !isOff &&
    repeat !== undefined &&
    !["optical", "aux"].includes(source?.toLowerCase() || "") &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 262144) === 262144;

  const supportsTogglePlayPause =
    !isOff &&
    supportedFeatures !== undefined &&
    ((supportedFeatures & 4096) === 4096 ||
      (supportedFeatures & 16384) === 16384);

  return {
    supportPreviousTrack,
    supportNextTrack,
    supportsShuffle,
    supportsRepeat,
    supportsTogglePlayPause,
  };
}
