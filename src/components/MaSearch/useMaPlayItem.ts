import { useCallback } from "preact/hooks";
import { getHass } from "@utils";
import { MaEnqueueMode, MaMediaItem } from "./types";

export const useMaPlayItem = () => {
  return useCallback(
    async (item: MaMediaItem, targetEntity: string, enqueue: MaEnqueueMode) => {
      const hass = getHass();
      return hass.callService("music_assistant", "play_media", {
        entity_id: targetEntity,
        media_type: item.media_type,
        media_id: item.uri,
        enqueue,
      });
    },
    []
  );
};
