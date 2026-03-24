import { MediocreMultiMediaPlayer, MediocreMultiMediaPlayerCardConfig } from "@types";

export const getResolvedMultiMediaPlayer = (
  config: Pick<MediocreMultiMediaPlayerCardConfig, "media_browser">,
  player?: MediocreMultiMediaPlayer
): MediocreMultiMediaPlayer | undefined => {
  if (!player) {
    return undefined;
  }

  return {
    ...player,
    media_browser: player.media_browser ?? config.media_browser,
  };
};
