import { HaEnqueueMode } from "@components/HaSearch/types";
import { getEnqueueModeIcon } from "@components/MediaBrowser/utils";
import { useIntl } from "@components/i18n";
import type { OverlayMenuItem } from "@components/OverlayMenu/OverlayMenu";
import { useDebounce } from "@uidotdev/usehooks";
import { getHass } from "@utils";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { useLyrionBrowse } from "@hooks/useLyrionBrowse";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";
import type {
  LyrionBrowserItem,
  LyrionNavigationItem,
  LyrionCategoryType,
  SqueezeboxServerStatusResponse,
} from "@types";

export type BrowserRow =
  | LyrionBrowserItem[]
  | { sectionTitle: string; categoryId: LyrionCategoryType };

type BrowserHistoryEntry = LyrionNavigationItem & { filter: string };

const HOME_ENTRY: BrowserHistoryEntry = {
  id: "home",
  title: "Home",
  command: "",
  parameters: [],
  type: "category",
  filter: "",
};

// Category definitions for home screen
export const CATEGORIES: Array<{
  id: LyrionCategoryType;
  title: string;
  icon: string;
}> = [
  { id: "artists", title: "Artists", icon: "mdi:account-music" },
  {
    id: "albumartists",
    title: "Album Artists",
    icon: "mdi:account-music-outline",
  },
  { id: "albums", title: "Albums", icon: "mdi:album" },
  { id: "newmusic", title: "New Music", icon: "mdi:new-box" },
  { id: "genres", title: "Genres", icon: "mdi:music-box-multiple" },
  { id: "playlists", title: "Playlists", icon: "mdi:playlist-music" },
  { id: "tracks", title: "Tracks", icon: "mdi:music-note" },
  { id: "favorites", title: "Favorites", icon: "mdi:star" },
  { id: "radios", title: "Radio", icon: "mdi:radio" },
  { id: "apps", title: "Apps", icon: "mdi:apps" },
];

// Maps category IDs to their LMS command and extra parameters
const CATEGORY_COMMANDS: Partial<
  Record<LyrionCategoryType, { command: string; parameters: string[] }>
> = {
  tracks: { command: "titles", parameters: [] },
  albumartists: { command: "artists", parameters: ["role_id:ALBUMARTIST"] },
  newmusic: { command: "albums", parameters: ["sort:new"] },
};

/**
 * Build command and parameters based on navigation history
 */
function buildBrowseParams(
  history: LyrionNavigationItem[],
  startIndex: number = 0,
  searchTerm: string = "",
  appSearchItemId?: string
): {
  command: string;
  parameters: string[];
} {
  if (history.length === 0) {
    if (!searchTerm) return { command: "", parameters: [] };
    return {
      command: "search",
      parameters: ["0", "100", `term:${searchTerm}`, "extended:1"],
    };
  }

  const current = history[history.length - 1];
  const params = [startIndex.toString(), "100"]; // start, itemsPerResponse

  // For root categories, just use the command
  if (history.length === 1) {
    let command = current.command;

    // Favorites special case - use "favorites" command with "items" as parameter
    if (command === "favorites") {
      // For lyrion_cli, pass "items" as first parameter
      const favoriteParams = ["items", "0", "100", "want_url:1"];
      return { command: "favorites", parameters: favoriteParams };
    }

    // Add extra parameters from category mapping
    if (current.parameters.length > 0) {
      params.push(...current.parameters);
    }

    // Add search parameter if provided
    if (searchTerm) {
      params.push(`search:${searchTerm}`);
    }

    // Add item-type filters for direct navigation (e.g. from search results)
    if (current.type === "album" && command === "titles") {
      params.push(`album_id:${current.id}`);
    } else if (current.type === "artist" && command === "albums") {
      params.push(`artist_id:${current.id}`);
    }

    if (command === "artists") {
      params.push("tags:a");
    } else if (command === "albums") {
      params.push("tags:alj");
    } else if (command === "titles") {
      params.push("tags:altj");
    }
    return { command, parameters: params };
  }

  // Check if we're inside an app (any history entry has type "app")
  const appEntry = history.find((h) => h.type === "app");
  if (appEntry) {
    const appParams = ["items", startIndex.toString(), "100"];

    if (searchTerm && appSearchItemId) {
      // Search uses the app's search node
      appParams.push(`item_id:${appSearchItemId}`);
      appParams.push(`search:${searchTerm}`);
    } else if (current.type !== "app") {
      // Regular browsing deeper within app
      appParams.push(`item_id:${current.id}`);
    }

    return { command: appEntry.command, parameters: appParams };
  }

  // For nested navigation, find relevant filter entries from history
  let command = current.command;
  const playlistEntry = history.find((h) => h.type === "playlist");
  const genreEntry = history.find((h) => h.type === "genre");
  const artistEntry = history.find((h) => h.type === "artist");
  const albumEntry = history.find((h) => h.type === "album");

  // Playlists special case
  if (playlistEntry && current.command === "titles") {
    command = "playlists tracks";
    params[0] = playlistEntry.id; // playlist_id
    params[1] = startIndex.toString(); // start
    params[2] = "100"; // count
    if (searchTerm) {
      params.push(`search:${searchTerm}`);
    }
    params.push("tags:altj");
    return { command, parameters: params };
  }

  // Add search parameter for nested navigation
  if (searchTerm) {
    params.push(`search:${searchTerm}`);
  }

  // Genre -> Artists
  if (genreEntry && current.command === "artists") {
    params.push(`genre_id:${genreEntry.id}`);
    params.push("tags:a");
  }

  // Artist -> Albums
  if (artistEntry && current.command === "albums") {
    params.push(`artist_id:${artistEntry.id}`);
    params.push("tags:alj");
  }

  // Album -> Tracks
  if (current.command === "titles" && !playlistEntry) {
    if (albumEntry) {
      params.push(`album_id:${albumEntry.id}`);
    }
    params.push("tags:altj");
  }

  return { command, parameters: params };
}

/**
 * Build search term for LMS `playlist loadtracks` command
 */
function buildPlaylistSearchTerm(item: LyrionBrowserItem): string {
  switch (item.type) {
    case "track":
      return `track.id=${item.id}`;
    case "album":
      return `album.id=${item.id}`;
    case "artist":
      return `contributor.id=${item.id}`;
    case "playlist":
      return `playlist.id=${item.id}`;
    case "genre":
      return `genre.id=${item.id}`;
    default:
      return `track.id=${item.id}`;
  }
}

export const useLyrionMediaBrowserData = ({
  entity_id,
}: {
  entity_id: string;
}) => {
  const { t } = useIntl();

  // Single history state — each entry carries its own filter.
  // history[0] is always the home entry; navHistory = history.slice(1).
  const [history, setHistory] = useState<BrowserHistoryEntry[]>([HOME_ENTRY]);
  const navHistory = history.slice(1);
  const committedFilter = history[history.length - 1].filter;
  const [chunkSize, setChunkSize] = useState(4);
  const [startIndex, setStartIndex] = useState(0);
  const [accumulatedItems, setAccumulatedItems] = useState<
    LyrionBrowserItem[]
  >([]);
  const appSearchItemIdRef = useRef<string | undefined>();

  // Stable key that changes only on navigation, not on filter typing
  const navKey = navHistory.map((h) => h.id).join("/");

  // Local input state — updates immediately for responsive typing.
  // Debounced value syncs to history filter to trigger queries.
  const [inputValue, setInputValue] = useState(committedFilter);
  const debouncedInputValue = useDebounce(inputValue, 350);

  const commitFilter = useCallback((filter: string) => {
    setHistory((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        filter,
      };
      return updated;
    });
  }, []);

  // Sync debounced input to history filter
  useEffect(() => {
    commitFilter(debouncedInputValue);
  }, [debouncedInputValue, commitFilter]);

  // Reset input when navigating to a new page
  useEffect(() => {
    setInputValue(history[history.length - 1].filter);
  }, [navKey]);

  // Fetch server data
  const { data: serverData } =
    useHassMessagePromise<SqueezeboxServerStatusResponse>(
      {
        type: "call_service",
        domain: "lyrion_cli",
        service: "query",
        service_data: {
          command: "serverstatus",
          entity_id,
          parameters: ["-"],
        },
        return_response: true,
      },
      {
        staleTime: 600000, // 10 minutes
      }
    );

  // Build browse parameters from navigation history
  const { command, parameters } = useMemo(
    () =>
      buildBrowseParams(
        navHistory,
        startIndex,
        committedFilter,
        appSearchItemIdRef.current
      ),
    [navKey, startIndex, committedFilter]
  );

  // Fetch browse data
  const {
    items: rawItems,
    loading,
    totalCount,
    searchItemId,
  } = useLyrionBrowse({
    entity_id,
    command,
    parameters,
    serverData,
    enabled: navHistory.length > 0 || !!committedFilter,
  });

  // Capture app search item id when browsing app root
  useEffect(() => {
    const appEntry = navHistory.find((h) => h.type === "app");
    if (!appEntry) {
      appSearchItemIdRef.current = undefined;
    } else if (searchItemId) {
      appSearchItemIdRef.current = searchItemId;
    }
  }, [navKey, searchItemId]);

  // Reset pagination when navigation changes
  useEffect(() => {
    setStartIndex(0);
    setAccumulatedItems([]);
  }, [navKey, committedFilter]);

  // Accumulate items when new data is fetched
  useEffect(() => {
    if (rawItems.length > 0) {
      if (startIndex === 0) {
        // First page, replace items
        setAccumulatedItems(rawItems);
      } else {
        // Subsequent pages, append items
        setAccumulatedItems((prev) => [...prev, ...rawItems]);
      }
    }
  }, [rawItems, startIndex]);

  // Show categories on home screen
  const isHomeScreen = navHistory.length === 0;
  const categoryItems: LyrionBrowserItem[] = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        id: cat.id,
        title: cat.title,
        type: "category" as const,
        can_play: false,
        can_expand: true,
      })),
    []
  );

  const isShowingCategories = isHomeScreen && !committedFilter;
  const isGlobalSearch = isHomeScreen && !!committedFilter;
  const displayItems = isShowingCategories ? categoryItems : accumulatedItems;

  // Determine if the current route supports search
  const isSearchable = useMemo(() => {
    if (navHistory.length === 0) return true;
    const current = navHistory[navHistory.length - 1];
    if (current.command === "favorites") return false;
    const appEntry = navHistory.find((h) => h.type === "app");
    if (appEntry && !appSearchItemIdRef.current && !searchItemId) return false;
    return true;
  }, [navKey, searchItemId]);

  // Check if there are more items to load
  const hasMore = accumulatedItems.length < totalCount && !isShowingCategories;

  // Load more items
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setStartIndex(accumulatedItems.length);
    }
  }, [loading, hasMore, accumulatedItems.length]);


  // Group items into rows for grid rendering
  const { items, hasNoArtwork } = useMemo(() => {
    let hasNoArtwork = true;
    const result: BrowserRow[] = [];

    // Check artwork across all items
    displayItems.forEach((item) => {
      if (typeof item.thumbnail === "string") hasNoArtwork = false;
    });

    if (isGlobalSearch) {
      // Group search results by type with section titles
      const sections: Array<{
        title: string;
        categoryId: LyrionCategoryType;
        items: LyrionBrowserItem[];
        isTrack: boolean;
      }> = [
        {
          title: "Artists",
          categoryId: "artists",
          items: displayItems.filter((i) => i.type === "artist"),
          isTrack: false,
        },
        {
          title: "Albums",
          categoryId: "albums",
          items: displayItems.filter((i) => i.type === "album"),
          isTrack: false,
        },
        {
          title: "Tracks",
          categoryId: "tracks",
          items: displayItems.filter((i) => i.type === "track"),
          isTrack: true,
        },
      ];

      const maxPerSection = chunkSize * 2;

      for (const section of sections) {
        if (section.items.length === 0) continue;
        result.push({
          sectionTitle: section.title,
          categoryId: section.categoryId,
        });
        const limited = section.items.slice(0, maxPerSection);
        if (section.isTrack) {
          limited.forEach((item) => result.push([item]));
        } else {
          for (let i = 0; i < limited.length; i += chunkSize) {
            result.push(limited.slice(i, i + chunkSize));
          }
        }
      }
    } else {
      // Standard grouping: expandable items in grid rows, tracks individually
      const groupedByType: Record<
        "track" | "expandable",
        LyrionBrowserItem[]
      > = {
        track: [],
        expandable: [],
      };

      displayItems.forEach((item) => {
        const isTrack = item.type === "track" && !isShowingCategories;
        groupedByType[isTrack ? "track" : "expandable"].push(item);
      });

      Object.entries(groupedByType).forEach(([mediaType, items]) => {
        if (mediaType === "track" && !isShowingCategories) {
          items.forEach((item) => result.push([item]));
        } else {
          for (let i = 0; i < items.length; i += chunkSize) {
            result.push(items.slice(i, i + chunkSize));
          }
        }
      });
    }

    return { items: result, hasNoArtwork };
  }, [displayItems, chunkSize, isShowingCategories, isGlobalSearch]);

  const playItem = useCallback(
    (item: LyrionBrowserItem, enqueue?: HaEnqueueMode) => {
      let action = "loadtracks";
      if (enqueue === "next") action = "inserttracks";
      else if (enqueue === "add") action = "addtracks";

      const appEntry = navHistory.find((h) => h.type === "app");

      try {
        if (appEntry) {
          // App items: use app command with playlist action
          const appAction =
            action === "loadtracks"
              ? "play"
              : action === "inserttracks"
                ? "insert"
                : "add";
          getHass().callService("lyrion_cli", "method", {
            entity_id,
            command: appEntry.command,
            parameters: ["playlist", appAction, `item_id:${item.id}`],
          });
        } else {
          // Library items: use playlist loadtracks/addtracks/inserttracks
          getHass().callService("lyrion_cli", "method", {
            entity_id,
            command: "playlist",
            parameters: [action, buildPlaylistSearchTerm(item)],
          });
        }
      } catch (error) {
        console.error("Error playing media item:", error);
      }
    },
    [entity_id, navKey]
  );

  const onItemClick = useCallback(
    (item: LyrionBrowserItem) => {
      if (loading) return;

      // Category selection (home screen)
      if (item.type === "category") {
        const categoryId = item.id as LyrionCategoryType;
        const mapping = CATEGORY_COMMANDS[categoryId];
        setHistory((prev) => [
          prev[0],
          {
            id: categoryId,
            title: item.title,
            command: mapping?.command ?? categoryId,
            parameters: mapping?.parameters ?? [],
            type: item.type,
            filter: "",
          },
        ]);
        return;
      }

      // App selection (from apps list)
      if (item.type === "app") {
        setHistory((prev) => [
          ...prev,
          {
            id: item.id,
            title: item.title,
            command: item.id, // The app's cmd IS its id
            parameters: [],
            type: "app" as const,
            filter: "",
          },
        ]);
        return;
      }

      // Check if we're browsing within an app
      const appEntry = navHistory.find((h) => h.type === "app");
      if (appEntry && item.can_expand) {
        setHistory((prev) => [
          ...prev,
          {
            id: item.id,
            title: item.title,
            command: appEntry.command,
            parameters: [],
            type: item.type,
            filter: "",
          },
        ]);
        return;
      }

      // Navigate deeper
      if (item.can_expand) {
        let nextCommand = "";

        // Determine next command based on current item type
        switch (item.type) {
          case "genre":
            nextCommand = "artists";
            break;
          case "artist":
            nextCommand = "albums";
            break;
          case "album":
          case "playlist":
            nextCommand = "titles";
            break;
          default:
            return;
        }

        setHistory((prev) => [
          ...prev,
          {
            id: item.id,
            title: item.title,
            command: nextCommand,
            parameters: [],
            type: item.type,
            filter: "",
          },
        ]);
      }
    },
    [loading, navKey]
  );

  const goBack = useCallback(() => {
    if (loading || navHistory.length === 0) return;
    setHistory((prev) => prev.slice(0, -1));
  }, [navHistory.length, loading]);

  const goToIndex = useCallback(
    (navIndex: number) => {
      if (loading) return;
      // +2: one for home entry, one because slice end is exclusive
      setHistory((prev) => prev.slice(0, navIndex + 2));
    },
    [loading]
  );

  const goHome = useCallback(() => {
    setHistory((prev) => [prev[0]]);
  }, []);

  const getItemOverlayMenuItems = useCallback(
    (item: LyrionBrowserItem, excludeExpandOptions = false) => {
      const menuItems: OverlayMenuItem[] = [];

      if (item.can_play) {
        menuItems.push({
          label: t({
            id: "MediaBrowser.media_item_menu.enqueue_mode.play",
            defaultMessage: "Play",
          }),
          icon: getEnqueueModeIcon("play"),
          onClick: () => playItem(item),
        });
        menuItems.push({
          label: t({
            id: "MediaBrowser.media_item_menu.enqueue_dropdown_label",
            defaultMessage: "Enqueue",
          }),
          icon: getEnqueueModeIcon("next"),
          children: [
            {
              label: t({
                id: "MediaBrowser.media_item_menu.enqueue_mode.next",
                defaultMessage: "Play Next",
              }),
              icon: getEnqueueModeIcon("next"),
              onClick: () => playItem(item, "next"),
            },
            {
              label: t({
                id: "MediaBrowser.media_item_menu.enqueue_mode.replace",
                defaultMessage: "Replace Queue",
              }),
              icon: getEnqueueModeIcon("replace"),
              onClick: () => playItem(item, "replace"),
            },
            {
              label: t({
                id: "MediaBrowser.media_item_menu.enqueue_mode.add",
                defaultMessage: "Add to Queue",
              }),
              icon: getEnqueueModeIcon("add"),
              onClick: () => playItem(item, "add"),
            },
          ],
        });
      }

      if (item.can_expand && !excludeExpandOptions) {
        menuItems.push({
          label: t({
            id: "MediaBrowser.media_item_menu.browse",
            defaultMessage: "Browse",
          }),
          icon: "mdi:folder-outline",
          onClick: () => onItemClick(item),
        });
      }

      return menuItems;
    },
    [playItem, onItemClick, t]
  );

  const currentHistoryDropdownMenuItems: OverlayMenuItem[] = useMemo(() => {
    const current = navHistory[navHistory.length - 1];
    return current
      ? getItemOverlayMenuItems(
          {
            id: current.id,
            title: current.title,
            type: current.type,
            can_play: current.type !== "category" && current.type !== "app",
            can_expand: false,
          },
          true
        )
      : [];
  }, [navKey, getItemOverlayMenuItems]);

  const navigateToSearchCategory = useCallback(
    (categoryId: LyrionCategoryType) => {
      const cat = CATEGORIES.find((c) => c.id === categoryId)!;
      const mapping = CATEGORY_COMMANDS[categoryId];
      setHistory((prev) => [
        prev[0],
        {
          id: categoryId,
          title: cat.title,
          command: mapping?.command ?? categoryId,
          parameters: mapping?.parameters ?? [],
          type: "category" as const,
          // Carry filter forward from current level
          filter: prev[prev.length - 1].filter,
        },
      ]);
    },
    []
  );

  return {
    navHistory,
    currentFilter: inputValue,
    setCurrentFilter: setInputValue,
    isSearchable,
    isShowingCategories,
    items,
    hasNoArtwork,
    loading,
    hasMore,
    loadMore,
    chunkSize,
    setChunkSize,
    onItemClick,
    goBack,
    goToIndex,
    goHome,
    getItemOverlayMenuItems,
    currentHistoryDropdownMenuItems,
    navigateToSearchCategory,
    filteredItems:displayItems,
  };
};
