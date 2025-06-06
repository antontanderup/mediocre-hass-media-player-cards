import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import {
  MaFilterType,
  MaMediaItem,
  MaMediaType,
  MaSearchResponse,
} from "./types";
import { responseKeyMediaTypeMap } from "./constants";

export const useFavorites = (filter: MaFilterType, enabled: boolean) => {
  const [configEntry, setConfigEntry] = useState(null);
  const [results, setResults] = useState<MaSearchResponse | null>();
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
    if (!configEntry || !enabled) {
      setResults(null);
      return;
    }
    setLoading(true);

    const newResults: MaSearchResponse = {
      artists: [],
      albums: [],
      tracks: [],
      playlists: [],
      radio: [],
      podcasts: [],
      audiobooks: [],
    };

    const getResult = async (mediaType: MaMediaType) => {
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_library",
        service_data: {
          config_entry_id: configEntry,
          media_type: mediaType,
          favorite: true,
          limit: filter === "all" ? 8 : 20,
        },
        return_response: true,
      };

      const hass = getHass();
      try {
        const res = await hass.connection.sendMessagePromise(message);
        const response = res as { response: { items: MaMediaItem[] } };
        if (!response.response) {
          return;
        }
        // @ts-expect-error we must trust the response here
        newResults[mediaTypeResponseKeyMap[mediaType]] =
          response.response.items ?? [];
      } catch (e) {
        console.error("Error fetching favorites:", mediaType, e);
        return Promise.reject(e);
      }
    };

    if (filter === "all") {
      Promise.all(
        Object.values(responseKeyMediaTypeMap).map(mediaType =>
          getResult(mediaType)
        )
      ).then(() => {
        setLoading(false);
        setResults(newResults);
      });
    } else {
      getResult(filter).then(() => {
        setLoading(false);
        setResults(newResults);
      });
    }
  }, [configEntry, filter]);

  return useMemo(() => ({ favorites: results, loading }), [results, loading]);
};

const mediaTypeResponseKeyMap: {
  [K in MaMediaType]: keyof MaSearchResponse;
} = {
  artist: "artists",
  album: "albums",
  track: "tracks",
  playlist: "playlists",
  radio: "radio",
  audiobook: "audiobooks",
  podcast: "podcasts",
};
