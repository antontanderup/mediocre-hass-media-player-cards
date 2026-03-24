import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { getHassMessageWithCache } from "@utils/getHassMessageWithCache";
import {
  MaFilterType,
  MaMediaItem,
  MaMediaType,
  MaSearchResponse,
} from "./types";
import { musicMediaTypes, responseKeyMediaTypeMap } from "./constants";

export const useLibrary = (
  filter: MaFilterType,
  options: {
    enabled: boolean;
    favorite?: boolean;
    search?: string;
    limit?: number;
  }
) => {
  const [configEntry, setConfigEntry] = useState(null);
  const [results, setResults] = useState<MaSearchResponse | null>();
  const [loading, setLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const {
    enabled,
    favorite = false,
    search = "",
    limit = filter === "all" ? 8 : filter === "music" ? 20 : 100,
  } = options;

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
      setCanLoadMore(false);
      return;
    }
    let isCancelled = false;
    setResults(null);
    setCanLoadMore(false);
    setLoading(true);

    const newResults: MaSearchResponse = {
      artists: [],
      albums: [],
      tracks: [],
      playlists: [],
      radio: [],
      genres: [],
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
          favorite: favorite || undefined,
          search: search || undefined,
          limit,
        },
        return_response: true,
      };
      try {
        const res = await getHassMessageWithCache<{
          response: { items: MaMediaItem[] };
        }>(message, { staleTime: 120000 });
        if (!res.response) {
          return false;
        }
        // @ts-expect-error we must trust the response here
        newResults[mediaTypeResponseKeyMap[mediaType]] = res.response.items ?? [];
        return (res.response.items?.length ?? 0) >= limit;
      } catch (e) {
        console.error(
          favorite
            ? "Error fetching favorite items:"
            : "Error fetching library items:",
          mediaType,
          e
        );
        return false;
      }
    };

    if (filter === "all") {
      Promise.all(
        Object.values(responseKeyMediaTypeMap).map(mediaType =>
          getResult(mediaType)
        )
      ).then(hasMore => {
        if (isCancelled) return;
        setLoading(false);
        setCanLoadMore(hasMore.some(Boolean));
        setResults(newResults);
      });
    } else if (filter === "music") {
      Promise.all(musicMediaTypes.map(mediaType => getResult(mediaType))).then(
        hasMore => {
          if (isCancelled) return;
          setLoading(false);
          setCanLoadMore(hasMore.some(Boolean));
          setResults(newResults);
        }
      );
    } else {
      getResult(filter).then(hasMore => {
        if (isCancelled) return;
        setLoading(false);
        setCanLoadMore(Boolean(hasMore));
        setResults(newResults);
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [configEntry, filter, enabled, favorite, limit, search]);

  return useMemo(
    () => ({ library: results, loading, canLoadMore }),
    [results, loading, canLoadMore]
  );
};

const mediaTypeResponseKeyMap: {
  [K in MaMediaType]: keyof MaSearchResponse;
} = {
  artist: "artists",
  album: "albums",
  track: "tracks",
  playlist: "playlists",
  radio: "radio",
  genre: "genres",
  audiobook: "audiobooks",
  podcast: "podcasts",
};
