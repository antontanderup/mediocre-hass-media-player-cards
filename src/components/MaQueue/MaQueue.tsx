import { css } from "@emotion/react";
import { searchStyles } from "@components/MediaSearch";
import { IconButton, MediaTrack, Spinner } from "@components";
import { useQueue } from "./useQueue";

export type MaQueueProps = {
  entityId: string;
  horizontalPadding?: number;
  maxHeight?: number;
};

const styles = {
  container: (horizontalPadding: number) =>
    css({
      "--mmpc-search-padding": `${horizontalPadding}px`,
    }),
  actions: css({
    display: "flex",
    gap: 4,
  }),
};

export const MaQueue = ({
  entityId,
  horizontalPadding = 0,
  maxHeight = 300,
}: MaQueueProps) => {
  const {
    queue,
    loading,
    removeQueueItem,
    playQueueItem,
    moveQueueItemUp,
    moveQueueItemDown,
    moveQueueItemNext,
  } = useQueue(entityId);

  if (loading) {
    return <Spinner />;
  }

  if (queue.length === 0) {
    return <p css={searchStyles.mediaEmptyText}>Queue is empty</p>;
  }

  return (
    <div
      css={[searchStyles.root, styles.container(horizontalPadding)]}
      style={{ maxHeight }}
    >
      <div css={searchStyles.resultsContainerSearchBarBottom}>
        {queue.map(item => (
          <MediaTrack
            key={item.queue_item_id}
            imageUrl={item.media_image}
            title={item.media_title}
            artist={item.media_artist}
            actions={
              <div css={styles.actions}>
                <IconButton
                  size="xx-small"
                  icon="mdi:play"
                  onClick={async e => {
                    e.stopPropagation();
                    await playQueueItem(item.queue_item_id);
                  }}
                />
                <IconButton
                  size="xx-small"
                  icon="mdi:arrow-up"
                  onClick={async e => {
                    e.stopPropagation();
                    await moveQueueItemUp(item.queue_item_id);
                  }}
                />
                <IconButton
                  size="xx-small"
                  icon="mdi:arrow-down"
                  onClick={async e => {
                    e.stopPropagation();
                    await moveQueueItemDown(item.queue_item_id);
                  }}
                />
                <IconButton
                  size="xx-small"
                  icon="mdi:skip-next"
                  onClick={async e => {
                    e.stopPropagation();
                    await moveQueueItemNext(item.queue_item_id);
                  }}
                />
                <IconButton
                  size="xx-small"
                  icon="mdi:close"
                  onClick={async e => {
                    e.stopPropagation();
                    await removeQueueItem(item.queue_item_id);
                  }}
                />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
