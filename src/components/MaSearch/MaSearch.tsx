import { Chip, Input } from "@components";
import { useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { searchStyles } from "@components/MediaSearch";
import { MaFilterType, MaEnqueueMode } from "./types";
import { useSearchQuery } from "./useSearchQuery";
import { useFavorites } from "./useFavorites";
import { filters } from "./constants";
import { MaMediaItemsList } from "./MaMediaItemsList";
import { JSX } from "preact/jsx-runtime";
import { Select } from "@components/Select";

export type MaSearchProps = {
  maEntityId: string;
  horizontalPadding?: number;
  searchBarPosition?: "top" | "bottom";
  maxHeight?: number;
  renderHeader?: () => JSX.Element;
};

export const MaSearch = ({
  maEntityId,
  horizontalPadding,
  searchBarPosition = "top",
  maxHeight = 300,
  renderHeader,
}: MaSearchProps) => {
  const [query, setQuery] = useState("");
  const [enqueueMode, setEnqueueMode] = useState<MaEnqueueMode>("play");
  const debouncedQuery = useDebounce(query, 600);
  const [activeFilter, setActiveFilter] = useState<MaFilterType>("all");

  const { results, loading, playItem } = useSearchQuery(
    debouncedQuery,
    activeFilter
  );

  const { favorites } = useFavorites(activeFilter, query === "");

  const renderSearchBar = () => {
    return (
      <div css={searchStyles.searchBarContainer}>
        {!!renderHeader && renderHeader()}
        <div css={searchStyles.inputRow}>
          <Input
            placeholder={
              Math.random() > 0.99
                ? "Never gonna giv..."
                : "Search for media..."
            }
            onChange={setQuery}
            value={query}
            loading={loading}
            css={searchStyles.input}
          />
          <Select
            value={enqueueMode}
            onChange={value => setEnqueueMode(value.value as MaEnqueueMode)}
            options={[
              {
                label: "Play",
                value: "play",
                icon: getEnqueModeIcon("play"),
              },
              {
                label: "Replace Queue",
                value: "replace",
                icon: getEnqueModeIcon("replace"),
              },
              {
                label: "Add Next",
                value: "next",
                icon: getEnqueModeIcon("next"),
              },
              {
                label: "Replace Next",
                value: "replace_next",
                icon: getEnqueModeIcon("replace_next"),
              },
              {
                label: "Add to Queue",
                value: "add",
                icon: getEnqueModeIcon("add"),
              },
            ]}
          />
        </div>
        <div css={searchStyles.filterContainer}>{renderFilterChips()}</div>
      </div>
    );
  };

  const renderFilterChips = () => {
    return filters.map(filter => (
      <Chip
        css={searchStyles.chip}
        style={{
          "--mmpc-chip-horizontal-margin": `${horizontalPadding}px`,
          opacity: activeFilter === filter.type ? 1 : 0.6,
          fontWeight: activeFilter === filter.type ? "bold" : "normal",
        }}
        key={filter.type}
        onClick={() => setActiveFilter(filter.type)}
        icon={filter.icon}
      >
        {filter.label}
      </Chip>
    ));
  };

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      <MaMediaItemsList
        renderHeader={searchBarPosition === "top" ? renderSearchBar : undefined}
        results={
          query !== "" && results ? results : favorites ? favorites : undefined
        }
        onItemClick={item => playItem(item, maEntityId, enqueueMode)}
        style={{
          "--mmpc-search-padding": `${horizontalPadding}px`,
        }}
        maxHeight={maxHeight}
        onHeaderClick={setActiveFilter}
      />
      {searchBarPosition === "bottom" && renderSearchBar()}
    </div>
  );
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
