import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { Queue } from "@components";

export const QueueView = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { lms_entity_id, ma_entity_id } = config;

  return (
    <div style={{ "--mmpc-search-padding": `${12}px` }}>
      <Queue lms_entity_id={lms_entity_id} ma_entity_id={ma_entity_id} />
    </div>
  );
};
