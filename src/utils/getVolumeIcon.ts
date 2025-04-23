export const getVolumeIcon = (volume: number, volumeMuted: boolean) => {
  if (volume === 0 || volumeMuted) return "mdi:volume-off";
  if (volume < 0.5) return "mdi:volume-medium";
  return "mdi:volume-high";
};
