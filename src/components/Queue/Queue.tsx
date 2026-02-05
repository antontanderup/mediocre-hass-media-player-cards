import {
  MediaGrid,
  MediaTrack,
  Spinner,
  usePlayer,
  VirtualList,
} from "@components";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { useMassQueue, useSqueezeboxQueue } from "@hooks";
import { QueueItem } from "@types";
import {
  getCanDisplayLmsQueue,
  getCanDisplayMAQueue,
  getIsLmsPlayer,
  getHasMassFeatures,
} from "@utils";
import type { ComponentChildren } from "preact";
import { FC, useMemo, useCallback, memo } from "preact/compat";

type QueueProps = {
  height?: number;
  ma_entity_id?: string | null;
  lms_entity_id?: string | null;
  renderHeader?: (
    refetch: () => void,
    loading: boolean,
    clearQueue: () => void
  ) => ComponentChildren;
};

const styles = {
  itemPlaying: css({
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
};

export const Queue: FC<QueueProps> = ({
  height,
  ma_entity_id,
  lms_entity_id,
  renderHeader,
}) => {
  const player = usePlayer();

  const isMainEntityLmsPlayer = useMemo(
    () => lms_entity_id && getIsLmsPlayer(player, lms_entity_id),
    [player, lms_entity_id]
  );

  const isMainEntityMAPlayer = useMemo(
    () => getHasMassFeatures(player.entity_id, ma_entity_id ?? undefined),
    [player, ma_entity_id]
  );

  const {
    queue: lmsQueue,
    loading: lmsLoading,
    refetch: lmsRefetch,
    error: lmsError,
    clearQueue: lmsClearQueue,
  } = useSqueezeboxQueue(
    lms_entity_id ?? "",
    !!isMainEntityLmsPlayer && getCanDisplayLmsQueue()
  );

  const {
    queue: maQueue,
    loading: maLoading,
    refetch: maRefetch,
    error: maError,
    clearQueue: maClearQueue,
  } = useMassQueue(
    ma_entity_id ?? "",
    !!isMainEntityMAPlayer && getCanDisplayMAQueue()
  );

  const queue = isMainEntityLmsPlayer ? lmsQueue : maQueue;
  const loading = isMainEntityLmsPlayer ? lmsLoading : maLoading;
  const refetch = isMainEntityLmsPlayer ? lmsRefetch : maRefetch;
  const error = isMainEntityLmsPlayer ? lmsError : maError;
  const clearQueue = isMainEntityLmsPlayer ? lmsClearQueue : maClearQueue;

  const renderItem = useCallback((item: QueueItem) => {
    if (item.isPlaying && queue.length < 1) {
      return null;
    }
    return <QueueListItem item={item} />;
  }, []);

  return (
    <VirtualList<QueueItem>
      maxHeight={height}
      data={queue}
      renderHeader={
        renderHeader
          ? () => renderHeader(refetch, loading, clearQueue)
          : undefined
      }
      keyExtractor={item => item.id + item.playlistIndex}
      renderEmpty={
        loading
          ? () => <Spinner />
          : error
            ? () => <div>{error}</div>
            : undefined
      }
      renderItem={renderItem}
    />
  );
};

const QueueListItem = memo<{ item: QueueItem }>(({ item }) => {
  return (
    <MediaGrid numberOfColumns={1}>
      <MediaTrack
        css={item.isPlaying ? styles.itemPlaying : undefined}
        imageUrl={item.artworkUrl}
        title={item.title}
        artist={`${item.artist}${item.album ? ` • ${item.album}` : ""}`}
        onClick={item.skipToItem}
        buttons={[
          { onClick: item.deleteItem, icon: "mdi:delete" },
          {
            onClick: () => {
              if (item.moveItem) {
                return item.moveItem(item.playlistIndex - 1);
              }
              if (item.moveItemUp) {
                return item.moveItemUp();
              }
            },
            disabled: item.isFirst,
            icon: "mdi:arrow-up-bold-outline",
          },
          {
            onClick: () => {
              if (item.moveItem) {
                return item.moveItem(item.playlistIndex + 1);
              }
              if (item.moveItemDown) {
                return item.moveItemDown();
              }
            },
            disabled: item.isLast,
            icon: "mdi:arrow-down-bold-outline",
          },
        ]}
      />
    </MediaGrid>
  );
});
