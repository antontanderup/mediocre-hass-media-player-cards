import { Chip, Icon, IconButton, Input } from "@components";
import { useEffect, useMemo, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { searchStyles } from "@components/MediaSearch";
import { MaEnqueueMode, MaFilterType } from "./types";
import { useSearchQuery } from "./useSearchQuery";
import { useLibrary } from "./useLibrary";
import { getMaFilterConfig } from "./constants";
import { JSX } from "preact/jsx-runtime";
import { useIntl } from "@components/i18n";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import type { SearchMediaType } from "@types";
import { MaResultsView } from "./MaResultsView";
import { useMaPlayItem } from "./useMaPlayItem";
import { usePersistedMaViewMode } from "./usePersistedMaViewMode";

export type MaSearchProps = {
  compactThumbColumns?: number;
  maEntityId: string;
  horizontalPadding?: number;
  additionalOptions?: OverlayMenuItem[];
  filterConfig?: SearchMediaType[];
  defaultScope?: MaSearchScope;
  showModeText?: boolean;
  providerLabel?: string;
  providerMenuItems?: OverlayMenuItem[];
  searchBarPosition?: "top" | "bottom";
  maxHeight?: number;
  renderHeader?: () => JSX.Element;
  thumbColumns?: number;
};

export type MaSearchScope = "global";

export const MaSearch = ({
  maEntityId,
  horizontalPadding,
  searchBarPosition = "top",
  additionalOptions = [],
  filterConfig,
  renderHeader,
  thumbColumns,
  compactThumbColumns,
}: MaSearchProps) => {
  const { t } = useIntl();
  const [query, setQuery] = useState("");
  const [enqueueMode, setEnqueueMode] = useState<MaEnqueueMode>("play");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const normalizedQuery = query.trim();
  const debouncedQuery = useDebounce(normalizedQuery, 600);
  const [activeFilter, setActiveFilter] = useState<MaFilterType>("all");
  const [resultLimit, setResultLimit] = useState(getDefaultLimit("all", false));
  const resolvedFilters = useMemo(() => getMaFilterConfig(filterConfig), [filterConfig]);
  const playItem = useMaPlayItem();
  const [viewMode, setViewMode] = usePersistedMaViewMode(
    "global-search",
    maEntityId,
    activeFilter,
    "list"
  );

  useEffect(() => {
    if (resolvedFilters.some(filter => filter.type === activeFilter)) return;
    setActiveFilter(resolvedFilters[0]?.type ?? "all");
  }, [activeFilter, resolvedFilters]);

  useEffect(() => {
    setResultLimit(getDefaultLimit(activeFilter, normalizedQuery !== ""));
  }, [activeFilter, normalizedQuery, favoritesOnly]);

  const useLibraryResults = normalizedQuery === "" || favoritesOnly;

  const {
    results: searchResults,
    loading: searchLoading,
    canLoadMore: canLoadMoreSearch,
  } = useSearchQuery(debouncedQuery, activeFilter, {
    enabled: !useLibraryResults,
    limit: resultLimit,
  });

  const {
    library: libraryResults,
    loading: libraryLoading,
    canLoadMore: canLoadMoreLibrary,
  } = useLibrary(activeFilter, {
    enabled: useLibraryResults,
    favorite: favoritesOnly,
    search: useLibraryResults ? debouncedQuery : "",
    limit: resultLimit,
  });

  const isLoading = useLibraryResults ? libraryLoading : searchLoading;
  const displayedResults = useLibraryResults ? libraryResults : searchResults;
  const canLoadMore = useLibraryResults ? canLoadMoreLibrary : canLoadMoreSearch;
  const emptyText =
    normalizedQuery === ""
      ? favoritesOnly
        ? t({
            id: "Search.mode.no_favorite_results",
            defaultMessage: "No favorite items found for this filter.",
          })
        : t({
            id: "Search.mode.no_default_results",
            defaultMessage: "No items found for this filter.",
          })
      : t({
          id: "Search.mode.no_search_results",
          defaultMessage: "No results found.",
        });

  const handleLoadMore = () => {
    if (!canLoadMore || isLoading) return;
    setResultLimit(prev => prev + getLoadMoreStep(activeFilter, normalizedQuery !== ""));
  };

  const renderSearchBar = () => {
    return (
      <div css={searchStyles.searchBarContainer}>
        {!!renderHeader && renderHeader()}
        <div css={searchStyles.inputRow}>
          <Input
            placeholder={t({
              id: "Search.input_placeholder",
              defaultMessage: "Search for media...",
            })}
            onChange={setQuery}
            value={query}
            clearable
            loading={isLoading}
            css={searchStyles.input}
          />
          {favoritesOnly && (
            <div
              css={searchStyles.headerIndicator}
              title={t({
                id: "Search.header.favorites_only",
                defaultMessage: "Only showing favorites",
              })}
              aria-label={t({
                id: "Search.header.favorites_only",
                defaultMessage: "Only showing favorites",
              })}
            >
              <Icon icon="mdi:heart" size="small" />
            </div>
          )}
          <OverlayMenu
            align="end"
            side="bottom"
            menuItems={[
              ...additionalOptions,
              {
                label: t({
                  id: "Search.menu.only_favorites",
                  defaultMessage: "Only show favorites",
                }),
                icon: favoritesOnly ? "mdi:heart" : "mdi:heart-outline",
                selected: favoritesOnly,
                onClick: () => setFavoritesOnly(value => !value),
              },
              {
                type: "title",
                label: t({
                  id: "Search.menu.view_mode",
                  defaultMessage: "View Mode",
                }),
              },
              {
                label: t({
                  id: "Search.view_mode.list",
                  defaultMessage: "List",
                }),
                icon: "mdi:view-list",
                selected: viewMode === "list",
                onClick: () => setViewMode("list"),
              },
              {
                label: t({
                  id: "Search.view_mode.thumbs",
                  defaultMessage: "Thumbs",
                }),
                icon: "mdi:view-grid",
                selected: viewMode === "thumbs",
                onClick: () => setViewMode("thumbs"),
              },
              {
                label: t({
                  id: "Search.view_mode.compact_thumbs",
                  defaultMessage: "Compact Thumbs",
                }),
                icon: "mdi:view-grid-compact",
                selected: viewMode === "compact_thumbs",
                onClick: () => setViewMode("compact_thumbs"),
              },
              {
                type: "title",
                label: t({
                  id: "Search.enqueue_mode.title",
                  defaultMessage: "Enqueue Mode",
                }),
              },
              {
                label: t({
                  id: "Search.enqueue_mode.play",
                  defaultMessage: "Play",
                }),
                selected: enqueueMode === "play",
                icon: getEnqueModeIcon("play"),
                onClick: () => setEnqueueMode("play"),
              },
              {
                label: t({
                  id: "Search.enqueue_mode.replace",
                  defaultMessage: "Replace Queue",
                }),
                selected: enqueueMode === "replace",
                icon: getEnqueModeIcon("replace"),
                onClick: () => setEnqueueMode("replace"),
              },
              {
                label: t({
                  id: "Search.enqueue_mode.next",
                  defaultMessage: "Add Next",
                }),
                selected: enqueueMode === "next",
                icon: getEnqueModeIcon("next"),
                onClick: () => setEnqueueMode("next"),
              },
              {
                label: t({
                  id: "Search.enqueue_mode.replace_next",
                  defaultMessage: "Replace Next",
                }),
                selected: enqueueMode === "replace_next",
                icon: getEnqueModeIcon("replace_next"),
                onClick: () => setEnqueueMode("replace_next"),
              },
              {
                label: t({
                  id: "Search.enqueue_mode.add",
                  defaultMessage: "Add to Queue",
                }),
                selected: enqueueMode === "add",
                icon: getEnqueModeIcon("add"),
                onClick: () => setEnqueueMode("add"),
              },
            ]}
            renderTrigger={triggerProps => (
              <IconButton size="x-small" icon="mdi:dots-vertical" {...triggerProps} />
            )}
          />
        </div>
        <div css={searchStyles.scrollingChipRow}>
          {resolvedFilters.map(filter => (
            <Chip
              css={searchStyles.chip}
              style={{
                opacity: activeFilter === filter.type ? 1 : 0.6,
                fontWeight: activeFilter === filter.type ? "bold" : "normal",
              }}
              key={filter.type}
              onClick={() => setActiveFilter(filter.type)}
              icon={filter.icon}
            >
              {t({
                id: `Search.categories.${filter.label}`,
                defaultMessage: filter.label,
              })}
            </Chip>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      {searchBarPosition === "top" && renderSearchBar()}
      <MaResultsView
        results={displayedResults}
        activeFilter={activeFilter}
        viewMode={viewMode}
        thumbColumns={thumbColumns ?? 4}
        compactThumbColumns={compactThumbColumns ?? 5}
        emptyText={emptyText}
        canLoadMore={canLoadMore}
        onLoadMore={handleLoadMore}
        onItemClick={item => playItem(item, maEntityId, enqueueMode)}
      />
      {searchBarPosition === "bottom" && renderSearchBar()}
    </div>
  );
};

const getDefaultLimit = (filter: MaFilterType, searching: boolean) => {
  if (searching) {
    return filter === "all" ? 12 : filter === "music" ? 36 : 100;
  }
  return filter === "all" ? 12 : filter === "music" ? 24 : 100;
};

const getLoadMoreStep = (filter: MaFilterType, searching: boolean) => {
  if (searching) {
    return filter === "all" ? 12 : filter === "music" ? 24 : 50;
  }
  return filter === "all" ? 8 : filter === "music" ? 16 : 50;
};

const getEnqueModeIcon = (enqueueMode: MaEnqueueMode) => {
  switch (enqueueMode) {
    case "play": // Play now
      return "mdi:play-circle";
    case "replace": // Replace the existing queue and play now
      return "mdi:playlist-remove";
    case "next": // Add to the current queue after the currently playing item
      return "mdi:playlist-play";
    case "replace_next": // Replace the current queue after the currently playing item
      return "mdi:playlist-edit";
    case "add": // Add to the end of the queue
      return "mdi:playlist-plus";
    default:
      return "mdi:play-circle";
  }
};
