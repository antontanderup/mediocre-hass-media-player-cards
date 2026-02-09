import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { IconButton, Queue, useIntl } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { useCallback } from "preact/compat";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  root: css({
    maxHeight: 300,
    paddingBottom: 12,
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    overflowY: "auto",
  }),
  title: css({
    fontSize: "16px",
    fontWeight: 500,
    color: theme.colors.onCard,
    padding: 0,
    margin: 0,
  }),
  titleRow: css({
    padding: 12,
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
};

export const QueueView = () => {
  const { selectedPlayer: { lms_entity_id, ma_entity_id } = {} } =
    useSelectedPlayer();
  const { t } = useIntl();

  const renderHeader = useCallback(
    (refetch: () => void, loading: boolean) => (
      <div css={styles.titleRow}>
        <h3 css={styles.title}>
          {t({
            id: "MediocreMediaPlayerCard.QueueView.up_next",
            defaultMessage: "Up Next",
          })}
        </h3>
        <IconButton
          icon="mdi:refresh"
          onClick={refetch}
          size="x-small"
          disabled={loading}
        />
      </div>
    ),
    [t]
  );

  return (
    <div css={styles.root} style={{ "--mmpc-search-padding": `${12}px` }}>
      <Queue
        lms_entity_id={lms_entity_id}
        ma_entity_id={ma_entity_id}
        renderHeader={renderHeader}
      />
    </div>
  );
};
