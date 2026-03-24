import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import {
  MaEnqueueMode,
  MaFilterType,
  MaMediaItem,
  MaSearchResponse,
} from "./types";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";
import { musicMediaTypes } from "./constants";

export const useSearchQuery = (
  debounceQuery: string,
  filter: MaFilterType,
  options?: {
    enabled?: boolean;
    limit?: number;
    libraryOnly?: boolean;
  }
) => {
  const [configEntry, setConfigEntry] = useState(null);
  const { limit = filter === "all" ? 8 : filter === "music" ? 24 : 100 } =
    options ?? {};

  useEffect(() => {
    const hass = getHass();
    hass.callApi("GET", "config/config_entries/entry").then(entries => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const maEntries = (entries as any[]).filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry: any) => entry.domain === "music_assistant"
      );
      const entry = maEntries.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry: any) => entry.state === "loaded"
      );
      if (entry) {
        setConfigEntry(entry.entry_id);
      }
    });
  }, []);

  const { data, loading } = useHassMessagePromise<MaSearchResponse>(
    {
      type: "call_service",
      domain: "music_assistant",
      service: "search",
      service_data: {
        name: debounceQuery,
        config_entry_id: configEntry,
        media_type:
          filter === "all"
            ? undefined
            : filter === "music"
              ? musicMediaTypes
              : [filter],
        limit,
        library_only: options?.libraryOnly || undefined,
      },
      return_response: true,
    },
    {
      enabled: debounceQuery !== "" && !!configEntry && (options?.enabled ?? true),
      staleTime: 120000,
    }
  );

  const canLoadMore = useMemo(() => {
    if (!data) return false;
    return Object.values(data).some(
      items => Array.isArray(items) && items.length >= limit
    );
  }, [data, limit]);

  const playItem = useCallback(
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

  return useMemo(
    () => ({ results: data, loading, playItem, canLoadMore }),
    [data, loading, playItem, canLoadMore]
  );
};
