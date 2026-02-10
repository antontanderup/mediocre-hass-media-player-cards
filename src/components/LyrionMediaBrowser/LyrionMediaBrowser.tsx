import {
  Chip,
  Icon,
  Input,
  MediaGrid,
  MediaItem,
  MediaTrack,
  searchStyles,
  Spinner,
  VirtualList,
} from "@components";
import { HaEnqueueMode } from "@components/HaSearch/types";
import { IconButton } from "@components/IconButton";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import { css } from "@emotion/react";
import { useDebounce } from "@uidotdev/usehooks";
import { getHass } from "@utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { getEnqueueModeIcon } from "@components/MediaBrowser/utils";
import { MediaSectionTitle } from "@components/MediaSearch";
import { useIntl } from "@components/i18n";
import { useLyrionBrowse } from "@hooks/useLyrionBrowse";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";
import type {
  LyrionBrowserItem,
  LyrionNavigationItem,
  LyrionCategoryType,
  SqueezeboxServerStatusResponse,
} from "@types";

export type LyrionMediaBrowserProps = {
  entity_id: string;
  horizontalPadding?: number;
  maxHeight?: number;
  renderHeader?: () => preact.JSX.Element;
};

type BrowserRow =
  | LyrionBrowserItem[]
  | { sectionTitle: string; categoryId: LyrionCategoryType };

const styles = {
  header: css({
    marginBottom: 16,
  }),
  navigationBar: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 16px",
    color: "var(--primary-text-color, #fff)",
    borderBottom: `0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12))`,
  }),
  breadCrumbs: css({
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    alignItems: "center",
    overflowX: "auto",
    maxWidth: "calc(100% - 40px)",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
  breadCrumbItem: css({
    background: "none",
    border: "none",
    color: "var(--primary-text-color, #fff)",
    cursor: "pointer",
    padding: "2px 4px",
    whiteSpace: "nowrap",
    fontSize: "0.9rem",
    "&:hover": {
      textDecoration: "underline",
    },
  }),
  breadCrumbSeparator: css({
    color: "var(--secondary-text-color)",
  }),
  noMediaText: css({
    padding: "16px",
    paddingBottom: "32px",
    color: "var(--secondary-text-color)",
    textAlign: "center",
  }),
  itemFilter: css({
    marginTop: "8px",
    marginBottom: "16px",
  }),
  mediaItemHeaderMenuImage: css({
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 2,
    marginLeft: -4,
  }),
};

// Category definitions for home screen
const CATEGORIES: Array<{
  id: LyrionCategoryType;
  title: string;
  icon: string;
}> = [
  { id: "artists", title: "Artists", icon: "mdi:account-music" },
  { id: "albumartists", title: "Album Artists", icon: "mdi:account-music-outline" },
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
      parameters: [
        "0",
        "100",
        `term:${searchTerm}`,
        "extended:1",
      ],
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
      console.log("Building favorites params:", {
        command: "favorites",
        parameters: favoriteParams,
      });
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
  const appEntry = history.find(h => h.type === "app");
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
  const playlistEntry = history.find(h => h.type === "playlist");
  const genreEntry = history.find(h => h.type === "genre");
  const artistEntry = history.find(h => h.type === "artist");
  const albumEntry = history.find(h => h.type === "album");

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

/**
 * Get MDI icon for LMS browser items
 */
function getItemIcon(item: LyrionBrowserItem): string | null {
  if (item.thumbnail) return null;

  switch (item.type) {
    case "artist":
      return "mdi:account-music";
    case "album":
      return "mdi:album";
    case "track":
      return "mdi:music-note";
    case "genre":
      return "mdi:music-box-multiple";
    case "playlist":
      return "mdi:playlist-music";
    case "category":
      return CATEGORIES.find(c => c.id === item.id)?.icon ?? "mdi:folder";
    case "app":
      return "mdi:application";
    default:
      return "mdi:music";
  }
}

export const LyrionMediaBrowser = ({
  entity_id,
  horizontalPadding,
  maxHeight,
  renderHeader,
}: LyrionMediaBrowserProps) => {
  const { t } = useIntl();

  const [history, setHistory] = useState<LyrionNavigationItem[]>([]);
  const [itemFilter, setItemFilter] = useState<string>("");
  const debouncedFilter = useDebounce(itemFilter, 350);
  const [chunkSize, setChunkSize] = useState(4);
  const [startIndex, setStartIndex] = useState(0);
  const [accumulatedItems, setAccumulatedItems] = useState<
    LyrionBrowserItem[]
  >([]);
  const appSearchItemIdRef = useRef<string | undefined>();
  const skipFilterClearRef = useRef(false);

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

  // Build browse parameters from history
  const { command, parameters } = useMemo(
    () =>
      buildBrowseParams(
        history,
        startIndex,
        debouncedFilter,
        appSearchItemIdRef.current
      ),
    [history, startIndex, debouncedFilter]
  );

  // Fetch browse data
  const { items: rawItems, loading, totalCount, searchItemId } = useLyrionBrowse({
    entity_id,
    command,
    parameters,
    serverData,
    enabled: history.length > 0 || !!debouncedFilter,
  });

  // Capture app search item id when browsing app root
  useEffect(() => {
    const appEntry = history.find(h => h.type === "app");
    if (!appEntry) {
      appSearchItemIdRef.current = undefined;
    } else if (searchItemId) {
      appSearchItemIdRef.current = searchItemId;
    }
  }, [history, searchItemId]);

  // Reset pagination when history changes
  useEffect(() => {
    setStartIndex(0);
    setAccumulatedItems([]);
  }, [history]);

  // Reset pagination when filter changes
  useEffect(() => {
    setStartIndex(0);
    setAccumulatedItems([]);
  }, [debouncedFilter]);

  // Accumulate items when new data is fetched
  useEffect(() => {
    if (rawItems.length > 0) {
      if (startIndex === 0) {
        // First page, replace items
        setAccumulatedItems(rawItems);
      } else {
        // Subsequent pages, append items
        setAccumulatedItems(prev => [...prev, ...rawItems]);
      }
    }
  }, [rawItems, startIndex]);

  // Show categories on home screen
  const isHomeScreen = history.length === 0;
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

  const isShowingCategories = isHomeScreen && !debouncedFilter;
  const isGlobalSearch = isHomeScreen && !!debouncedFilter;
  const displayItems = isShowingCategories ? categoryItems : accumulatedItems;

  // Determine if the current route supports search
  const isSearchable = useMemo(() => {
    if (history.length === 0) return true;
    const current = history[history.length - 1];
    if (current.command === "favorites") return false;
    const appEntry = history.find(h => h.type === "app");
    if (appEntry && !appSearchItemIdRef.current && !searchItemId) return false;
    return true;
  }, [history, searchItemId]);

  console.log("isSearchable", { isSearchable, history, searchItemId, appSearchItemIdRef: appSearchItemIdRef.current });

  // Check if there are more items to load
  const hasMore = accumulatedItems.length < totalCount && !isShowingCategories;

  // Load more items
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setStartIndex(accumulatedItems.length);
    }
  }, [loading, hasMore, accumulatedItems.length]);

  // Use displayItems directly (filtering is now done via CLI search)
  const filteredItems = displayItems;

  // Group items into rows for grid rendering
  const { items, hasNoArtwork } = useMemo(() => {
    let hasNoArtwork = true;
    const result: BrowserRow[] = [];

    // Check artwork across all items
    filteredItems.forEach(item => {
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
        { title: "Artists", categoryId: "artists", items: filteredItems.filter(i => i.type === "artist"), isTrack: false },
        { title: "Albums", categoryId: "albums", items: filteredItems.filter(i => i.type === "album"), isTrack: false },
        { title: "Tracks", categoryId: "tracks", items: filteredItems.filter(i => i.type === "track"), isTrack: true },
      ];

      const maxPerSection = chunkSize * 2;

      for (const section of sections) {
        if (section.items.length === 0) continue;
        result.push({ sectionTitle: section.title, categoryId: section.categoryId });
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
      const groupedByType: Record<"track" | "expandable", LyrionBrowserItem[]> = {
        track: [],
        expandable: [],
      };

      filteredItems.forEach(item => {
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
  }, [filteredItems, chunkSize, isShowingCategories, isGlobalSearch]);

  // Reset filter when navigating (skip when navigating from global search to category)
  useEffect(() => {
    if (skipFilterClearRef.current) {
      skipFilterClearRef.current = false;
      return;
    }
    setItemFilter("");
  }, [history]);

  const playItem = useCallback(
    (item: LyrionBrowserItem, enqueue?: HaEnqueueMode) => {
      let action = "loadtracks";
      if (enqueue === "next") action = "inserttracks";
      else if (enqueue === "add") action = "addtracks";

      const appEntry = history.find(h => h.type === "app");

      try {
        if (appEntry) {
          // App items: use app command with playlist action
          const appAction = action === "loadtracks" ? "play" : action === "inserttracks" ? "insert" : "add";
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
    [entity_id, history]
  );

  const onItemClick = useCallback(
    (item: LyrionBrowserItem) => {
      if (loading) return;

      // Category selection (home screen)
      if (item.type === "category") {
        const categoryId = item.id as LyrionCategoryType;
        const mapping = CATEGORY_COMMANDS[categoryId];
        setHistory([
          {
            id: categoryId,
            title: item.title,
            command: mapping?.command ?? categoryId,
            parameters: mapping?.parameters ?? [],
            type: item.type,
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
            type: "app",
          },
        ]);
        return;
      }

      // Check if we're browsing within an app
      const appEntry = history.find(h => h.type === "app");
      if (appEntry && item.can_expand) {
        setHistory(prev => [
          ...prev,
          {
            id: item.id,
            title: item.title,
            command: appEntry.command,
            parameters: [],
            type: item.type,
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
          },
        ]);
      }
    },
    [loading, history]
  );

  const goBack = useCallback(() => {
    if (loading) return;
    if (history.length > 0) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history.length, loading]);

  const goToIndex = useCallback(
    (index: number) => {
      if (loading) return;
      setHistory(prev => prev.slice(0, index + 1));
    },
    [loading]
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

  const currentHistoryDropdownMenuItems: OverlayMenuItem[] = useMemo(
    () =>
      history[history.length - 1]
        ? getItemOverlayMenuItems(
            {
              id: history[history.length - 1].id,
              title: history[history.length - 1].title,
              type: history[history.length - 1].type,
              can_play:
                history[history.length - 1].type !== "category" &&
                history[history.length - 1].type !== "app",
              can_expand: false,
            },
            true
          )
        : [],
    [history, getItemOverlayMenuItems]
  );

  const navigateToSearchCategory = useCallback(
    (categoryId: LyrionCategoryType) => {
      skipFilterClearRef.current = true;
      const cat = CATEGORIES.find(c => c.id === categoryId)!;
      const mapping = CATEGORY_COMMANDS[categoryId];
      setHistory([
        {
          id: categoryId,
          title: cat.title,
          command: mapping?.command ?? categoryId,
          parameters: mapping?.parameters ?? [],
          type: "category",
        },
      ]);
    },
    []
  );

  const renderTrack = (item: LyrionBrowserItem) => {
    if (isShowingCategories) return renderFolder(item);
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaTrack
            key={item.id + history.length}
            title={item.title}
            artist={item.subtitle}
            imageUrl={item.thumbnail}
            mdiIcon={getItemIcon(item)}
            {...triggerProps}
          />
        )}
      />
    );
  };

  const renderFolder = (item: LyrionBrowserItem) => {
    if (!item.can_play || (item.can_expand && isShowingCategories)) {
      return (
        <MediaItem
          key={item.id + history.length}
          name={item.title}
          artist={item.subtitle}
          imageUrl={item.thumbnail}
          mdiIcon={getItemIcon(item)}
          onClick={() => onItemClick(item)}
        />
      );
    }
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaItem
            key={item.id + history.length}
            name={item.title}
            artist={item.subtitle}
            imageUrl={item.thumbnail}
            mdiIcon={getItemIcon(item)}
            {...triggerProps}
          />
        )}
      />
    );
  };

  const renderItem = (row: BrowserRow) => {
    if (!Array.isArray(row)) {
      return (
        <MediaSectionTitle
          onClick={() => navigateToSearchCategory(row.categoryId)}
        >
          {row.sectionTitle}
        </MediaSectionTitle>
      );
    }
    return (
      <MediaGrid numberOfColumns={chunkSize}>
        {row.map(mediaItem => {
          if (hasNoArtwork) {
            return renderTrack(mediaItem);
          }
          return mediaItem.type === "track"
            ? renderTrack(mediaItem)
            : renderFolder(mediaItem);
        })}
      </MediaGrid>
    );
  };

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      <VirtualList
        key={history[history.length - 1]?.id || "home"}
        onLayout={({ width }) => {
          if (width > 800) {
            setChunkSize(6);
          } else if (width > 390) {
            setChunkSize(4);
          } else {
            setChunkSize(3);
          }
        }}
        maxHeight={maxHeight}
        onEndReached={hasMore ? loadMore : undefined}
        renderItem={renderItem}
        renderHeader={() => (
          <Fragment>
            {renderHeader && renderHeader()}
            <div css={styles.header}>
              {history.length > 0 && (
                <Fragment>
                  <div css={styles.navigationBar}>
                    <IconButton
                      icon="mdi:arrow-left"
                      size="x-small"
                      onClick={goBack}
                      disabled={history.length === 0}
                    />
                    <div css={styles.breadCrumbs}>
                      <button
                        css={styles.breadCrumbItem}
                        onClick={() => setHistory([])}
                      >
                        {history.length === 0 ? (
                          t({
                            id: "MediaBrowser.breadcrumb_home",
                            defaultMessage: "Home",
                          })
                        ) : (
                          <Icon icon="mdi:home" size="x-small" />
                        )}
                      </button>
                      {history.map((item, index) => (
                        <Fragment key={`breadcrumb-${index}-${item.title}`}>
                          <span css={styles.breadCrumbSeparator}>/</span>
                          <button
                            css={styles.breadCrumbItem}
                            onClick={() => goToIndex(index)}
                          >
                            {item.title}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {currentHistoryDropdownMenuItems.length > 0 && (
                      <OverlayMenu
                        menuItems={currentHistoryDropdownMenuItems}
                        side="bottom"
                        align="end"
                        renderTrigger={triggerProps => (
                          <Chip
                            size="small"
                            invertedColors={true}
                            border={true}
                            {...triggerProps}
                          >
                            <Icon size="x-small" icon="mdi:play" />
                            {t({
                              id: "MediaBrowser.media_item_menu.enqueue_mode.play",
                              defaultMessage: "Play",
                            })}
                            <Icon size="x-small" icon="mdi:chevron-down" />
                          </Chip>
                        )}
                      />
                    )}
                  </div>
                </Fragment>
              )}
            </div>
            {isSearchable && (
              <Input
                placeholder={t({
                  id: "MediaBrowser.search_placeholder",
                  defaultMessage: "Search...",
                })}
                onChange={setItemFilter}
                value={itemFilter}
                css={styles.itemFilter}
                style={{
                  marginLeft: horizontalPadding,
                  marginRight: horizontalPadding,
                }}
              />
            )}
          </Fragment>
        )}
        renderEmpty={() => {
          if (loading) return <Spinner />;
          if (!loading && filteredItems.length === 0) {
            return (
              <div css={styles.noMediaText}>
                {t({
                  id: "MediaBrowser.empty_text",
                  defaultMessage: "No media items available.",
                })}
              </div>
            );
          }
          return null;
        }}
        data={items}
      />
    </div>
  );
};
