import { useCallback, useContext } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMediaPlayerCardConfig } from "@types";
import styled from "@emotion/styled";
import { IconButton, useHass, usePlayer } from "@components";
import { fireEvent } from "custom-card-helpers";

const PlayerInfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
const FriendlyNameText = styled.span`
  font-size: 11px;
  color: var(--secondary-text-color, #888);
  opacity: 0.8;
  font-style: italic;
`;

export const PlayerInfo = () => {
  const hass = useHass();
  const { config, rootElement } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id, speaker_group } = config;
  const {
    attributes: { friendly_name: playerName, icon, device_class: deviceClass },
  } = usePlayer();
  const groupMembers =
    hass.states[speaker_group?.entity_id ?? entity_id]?.attributes
      ?.group_members;
  const mdiIcon = getDeviceIcon({ icon, deviceClass });

  const handleMoreInfo = useCallback(() => {
    fireEvent(rootElement, "hass-more-info", {
      entityId: entity_id,
    });
  }, []);

  return (
    <PlayerInfoWrap>
      <IconButton icon={mdiIcon} onClick={handleMoreInfo} size={"xx-small"} />
      <FriendlyNameText>{playerName}</FriendlyNameText>
      {groupMembers && groupMembers.length > 1 && (
        <FriendlyNameText>+{groupMembers.length - 1}</FriendlyNameText>
      )}
    </PlayerInfoWrap>
  );
};

export const getDeviceIcon = ({
  icon,
  deviceClass,
}: {
  icon?: string;
  deviceClass?: string;
}) => {
  if (icon) {
    return icon;
  }
  switch (deviceClass) {
    case "speaker":
      return "mdi:speaker";
    case "receiver":
      return "mdi:audio-video";
    default:
      return "mdi:speaker";
  }
};
