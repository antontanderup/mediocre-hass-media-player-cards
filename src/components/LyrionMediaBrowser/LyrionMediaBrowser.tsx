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
import { IconButton } from "@components/IconButton";
import { OverlayMenu } from "@components/OverlayMenu/OverlayMenu";
import { css } from "@emotion/react";
import { Fragment } from "preact/jsx-runtime";
import { MediaSectionTitle } from "@components/MediaSearch";
import { useIntl } from "@components/i18n";
import type { LyrionBrowserItem } from "@types";
import { CATEGORIES } from "./constants";
import {
  type BrowserRow,
  useLyrionMediaBrowserData,
} from "./useLyrionMediaBrowserData";

export type LyrionMediaBrowserProps = {
  entity_id: string;
  horizontalPadding?: number;
  maxHeight?: number;
  renderHeader?: () => preact.JSX.Element;
};

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
  headerPlayMenu: css({
    marginLeft: "auto",
  }),
  mediaItemHeaderMenuImage: css({
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 2,
    marginLeft: -4,
  }),
};

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

  const {
    navHistory,
    currentFilter,
    setCurrentFilter,
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
    filteredItems,
  } = useLyrionMediaBrowserData({ entity_id });

  const renderTrack = (item: LyrionBrowserItem) => {
    if (isShowingCategories) return renderFolder(item);
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaTrack
            key={item.id + navHistory.length}
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
          key={item.id + navHistory.length}
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
            key={item.id + navHistory.length}
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
        key={navHistory[navHistory.length - 1]?.id || "home"}
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
              {navHistory.length > 0 && (
                <Fragment>
                  <div css={styles.navigationBar}>
                    <IconButton
                      icon="mdi:arrow-left"
                      size="x-small"
                      onClick={goBack}
                      disabled={navHistory.length === 0}
                    />
                    <div css={styles.breadCrumbs}>
                      <button css={styles.breadCrumbItem} onClick={goHome}>
                        <Icon icon="mdi:home" size="x-small" />
                      </button>
                      {navHistory.map((item, index) => (
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
                            css={styles.headerPlayMenu}
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
                onChange={setCurrentFilter}
                value={currentFilter}
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
