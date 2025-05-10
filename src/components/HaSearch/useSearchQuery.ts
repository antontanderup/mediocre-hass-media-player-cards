import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import {
  HaEnqueueMode,
  HaFilterType,
  HaMediaItem,
  HaSearchResponse,
} from "./types";

export const useSearchQuery = (
  debounceQuery: string,
  filter: HaFilterType,
  targetEntity: string
) => {
  const [results, setResults] = useState<HaSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debounceQuery === "") return;

    const message = {
      type: "call_service",
      domain: "media_player",
      service: "search_media",
      service_data: {
        search_query: debounceQuery,
        entity_id: targetEntity,
        media_filter_classes: filter === "all" ? undefined : [filter],
      },
      return_response: true,
    };

    const hass = getHass();
    setLoading(true);

    hass.connection
      .sendMessagePromise(message)
      .then((response: { response: HaSearchResponse }) => {
        if (!response.response[targetEntity]) {
          return;
        }
        setLoading(false);
        setResults(response.response[targetEntity]);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching search results:", err);
        setLoading(false);
        setError("Error fetching search results: " + err.message);
        setResults(null);
      });
  }, [debounceQuery, targetEntity, filter]);

  const playItem = useCallback(
    async (item: HaMediaItem, targetEntity: string, enqueue: HaEnqueueMode) => {
      const hass = getHass();
      return hass.callService("media_player", "play_media", {
        entity_id: targetEntity,
        media_content_type: item.media_content_type,
        media_content_id: item.media_content_id,
        enqueue,
      });
    },
    []
  );

  return useMemo(
    () => ({ results, loading, playItem, error }),
    [results, loading, error]
  );
};
