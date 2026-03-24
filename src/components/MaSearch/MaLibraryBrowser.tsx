import { Chip, Icon, IconButton, Input } from "@components";
import { MediaItem } from "@components/MediaSearch/components/MediaItem";
import { searchStyles } from "@components/MediaSearch";
import { OverlayMenu, OverlayMenuItem } from "@components/OverlayMenu/OverlayMenu";
import { css } from "@emotion/react";
import { useIntl } from "@components/i18n";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import type { SearchMediaType } from "@types";
import { getMaFilterConfig } from "./constants";
import { MaFilterType } from "./types";
import { MaResultsView } from "./MaResultsView";
import { useLibrary } from "./useLibrary";
import { useMaPlayItem } from "./useMaPlayItem";
import { usePersistedMaViewMode } from "./usePersistedMaViewMode";

const styles = {
  rootTiles: css({
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    padding: "0px var(--mmpc-search-padding, 0px) 12px",
  }),
  breadcrumbs: css({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0px var(--mmpc-search-padding, 0px)",
    color: "var(--primary-text-color)",
  }),
  breadcrumbsTitle: css({
    fontSize: "1rem",
    fontWeight: 700,
  }),
};

export type MaLibraryBrowserProps = {
  compactThumbColumns?: number;
  maEntityId: string;
  horizontalPadding?: number;
  filterConfig?: SearchMediaType[];
  rootColumns?: number;
  providerLabel?: string;
  providerMenuItems?: OverlayMenuItem[];
  maxHeight?: number;
  renderHeader?: () => JSX.Element;
  thumbColumns?: number;
};

export const MaLibraryBrowser = ({
  maEntityId,
  horizontalPadding,
  filterConfig,
  rootColumns,
  thumbColumns,
  compactThumbColumns,
  providerLabel,
  providerMenuItems,
  renderHeader,
}: MaLibraryBrowserProps) => {
  const { t } = useIntl();
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MaFilterType | null>(null);
  const normalizedQuery = query.trim();
  const debouncedQuery = useDebounce(normalizedQuery, 600);
  const [resultLimit, setResultLimit] = useState(24);
  const playItem = useMaPlayItem();

  const resolvedFilters = useMemo(
    () => getMaFilterConfig(filterConfig).filter(filter => filter.type !== "all"),
    [filterConfig]
  );

  const activeFilter = activeCategory ?? resolvedFilters[0]?.type ?? "artist";
  const [viewMode, setViewMode] = usePersistedMaViewMode(
    "library",
    maEntityId,
    activeCategory,
    "thumbs"
  );

  useEffect(() => {
    if (activeCategory) return;
    setQuery("");
    setFavoritesOnly(false);
    setResultLimit(24);
  }, [activeCategory]);

  useEffect(() => {
    setResultLimit(normalizedQuery === "" ? 24 : 50);
  }, [activeFilter, normalizedQuery, favoritesOnly]);

  const {
    library,
    loading,
    canLoadMore,
  } = useLibrary(activeFilter, {
    enabled: !!activeCategory,
    favorite: favoritesOnly,
    search: debouncedQuery,
    limit: resultLimit,
  });

  const activeCategoryLabel =
    resolvedFilters.find(filter => filter.type === activeFilter)?.label ?? "Library";

  const handleLoadMore = () => {
    if (!canLoadMore || loading) return;
    setResultLimit(prev => prev + (normalizedQuery === "" ? 24 : 50));
  };

  const renderCategoryToolbar = () => (
    <>
      <div css={styles.breadcrumbs}>
        <IconButton icon="mdi:arrow-left" onClick={() => setActiveCategory(null)} />
        <IconButton icon="mdi:home" onClick={() => setActiveCategory(null)} />
        <div css={styles.breadcrumbsTitle}>/ {activeCategoryLabel}</div>
      </div>
      <div css={searchStyles.inputRow}>
        <Input
          placeholder={t({
            id: "MediaBrowser.filter_results_placeholder",
            defaultMessage: "Filter results...",
          })}
          onChange={setQuery}
          value={query}
          clearable
          loading={loading}
          css={searchStyles.input}
        />
        {favoritesOnly && (
          <div
            css={searchStyles.headerIndicator}
            title={t({
              id: "MediaBrowser.header.favorites_only",
              defaultMessage: "Only showing favorites",
            })}
            aria-label={t({
              id: "MediaBrowser.header.favorites_only",
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
            {
              label: t({
                id: "MediaBrowser.menu.only_favorites",
                defaultMessage: "Only show favorites",
              }),
              icon: favoritesOnly ? "mdi:heart" : "mdi:heart-outline",
              selected: favoritesOnly,
              onClick: () => setFavoritesOnly(value => !value),
            },
            {
              type: "title",
              label: t({
                id: "MediaBrowser.menu.view_mode",
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
          ]}
          renderTrigger={triggerProps => (
            <IconButton size="x-small" icon="mdi:dots-vertical" {...triggerProps} />
          )}
        />
      </div>
    </>
  );

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      {!!renderHeader && renderHeader()}
      {providerMenuItems && providerMenuItems.length > 1 && (
        <div css={searchStyles.chipRow}>
          <OverlayMenu
            menuItems={providerMenuItems}
            align="end"
            side="bottom"
            renderTrigger={triggerProps => (
              <Chip
                icon="mdi:import"
                size="small"
                invertedColors
                border
                {...triggerProps}
              >
                {providerLabel ?? maEntityId}
                <Icon icon="mdi:chevron-down" size="x-small" />
              </Chip>
            )}
          />
        </div>
      )}
      {!activeCategory ? (
        <div
          css={styles.rootTiles}
          style={{
            gridTemplateColumns: `repeat(${getNormalizedColumns(
              rootColumns,
              4
            )}, minmax(0, 1fr))`,
          }}
        >
          {resolvedFilters.map(filter => (
            <MediaItem
              key={filter.type}
              mdiIcon={filter.icon}
              name={filter.label}
              onClick={() => setActiveCategory(filter.type)}
            />
          ))}
        </div>
      ) : (
        <>
          {renderCategoryToolbar()}
          <MaResultsView
            results={library}
            activeFilter={activeFilter}
            viewMode={viewMode}
            thumbColumns={thumbColumns ?? 4}
            compactThumbColumns={compactThumbColumns ?? 5}
            emptyText={t({
              id: "MediaBrowser.no_results",
              defaultMessage: "No items found for this category.",
            })}
            canLoadMore={canLoadMore}
            onLoadMore={handleLoadMore}
            onItemClick={item => playItem(item, maEntityId, "play")}
          />
        </>
      )}
    </div>
  );
};

const getNormalizedColumns = (value: number | undefined, fallback: number) =>
  Number.isFinite(value) ? Math.max(1, Math.floor(value!)) : fallback;
