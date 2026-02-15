import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useIntl } from "@components/i18n";
import { memo, useCallback } from "preact/compat";
import { IconButton, Queue } from "@components";
import { theme } from "@constants";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  root: css({
    height: "100%",
    overflowY: "auto",
  }),
  header: css({
    padding: "12px 16px 12px 16px",
  }),
  itemPlaying: css({
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
  headerActions: css({
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  }),
};

export type QueueViewProps = {
  height: number;
};

export const QueueView = memo<QueueViewProps>(
  ({ height }) => {
    const { t } = useIntl();
    const { selectedPlayer } = useSelectedPlayer();
    const { lms_entity_id, ma_entity_id } = selectedPlayer!;

    const renderHeader = useCallback(
      (refetch: () => void, loading: boolean, clearQueue: () => void) => (
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
            <div css={styles.headerActions}>
              <IconButton
                icon="mdi:delete-sweep"
                onClick={clearQueue}
                size="x-small"
                disabled={loading}
              />
              <IconButton
                icon="mdi:refresh"
                onClick={refetch}
                size="x-small"
                disabled={loading}
              />
            </div>
          )}
        />
      ),
      [t]
    );

    return (
      <div
        css={styles.root}
        style={{ maxHeight: height, "--mmpc-search-padding": `${16}px` }}
      >
        <Queue
          height={height}
          lms_entity_id={lms_entity_id}
          ma_entity_id={ma_entity_id}
          renderHeader={renderHeader}
        />
      </div>
    );
  }
);
