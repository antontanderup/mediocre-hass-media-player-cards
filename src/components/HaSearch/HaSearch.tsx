import { Chip, IconButton, Input } from "@components";
import { useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { searchStyles } from "@components/MediaSearch";
import { HaFilterConfig, HaEnqueueMode, HaFilterType } from "./types";
import { useSearchQuery } from "./useSearchQuery";
import { useMediaBrowser } from "./useMediaBrowser";
import { HaMediaItemsList } from "./HaMediaItemsList";
import { JSX } from "preact";
import { useIntl } from "@components/i18n";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";

const filters: HaFilterConfig[] = [
  {
    media_content_type: "artists",
    media_filter_class: "artist",
    name: "Artists",
    icon: "mdi:account-music",
  },
  {
    media_content_type: "albums",
    media_filter_class: "album",
    name: "Albums",
    icon: "mdi:album",
  },
  {
    media_content_type: "tracks",
    media_filter_class: "track",
    name: "Tracks",
    icon: "mdi:music-note",
  },
  {
    media_content_type: "playlists",
    media_filter_class: "playlist",
    name: "Playlists",
    icon: "mdi:playlist-music",
  },
];

export type HaSearchProps = {
  entityId: string;
  targetEntityId?: string;
  showFavorites: boolean;
  horizontalPadding?: number;
  filterConfig?: HaFilterConfig[];
  additionalOptions?: OverlayMenuItem[];
  searchBarPosition?: "top" | "bottom";
  maxHeight?: number;
  renderHeader?: () => JSX.Element;
};

export const HaSearch = ({
  entityId,
  targetEntityId,
  showFavorites,
  horizontalPadding,
  searchBarPosition = "top",
  maxHeight = 300,
  filterConfig = filters,
  additionalOptions = [],
  renderHeader,
}: HaSearchProps) => {
  const { t } = useIntl();
  const [query, setQuery] = useState("");
  const [enqueueMode, setEnqueueMode] = useState<HaEnqueueMode>("replace");
  const debouncedQuery = useDebounce(query, 600);
  const [activeFilter, setActiveFilter] = useState<HaFilterConfig | undefined>(
    undefined
  );

  const { results, loading, error, playItem } = useSearchQuery(
    debouncedQuery,
    activeFilter ?? null,
    entityId
  );

  const { mediaBrowserItems } = useMediaBrowser(
    entityId,
    activeFilter === undefined ? "favorites" : activeFilter.media_content_type,
    ((activeFilter === undefined && showFavorites) ||
      activeFilter !== undefined) &&
      query === ""
  );

  const renderSearchBar = () => {
    return (
      <div css={searchStyles.searchBarContainer}>
        {!!renderHeader && renderHeader()}
        <div css={searchStyles.inputRow}>
          <Input
            placeholder={t({ id: "Search.input_placeholder" })}
            onChange={setQuery}
            value={query}
            loading={loading}
            css={searchStyles.input}
          />
          <OverlayMenu
            align="end"
            side="bottom"
            menuItems={[
              ...additionalOptions,
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
                  id: "Search.enqueue_mode.add",
                  defaultMessage: "Add to Queue",
                }),
                selected: enqueueMode === "add",
                icon: getEnqueModeIcon("add"),
                onClick: () => setEnqueueMode("add"),
              },
            ]}
            renderTrigger={triggerProps => (
              <IconButton
                size="x-small"
                icon={
                  !additionalOptions || additionalOptions.length === 0
                    ? getEnqueModeIcon(enqueueMode)
                    : "mdi:cog"
                }
                {...triggerProps}
              />
            )}
          />
        </div>
        <div css={searchStyles.filterContainer}>{renderFilterChips()}</div>
      </div>
    );
  };

  const renderFilterChips = () => {
    return [
      { media_content_type: "all", name: "All", icon: "mdi:all-inclusive" },
      ...filterConfig,
    ].map(filter => {
      const isActive =
        activeFilter === filter ||
        (!activeFilter && filter.media_content_type === "all");
      return (
        <Chip
          css={searchStyles.chip}
          style={{
            "--mmpc-chip-horizontal-margin": `${horizontalPadding}px`,
            opacity: isActive ? 1 : 0.6,
            fontWeight: isActive ? "bold" : "normal",
          }}
          key={JSON.stringify(filter)}
          onClick={() =>
            setActiveFilter(
              filter.media_content_type === "all" ? undefined : filter
            )
          }
          icon={filter.icon}
        >
          {t({
            id: `Search.categories.${filter.name}`,
            defaultMessage: filter.name,
          })}
        </Chip>
      );
    });
  };

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      <HaMediaItemsList
        renderHeader={searchBarPosition === "top" ? renderSearchBar : undefined}
        data={
          query === "" && mediaBrowserItems.length > 0
            ? mediaBrowserItems
            : results
        }
        error={error}
        hideEmpty={query === "" && !activeFilter && !showFavorites}
        onItemClick={item =>
          playItem(item, targetEntityId ?? entityId, enqueueMode)
        }
        style={{
          "--mmpc-search-padding": `${horizontalPadding}px`,
        }}
        maxHeight={maxHeight}
        filterConfig={filterConfig}
        onHeaderClick={setActiveFilter}
      />
      {searchBarPosition === "bottom" && renderSearchBar()}
    </div>
  );
};

const getEnqueModeIcon = (enqueueMode: HaEnqueueMode) => {
  switch (enqueueMode) {
    case "play": // Play now
      return "mdi:play-circle";
    case "replace": // Replace the existing queue and play now
      return "mdi:playlist-remove";
    case "next": // Add to the current queue after the currently playing item
      return "mdi:playlist-play";
    case "add": // Add to the end of the queue
      return "mdi:playlist-plus";
    default:
      return "mdi:play-circle";
  }
};
