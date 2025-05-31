import { useEffect, useMemo, useState } from "preact/hooks";
import { HaMediaItem } from "./types";
import { getHass } from "@utils";

export const useMediaBrowserFavorites = (
  targetEntity: string,
  enabled = false
) => {
  const [mediaItems, setMediaItems] = useState<HaMediaItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const fetchMediaItems = async () => {
      setIsFetching(true);
      try {
        const hass = getHass();
        const response = (await hass.callWS({
          type: "media_player/browse_media",
          entity_id: targetEntity,
          media_content_type: "favorites",
        })) as { children?: HaMediaItem[] };

        if (response && response.children) {
          setMediaItems(response.children);
        } else {
          setMediaItems([]);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
      }
      setIsFetching(false);
    };

    fetchMediaItems();
  }, [enabled, targetEntity]);

  return useMemo(
    () => ({ favorites: mediaItems, isFetching }),
    [mediaItems, isFetching]
  );
};
