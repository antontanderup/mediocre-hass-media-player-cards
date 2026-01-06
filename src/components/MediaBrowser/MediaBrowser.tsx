import {
  Chip,
  Icon,
  Input,
  MediaClass,
  MediaContentType,
  MediaGrid,
  MediaImage,
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
import { getHass } from "@utils";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { getEnqueueModeIcon, getItemMdiIcon } from "./utils";
import { useIntl } from "@components/i18n";
import { MediaBrowserEntry } from "@types";

export type MediaBrowserProps = {
  mediaBrowserEntryArray: MediaBrowserEntry[];
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
  mediaBrowserEntrySelector: css({
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

export type MediaBrowserItem = {
  title: string;
  media_class: MediaClass | string;
  media_content_type: MediaContentType | string;
  media_content_id: string;
  children_media_class: MediaClass | null;
  can_play: boolean;
  can_expand: boolean;
  thumbnail: string | null;
};

export const MediaBrowser = ({
  mediaBrowserEntryArray,
  horizontalPadding,
  maxHeight,
  renderHeader,
}: MediaBrowserProps) => {
  const { t } = useIntl();

  const [selectedMediaBrowser, setSelectedMediaBrowser] =
    useState<MediaBrowserEntry>(mediaBrowserEntryArray[0]);
  const { entity_id } = selectedMediaBrowser;

  const selectMediaBrowserMenuItems: OverlayMenuItem[] = useMemo(() => {
    return mediaBrowserEntryArray.map(mediaBrowserEntry => ({
      label: mediaBrowserEntry.name ?? mediaBrowserEntry.entity_id,
      selected: mediaBrowserEntry.entity_id === selectedMediaBrowser.entity_id,
      onClick: () => {
        setSelectedMediaBrowser(mediaBrowserEntry);
      },
    }));
  }, [mediaBrowserEntryArray, selectedMediaBrowser.entity_id]);

  const [mediaBrowserItems, setMediaBrowserItems] = useState<
    MediaBrowserItem[]
  >([]);
  const [history, setHistory] = useState<MediaBrowserItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [chunkSize, setChunkSize] = useState(4);
  const [itemFilter, setItemFilter] = useState<string>("");

  const items: MediaBrowserItem[][] = useMemo(() => {
    const result: MediaBrowserItem[][] = [];
    const groupedByType: Record<"track" | "expandable", MediaBrowserItem[]> = {
      track: [],
      expandable: [],
    };

    const filteredResults =
      itemFilter === ""
        ? mediaBrowserItems
        : mediaBrowserItems.filter(item =>
            item.title.toLowerCase().includes(itemFilter.toLowerCase())
          );

    // Group items by media_content_type
    filteredResults.forEach(item => {
      const isTrack =
        (item.media_content_type === MediaContentType.Tracks ||
          item.media_class === MediaClass.Track) &&
        item.media_content_type !== "favorite";
      const type = isTrack && !(history.length === 0) ? "track" : "expandable";
      if (!groupedByType[type]) {
        groupedByType[type] = [];
      }
      groupedByType[type].push(item);
    });

    // Process each group
    Object.entries(groupedByType).forEach(([mediaType, items]) => {
      // Add items based on media_class
      if (mediaType === "track" && history.length !== 0) {
        // Tracks are added individually
        items.forEach(item => {
          result.push([item]);
        });
      } else {
        // Other media types are grouped in rows of 4
        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);
          result.push(chunk);
        }
      }
    });

    return result;
  }, [mediaBrowserItems, chunkSize, itemFilter]);

  useEffect(() => {
    setItemFilter("");
    const fetchMediaBrowserItems = async () => {
      setIsFetching(true);
      try {
        const hass = getHass();
        const response = (await hass.callWS({
          type: "media_player/browse_media",
          entity_id,
          ...(history.length > 0
            ? {
                media_content_id: history[history.length - 1].media_content_id,
                media_content_type:
                  history[history.length - 1].media_content_type,
              }
            : {}),
        })) as { children?: MediaBrowserItem[] };

        if (response && response.children) {
          setMediaBrowserItems(response.children);
        } else {
          setMediaBrowserItems([]);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
      }
      setIsFetching(false);
    };

    fetchMediaBrowserItems();
  }, [entity_id, history]);

  const playItem = useCallback(
    (item: MediaBrowserItem, enqueue?: HaEnqueueMode) => {
      try {
        getHass().callService("media_player", "play_media", {
          entity_id,
          media_content_type: item.media_content_type,
          media_content_id: item.media_content_id,
          enqueue,
        });
      } catch (error) {
        console.error(
          "Error playing media item:",
          {
            entity_id,
            media_content_type: item.media_content_type,
            media_content_id: item.media_content_id,
          },
          error
        );
      }
    },
    [entity_id]
  );

  const onMediaBrowserItemClick = useCallback(
    (item: MediaBrowserItem) => {
      if (isFetching) return;
      if (
        item.can_expand &&
        item.media_content_id !== history[history.length - 1]?.media_content_id
      ) {
        setHistory(prev => [...prev, item]);
        return;
      }
    },
    [history, isFetching]
  );

  const goBack = useCallback(() => {
    if (isFetching) return;
    if (history.length > 0) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [isFetching]);

  const goToIndex = useCallback(
    (index: number) => {
      if (isFetching) return;
      setHistory(prev => prev.slice(0, index + 1));
    },
    [isFetching]
  );

  const getItemOverlayMenuItems = useCallback(
    (item: MediaBrowserItem, excludeExpandOptions = false) => {
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
          onClick: () => onMediaBrowserItemClick(item),
        });
      }
      return menuItems;
    },
    []
  );

  const currentHistoryDropdownMenuItems: OverlayMenuItem[] = useMemo(
    () =>
      history[history.length - 1]
        ? getItemOverlayMenuItems(history[history.length - 1], true)
        : [],
    [history]
  );

  const renderTrack = (item: MediaBrowserItem) => {
    if (history.length === 0) return renderFolder(item);
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaTrack
            key={item.media_content_id + history.length}
            title={item.title}
            imageUrl={item.thumbnail}
            {...triggerProps}
          />
        )}
      />
    );
  };

  const renderFolder = (item: MediaBrowserItem) => {
    if (!item.can_play || (item.can_expand && history.length === 0)) {
      return (
        <MediaItem
          key={item.media_content_id + history.length}
          name={item.title}
          imageUrl={item.thumbnail}
          mdiIcon={getItemMdiIcon(item)}
          onClick={() => onMediaBrowserItemClick(item)}
        />
      );
    }
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaItem
            key={item.media_content_id + history.length}
            name={item.title}
            imageUrl={item.thumbnail}
            mdiIcon={getItemMdiIcon(item)}
            {...triggerProps}
          />
        )}
      />
    );
  };

  const renderItem = (item: MediaBrowserItem[]) => {
    return (
      <MediaGrid numberOfColumns={chunkSize}>
        {item.map(mediaItem => {
          return (item[0].media_class === MediaClass.Track ||
            item[0].media_content_type === MediaContentType.Track) &&
            mediaItem.media_content_type !== "favorite"
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
        key={history[history.length - 1]?.media_content_id || "root"}
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
        renderItem={renderItem}
        renderHeader={() => (
          <Fragment>
            {renderHeader && renderHeader()}
            <div css={styles.header}>
              {history.length > 0 || mediaBrowserEntryArray.length > 1 ? (
                <Fragment>
                  <div css={styles.navigationBar}>
                    {history.length > 0 ? (
                      <IconButton
                        icon="mdi:arrow-left"
                        size="x-small"
                        onClick={goBack}
                        disabled={history.length === 0}
                      />
                    ) : (
                      <Icon icon="mdi:home" size="x-small" />
                    )}
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
                    {mediaBrowserEntryArray.length > 1 &&
                      history.length === 0 && (
                        <OverlayMenu
                          menuItems={selectMediaBrowserMenuItems}
                          side="bottom"
                          align="end"
                          renderTrigger={triggerProps => (
                            <Chip
                              icon="mdi:import"
                              size="small"
                              invertedColors={true}
                              border={true}
                              css={styles.mediaBrowserEntrySelector}
                              {...triggerProps}
                            >
                              {selectedMediaBrowser.name ??
                                selectedMediaBrowser.entity_id}
                              <Icon size="x-small" icon="mdi:chevron-down" />
                            </Chip>
                          )}
                        />
                      )}
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
                            css={styles.mediaBrowserEntrySelector}
                            {...triggerProps}
                          >
                            {history[history.length - 1].thumbnail ? (
                              <MediaImage
                                css={styles.mediaItemHeaderMenuImage}
                                imageUrl={history[history.length - 1].thumbnail}
                                mdiIcon={getItemMdiIcon(
                                  history[history.length - 1]
                                )}
                              />
                            ) : (
                              <Icon size="x-small" icon="mdi:play" />
                            )}
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
              ) : null}
            </div>
            {mediaBrowserItems.length > 3 && history.length > 0 && (
              <Input
                placeholder={t({
                  id: "MediaBrowser.filter_placeholder",
                  defaultMessage: "Filter items...",
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
          if (isFetching) return <Spinner />;
          if (!isFetching && mediaBrowserItems.length === 0) {
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
