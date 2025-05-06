import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch } from "@components/MaSearch";
import { css } from "@emotion/react";

const styles = {
  root: css({
    maxHeight: 300,
    paddingTop: 12,
    paddingBottom: 12,
    borderTop: "0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12))",
    overflowY: "auto",
  }),
};

export const Search = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { ma_entity_id } = config;

  return (
    <div css={styles.root}>
      <MaSearch maEntityId={ma_entity_id} horizontalPadding={12} />
    </div>
  );
};
