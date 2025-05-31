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
      .then(
        (response: {
          response: {
            response: { [key: string]: { children: HaMediaItem[] } };
          };
        }) => {
          if (!response.response[targetEntity]) {
            return;
          }
          setIsFetching(false);
          setMediaItems(response.response[targetEntity].children);
        }
      )
      .catch(err => {
        console.error("Error fetching search results:", err);
        setIsFetching(false);
        setMediaItems(null);
      });
  }, [targetEntity, enabled]);

  return useMemo(
    () => ({ favorites: mediaItems, isFetching }),
    [mediaItems, isFetching]
  );
};
