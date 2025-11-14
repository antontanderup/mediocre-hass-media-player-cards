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
import { useIntl } from "react-intl";

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
  const intl = useIntl();
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
            placeholder={intl.formatMessage({ id: "Search.input_placeholder" })}
            onChange={setQuery}
            value={query}
            loading={loading}
            css={searchStyles.input}
          />
          <Select
            value={enqueueMode}
            hideSelectedCopy
            onChange={value => setEnqueueMode(value.value as MaEnqueueMode)}
            options={[
              {
                label: intl.formatMessage({ id: "Search.enqueue_mode.play", defaultMessage: "Play" }),
                value: "play",
                icon: getEnqueModeIcon("play"),
              },
              {
                label: intl.formatMessage({ id: "Search.enqueue_mode.replace", defaultMessage: "Replace Queue" }),
                value: "replace",
                icon: getEnqueModeIcon("replace"),
              },
              {
                label: intl.formatMessage({ id: "Search.enqueue_mode.next", defaultMessage: "Add Next" }),
                value: "next",
                icon: getEnqueModeIcon("next"),
              },
              {
                label: intl.formatMessage({ id: "Search.enqueue_mode.replace_next", defaultMessage: "Replace Next" }),
                value: "replace_next",
                icon: getEnqueModeIcon("replace_next"),
              },
              {
                label: intl.formatMessage({ id: "Search.enqueue_mode.add", defaultMessage: "Add to Queue" }),
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
        {intl.formatMessage({ id: `Search.categories.${filter.label}`, defaultMessage: filter.label })}
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
