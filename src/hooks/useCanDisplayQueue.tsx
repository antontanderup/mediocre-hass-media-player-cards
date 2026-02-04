import { usePlayer } from "@components";
import {
  getCanDisplayLmsQueue,
  getCanDisplayMAQueue,
  getIsLmsPlayer,
  getHasMassFeatures,
} from "@utils";
import { useMemo } from "preact/hooks";

export const useCanDisplayQueue = ({
  ma_entity_id,
  lms_entity_id,
}: {
  ma_entity_id?: string | null;
  lms_entity_id?: string | null;
}) => {
  const player = usePlayer();

  const canDisplayQueue = useMemo(() => {
    const canDisplayLMSQueue =
      lms_entity_id &&
      getIsLmsPlayer(player, lms_entity_id) &&
      getCanDisplayLmsQueue();

    const canDisplayMAQueue =
      ma_entity_id &&
      getHasMassFeatures(player.entity_id, ma_entity_id) &&
      getCanDisplayMAQueue();

    return !!canDisplayLMSQueue || !!canDisplayMAQueue;
  }, [player, lms_entity_id, ma_entity_id]);

  return canDisplayQueue;
};
