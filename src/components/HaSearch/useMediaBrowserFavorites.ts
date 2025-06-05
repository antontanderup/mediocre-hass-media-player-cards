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
    if (!enabled) {
      setMediaItems([]);
      return;
    }
    const message = {
      type: "call_service",
      domain: "media_player",
      service: "browse_media",
      service_data: {
        entity_id: targetEntity,
        media_content_type: "favorites",
      },
      return_response: true,
    };

    const hass = getHass();
    setIsFetching(true);

    hass.connection
      .sendMessagePromise(message)
      .then(res => {
        const response = res as {
          response: { [key: string]: { children: HaMediaItem[] } };
        };
        if (!response.response[targetEntity]) {
          return;
        }
        setIsFetching(false);
        setMediaItems(
          response.response[targetEntity].children.filter(item => item.can_play)
        );
      })
      .catch(err => {
        console.error("Error fetching search results:", err);
        setIsFetching(false);
        setMediaItems([]);
      });
  }, [targetEntity, enabled]);

  return useMemo(
    () => ({ favorites: mediaItems, isFetching }),
    [mediaItems, isFetching]
  );
};
