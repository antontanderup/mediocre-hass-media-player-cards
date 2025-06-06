import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { MaFilterType, MaMediaItem } from "./types";

export const useFavorites = (filter: MaFilterType, enabled: boolean) => {
  const [configEntry, setConfigEntry] = useState(null);
  const [results, setResults] = useState<MaMediaItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (filter === "all" || !configEntry || !enabled) {
      setResults([]);
      return;
    }

    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "get_library",
      service_data: {
        config_entry_id: configEntry,
        media_type: filter,
        favorite: true,
        limit: 20,
      },
      return_response: true,
    };

    const hass = getHass();
    setLoading(true);

    hass.connection.sendMessagePromise(message).then(res => {
      const response = res as { response: { items: MaMediaItem[] } };
      if (!response.response) {
        return;
      }
      setLoading(false);
      setResults(response.response.items ?? []);
    });
  }, [configEntry, filter]);

  return useMemo(() => ({ favorites: results, loading }), [results, loading]);
};
