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
  supportsPause: boolean;
  supportsStop: boolean;
}

/**
 * Determines all supported features based on player state and attributes
 */

export function getSupportedFeatures(
  state: string,
  attributes: MediaPlayerAttributes
): SupportedFeatures {
  const { shuffle, repeat, supported_features: supportedFeatures } = attributes;
  const isOff = state === "off";
  const supportPreviousTrack =
    !isOff &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 16) === 16;

  const supportNextTrack =
    !isOff &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 32) === 32;

  const supportsPause =
    !isOff &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 1) === 1;

  const supportsTogglePlayPause =
    !isOff &&
    supportedFeatures !== undefined &&
    // Either PAUSE is supported (media_play_pause works), or PLAY+STOP are
    // both supported (can use individual actions without leaving player stuck)
    ((supportedFeatures & 1) === 1 ||
      ((supportedFeatures & 16384) === 16384 &&
        (supportedFeatures & 4096) === 4096));

  const supportsStop =
    !isOff &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 4096) === 4096;

  const canProbablyNotShuffleAndRepeat =
    !supportsStop && !supportsTogglePlayPause;

  const supportsShuffle =
    !isOff &&
    !canProbablyNotShuffleAndRepeat &&
    shuffle !== undefined &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 32768) === 32768;

  const supportsRepeat =
    !isOff &&
    !canProbablyNotShuffleAndRepeat &&
    repeat !== undefined &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 262144) === 262144;

  return {
    supportPreviousTrack,
    supportNextTrack,
    supportsShuffle,
    supportsRepeat,
    supportsTogglePlayPause,
    supportsPause,
    supportsStop,
  };
}
