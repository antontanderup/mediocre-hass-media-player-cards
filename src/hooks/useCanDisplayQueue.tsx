import { usePlayer } from "@components";
import { getIsLmsPlayer, getHasMassFeatures } from "@utils";
import { useMemo } from "preact/hooks";
import { useHass } from "@components/HassContext";

export const useCanDisplayQueue = ({
  ma_entity_id,
  lms_entity_id,
}: {
  ma_entity_id?: string | null;
  lms_entity_id?: string | null;
}) => {
  const player = usePlayer();
  const hass = useHass();

  const canDisplayQueue = useMemo(() => {
    const canDisplayLMSQueue =
      lms_entity_id &&
      getIsLmsPlayer(player, lms_entity_id) &&
      !!hass.services["lyrion_cli"];

    const canDisplayMAQueue =
      ma_entity_id &&
      getHasMassFeatures(player.entity_id, ma_entity_id) &&
      !!hass.services["mass_queue"];

    return !!canDisplayLMSQueue || !!canDisplayMAQueue;
  }, [player, lms_entity_id, ma_entity_id, hass]);

  return canDisplayQueue;
};
