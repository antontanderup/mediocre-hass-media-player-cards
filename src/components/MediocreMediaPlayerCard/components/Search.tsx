import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch } from "@components/MaSearch";

export const Search = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { ma_entity_id } = config;

  return (
    <div
      css={{
        maxHeight: "300px",
        paddingTop: "12px",
        paddingBottom: "12px",
        borderTop: "0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12))",
        overflowY: "auto",
      }}
    >
      <MaSearch maEntityId={ma_entity_id} horizontalPadding={12} />
    </div>
  );
};
