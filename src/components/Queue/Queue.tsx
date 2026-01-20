import {
  MediaGrid,
  MediaTrack,
  Spinner,
  usePlayer,
  VirtualList,
} from "@components";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { QueueItem, useSqueezeboxQueue } from "@hooks";
import { getCanDisplayLmsQueue, getIsLmsPlayer } from "@utils";
import type { ComponentChildren } from "preact";
import { FC, useMemo, useCallback, memo } from "preact/compat";

type QueueProps = {
  height?: number;
  ma_entity_id?: string | null;
  lms_entity_id?: string | null;
  renderHeader?: (refetch: () => void, loading: boolean) => ComponentChildren;
};

const styles = {
  itemPlaying: css({
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
};

export const Queue: FC<QueueProps> = ({
  height,
  // ma_entity_id,
  lms_entity_id,
  renderHeader,
}) => {
  const player = usePlayer();
  const isMainEntityLmsPlayer = useMemo(
    () => lms_entity_id && getIsLmsPlayer(player, lms_entity_id),
    [player, lms_entity_id]
  );

  const { queue, loading, refetch, error } = useSqueezeboxQueue(
    lms_entity_id ?? "",
    !!isMainEntityLmsPlayer && getCanDisplayLmsQueue()
  );

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
        renderHeader ? () => renderHeader(refetch, loading) : undefined
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
            onClick: () => item.moveItem(item.playlistIndex - 1),
            disabled: item.isFirst,
            icon: "mdi:arrow-up-bold-outline",
          },
          {
            onClick: () => item.moveItem(item.playlistIndex + 1),
            disabled: item.isLast,
            icon: "mdi:arrow-down-bold-outline",
          },
        ]}
      />
    </MediaGrid>
  );
});
