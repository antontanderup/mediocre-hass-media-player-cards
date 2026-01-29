import type { MediocreMultiMediaPlayer } from "@types";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useIntl } from "@components/i18n";
import { memo, useCallback } from "preact/compat";
import { IconButton, Queue } from "@components";
import { theme } from "@constants";

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
};

export type QueueViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const QueueView = memo<QueueViewProps>(
  ({ mediaPlayer: { lms_entity_id, ma_entity_id }, height }) => {
    const { t } = useIntl();

    const renderHeader = useCallback(
      (refetch: () => void, loading: boolean) => (
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
