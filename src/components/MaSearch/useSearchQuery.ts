import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { MaFilterType, MaSearchResponse } from "./types";

export const useSearchQuery = (debounceQuery: string, filter: MaFilterType) => {
  const [configEntry, setConfigEntry] = useState(null);
  const [results, setResults] = useState<MaSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hass = getHass();
    hass
      .callApi("GET", "config/config_entries/entry")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((entries: any[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = entries.find((entry: any) => {
          return entry.domain === "music_assistant";
        });
        if (entry) {
          setConfigEntry(entry.entry_id);
        }
      });
  }, []);

  useEffect(() => {
    if (debounceQuery === "" || !configEntry) return;

    const message = {
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
    };

    const hass = getHass();
    setLoading(true);

    hass.connection
      .sendMessagePromise(message)
      .then((response: { response: MaSearchResponse }) => {
        if (!response.response) {
          return;
        }
        setLoading(false);
        setResults(response.response);
      });
  }, [debounceQuery, configEntry, filter]);

  return useMemo(() => ({ results, loading }), [results, loading]);
};
