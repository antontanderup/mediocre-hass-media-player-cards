import type { MediocreMultiMediaPlayer } from "@types";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useIntl } from "@components/i18n";
import { memo, useMemo, useCallback } from "preact/compat";
import { usePlayer } from "@components/PlayerContext";
import { getCanDisplayLmsQueue, getIsLmsPlayer } from "@utils";
import { QueueItem, useSqueezeboxQueue } from "@hooks";
import { VirtualList } from "@components/VirtualList";
import { MediaGrid, MediaTrack } from "@components/MediaSearch";
import { IconButton, Spinner } from "@components";
import { theme } from "@constants";

const styles = {
  root: css({
    height: "100%",
    overflowY: "auto",
  }),
  header: css({
    padding: 16,
    paddingBottom: 12,
  }),
  itemPlaying: css({
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
};

export type QueueViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const QueueView = memo<QueueViewProps>(
  ({ mediaPlayer: { lms_entity_id }, height }) => {
    const player = usePlayer();
    const isMainEntityLmsPlayer = useMemo(
      () => lms_entity_id && getIsLmsPlayer(player, lms_entity_id),
      [player, lms_entity_id]
    );
    const { t } = useIntl();

    const { queue, loading, refetch, error } = useSqueezeboxQueue(
      lms_entity_id ?? "",
      !!isMainEntityLmsPlayer && getCanDisplayLmsQueue()
    );

    const renderHeader = () => (
      <ViewHeader
        title={t({
          id: "MediocreMultiMediaPlayerCard.QueueView.up_next",
          defaultMessage: "Up Next",
        })}
        subtitle={t({
          id: "MediocreMultiMediaPlayerCard.QueueView.up_next_subtitle",
          defaultMessage: "Current playback queue",
        })}
        css={styles.header}
        renderAction={() => (
          <IconButton
            icon="mdi:refresh"
            onClick={refetch}
            size="x-small"
            disabled={loading}
          />
        )}
      />
    );

    const renderItem = useCallback((item: QueueItem) => {
      if (item.isPlaying && queue.length < 1) {
        return null;
      }
      return <QueueListItem item={item} />;
    }, []);

    return (
      <div
        css={styles.root}
        style={{ maxHeight: height, "--mmpc-search-padding": `${16}px` }}
      >
        <VirtualList<QueueItem>
          maxHeight={height}
          data={queue}
          renderHeader={renderHeader}
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
      </div>
    );
  }
);

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
