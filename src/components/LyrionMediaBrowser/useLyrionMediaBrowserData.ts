import { HaEnqueueMode } from "@components/HaSearch/types";
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
import { useLyrionBrowse } from "./useLyrionBrowse";
import { useLyrionGlobalSearch } from "./useLyrionGlobalSearch";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";
import type { SqueezeboxServerStatusResponse } from "@types";
import type { LyrionBrowserItem, LyrionCategoryType } from "./types";
import {
  type BrowserHistoryEntry,
  CATEGORIES,
  CATEGORY_COMMANDS,
  HOME_ENTRY,
} from "./constants";
import { buildBrowseParams, buildPlaylistSearchTerm } from "./utils";
import { getEnqueueModeIcon } from "@components/HaMediaBrowser";

export type BrowserRow =
  | LyrionBrowserItem[]
  | { sectionTitle: string; categoryId: LyrionCategoryType };

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
  const [accumulatedItems, setAccumulatedItems] = useState<LyrionBrowserItem[]>(
    []
  );
  const appSearchItemIdRef = useRef<string | undefined>();

  // Stable key that changes only on navigation, not on filter typing
  const navKey = navHistory.map(h => h.id).join("/");

  // Local input state — updates immediately for responsive typing.
  // Debounced value syncs to history filter to trigger queries.
  const [inputValue, setInputValue] = useState(committedFilter);
  const debouncedInputValue = useDebounce(inputValue, 350);

  const commitFilter = useCallback((filter: string) => {
    setHistory(prev => {
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

  // Detect global search before hook calls (hooks must be unconditional)
  const isHomeScreen = navHistory.length === 0;
  const isGlobalSearch = isHomeScreen && !!committedFilter;

  // Global search: parallel category-specific queries with full metadata
  const {
    items: globalSearchItems,
    loading: globalSearchLoading,
    totalCount: globalSearchTotalCount,
  } = useLyrionGlobalSearch({
    entity_id,
    searchTerm: committedFilter,
    serverData,
    enabled: isGlobalSearch,
  });

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

  // Fetch browse data (disabled during global search)
  const {
    items: rawItems,
    loading: browseLoading,
    totalCount: browseTotalCount,
    searchItemId,
  } = useLyrionBrowse({
    entity_id,
    command,
    parameters,
    serverData,
    enabled: !isGlobalSearch && (navHistory.length > 0 || !!committedFilter),
  });

  // Capture app search item id when browsing app root
  useEffect(() => {
    const appEntry = navHistory.find(h => h.type === "app");
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

  // Accumulate items when new data is fetched (not used for global search)
  useEffect(() => {
    if (isGlobalSearch) return;
    if (rawItems.length > 0) {
      if (startIndex === 0) {
        setAccumulatedItems(rawItems);
      } else {
        setAccumulatedItems(prev => [...prev, ...rawItems]);
      }
    }
  }, [rawItems, startIndex, isGlobalSearch]);

  // Derived loading/totalCount based on active search mode
  const loading = isGlobalSearch ? globalSearchLoading : browseLoading;
  const totalCount = isGlobalSearch ? globalSearchTotalCount : browseTotalCount;

  // Show categories on home screen
  const categoryItems: LyrionBrowserItem[] = useMemo(
    () =>
      CATEGORIES.map(cat => ({
        id: cat.id,
        title: cat.title,
        type: "category" as const,
        can_play: false,
        can_expand: true,
      })),
    []
  );

  const isShowingCategories = isHomeScreen && !committedFilter;
  const displayItems = isShowingCategories
    ? categoryItems
    : isGlobalSearch
      ? globalSearchItems
      : accumulatedItems;

  // Determine if the current route supports search
  const isSearchable = useMemo(() => {
    if (navHistory.length === 0) return true;
    const current = navHistory[navHistory.length - 1];
    if (current.command === "favorites") return false;
    const appEntry = navHistory.find(h => h.type === "app");
    if (appEntry && !appSearchItemIdRef.current && !searchItemId) return false;
    return true;
  }, [navKey, searchItemId]);

  // Check if there are more items to load (global search uses section headers to navigate)
  const hasMore =
    !isGlobalSearch &&
    accumulatedItems.length < totalCount &&
    !isShowingCategories;

  // Load more items
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setStartIndex(accumulatedItems.length);
    }
  }, [loading, hasMore, accumulatedItems.length]);

  const playItem = useCallback(
    (item: LyrionBrowserItem, enqueue?: HaEnqueueMode) => {
      let action = "loadtracks";
      if (enqueue === "next") action = "inserttracks";
      else if (enqueue === "add") action = "addtracks";

      const appEntry = navHistory.find(h => h.type === "app");
      const isFavorite = navHistory.find(h => h.command === "favorites");
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
        } else if (isFavorite) {
          const appAction =
            action === "loadtracks"
              ? "play"
              : action === "inserttracks"
                ? "insert"
                : "add";
          getHass().callService("lyrion_cli", "method", {
            entity_id,
            command: "favorites",
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
        setHistory(prev => [
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
        setHistory(prev => [
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
      const appEntry = navHistory.find(h => h.type === "app");
      if (appEntry && item.can_expand) {
        setHistory(prev => [
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

        setHistory(prev => [
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

  // Attach onClick and menuItems to each display item
  const enrichedDisplayItems = useMemo(
    () =>
      displayItems.map(item => ({
        ...item,
        onClick: () => onItemClick(item),
        menuItems: getItemOverlayMenuItems(item),
      })),
    [displayItems, onItemClick, getItemOverlayMenuItems]
  );

  // Group items into rows for grid rendering
  const { items, hasNoArtwork } = useMemo(() => {
    let hasNoArtwork = true;
    const result: BrowserRow[] = [];

    // Check artwork across all items
    enrichedDisplayItems.forEach(item => {
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
          items: enrichedDisplayItems.filter(i => i.type === "artist"),
          isTrack: false,
        },
        {
          title: "Albums",
          categoryId: "albums",
          items: enrichedDisplayItems.filter(i => i.type === "album"),
          isTrack: false,
        },
        {
          title: "Tracks",
          categoryId: "tracks",
          items: enrichedDisplayItems.filter(i => i.type === "track"),
          isTrack: true,
        },
        {
          title: "Playlists",
          categoryId: "playlists",
          items: enrichedDisplayItems.filter(i => i.type === "playlist"),
          isTrack: false,
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
          limited.forEach(item => result.push([item]));
        } else {
          for (let i = 0; i < limited.length; i += chunkSize) {
            result.push(limited.slice(i, i + chunkSize));
          }
        }
      }
    } else {
      // Standard grouping: expandable items in grid rows, tracks individually
      const groupedByType: Record<"track" | "expandable", LyrionBrowserItem[]> =
        {
          track: [],
          expandable: [],
        };

      enrichedDisplayItems.forEach(item => {
        const isTrack = item.type === "track" && !isShowingCategories;
        groupedByType[isTrack ? "track" : "expandable"].push(item);
      });

      Object.entries(groupedByType).forEach(([mediaType, items]) => {
        if (mediaType === "track" && !isShowingCategories) {
          items.forEach(item => result.push([item]));
        } else {
          for (let i = 0; i < items.length; i += chunkSize) {
            result.push(items.slice(i, i + chunkSize));
          }
        }
      });
    }

    return { items: result, hasNoArtwork };
  }, [enrichedDisplayItems, chunkSize, isShowingCategories, isGlobalSearch]);

  const goBack = useCallback(() => {
    if (loading || navHistory.length === 0) return;
    setHistory(prev => prev.slice(0, -1));
  }, [navHistory.length, loading]);

  const goToIndex = useCallback(
    (navIndex: number) => {
      if (loading) return;
      // +2: one for home entry, one because slice end is exclusive
      setHistory(prev => prev.slice(0, navIndex + 2));
    },
    [loading]
  );

  const goHome = useCallback(() => {
    setInputValue("");
    setHistory(prev => [prev[0]]);
  }, []);

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
      const cat = CATEGORIES.find(c => c.id === categoryId)!;
      const mapping = CATEGORY_COMMANDS[categoryId];
      setHistory(prev => [
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
    goBack,
    goToIndex,
    goHome,
    currentHistoryDropdownMenuItems,
    navigateToSearchCategory,
    filteredItems: enrichedDisplayItems,
  };
};
