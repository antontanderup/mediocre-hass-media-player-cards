import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaQueue } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  root: css({
    maxHeight: 300,
    paddingTop: 12,
    paddingBottom: 12,
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    overflowY: "auto",
  }),
};

export const Queue = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { ma_entity_id } = config;

  if (!ma_entity_id) return null;

  return (
    <div css={styles.root}>
      <MaQueue entityId={ma_entity_id} horizontalPadding={12} />
    </div>
  );
};
