import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import {
  MaEnqueueMode,
  MaFilterType,
  MaMediaItem,
  MaSearchResponse,
} from "./types";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";

export const useSearchQuery = (debounceQuery: string, filter: MaFilterType) => {
  const [configEntry, setConfigEntry] = useState(null);

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
        media_type: filter === "all" ? undefined : filter,
        limit: filter === "all" ? 8 : 100,
      },
      return_response: true,
    },
    {
      enabled: debounceQuery !== "" && !!configEntry,
      staleTime: 120000, // 2 minutes
    }
  );

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

  return useMemo(() => ({ results: data, loading, playItem }), [data, loading]);
};
