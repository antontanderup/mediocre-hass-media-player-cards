/* tslint:disable:no-bitwise */

/**
 * Determines if shuffle is supported based on player state, attributes, and features
 */
export function checkSupportsShuffle(
  isOff: boolean,
  shuffle: boolean | undefined,
  source: string | undefined,
  supportedFeatures: number | undefined
): boolean {
  return (
    !isOff &&
    shuffle !== undefined &&
    !["optical", "aux"].includes(source?.toLowerCase() || "") &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 32768) === 32768
  );
}

/**
 * Determines if repeat is supported based on player state, attributes, and features
 */
export function checkSupportsRepeat(
  isOff: boolean,
  repeat: string | undefined,
  source: string | undefined,
  supportedFeatures: number | undefined
): boolean {
  return (
    !isOff &&
    repeat !== undefined &&
    !["optical", "aux"].includes(source?.toLowerCase() || "") &&
    supportedFeatures !== undefined &&
    (supportedFeatures & 262144) === 262144
  );
}