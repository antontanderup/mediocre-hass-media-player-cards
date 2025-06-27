import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import {
  HaEnqueueMode,
  // HaFilterConfig,
  // HaFilterResult,
  HaFilterType,
  HaMediaItem,
  HaSearchResponse,
} from "./types";

export const useSearchQuery = (
  debounceQuery: string,
  filter: HaFilterType,
  targetEntity: string
  // filterConfig: HaFilterConfig[]
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
        media_content_type: filter === "all" ? undefined : filter,
      },
      return_response: true,
    };

    const hass = getHass();
    setLoading(true);

    hass.connection
      .sendMessagePromise(message)
      .then(res => {
        const response = res as {
          response: { [key: string]: HaSearchResponse };
        };
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

  // const resultsParsed: HaFilterResult = useMemo(() => {
  //   if (filter !== "all") {
  //     const config = filterConfig.find(item => item.media_type === filter);
  //     if (!config) {
  //       return [];
  //     }
  //     return [
  //       {
  //         media_type: config?.media_type ?? filter,
  //         name:
  //           config.name ??
  //           config.media_type.charAt(0).toUpperCase() +
  //             config.media_type.slice(1),
  //         icon: config.icon,
  //         results: results?.result ?? [],
  //       },
  //     ];
  //   }
  //   return filterConfig.map(config => {
  //     const filteredResults =
  //       results?.result.filter(
  //         item =>
  //           item.media_content_type === config.media_type ||
  //           item.media_content_type === config.media_type.slice(0, -1) ||
  //           item.media_class === config.media_type
  //       ) ?? [];
  //     return {
  //       media_type: config.media_type,
  //       name:
  //         config.name ??
  //         config.media_type.charAt(0).toUpperCase() +
  //           config.media_type.slice(1),
  //       icon: config.icon,
  //       results: filteredResults,
  //     };
  //   });
  // }, [results]);

  return useMemo(
    () => ({ results: results?.result ?? [], loading, playItem, error }),
    [results, loading, error]
  );
};
