import { useContext } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMediaPlayerCardConfig } from "@types";
import styled from "@emotion/styled";
import { Icon, useHass, usePlayer } from "@components";
import { getDeviceIcon } from "@utils";

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
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id, speaker_group } = config;
  const {
    attributes: { friendly_name: playerName, icon, device_class: deviceClass },
    state,
  } = usePlayer();
  const groupMembers =
    hass.states[speaker_group?.entity_id ?? entity_id]?.attributes
      ?.group_members;
  const mdiIcon = getDeviceIcon({ icon, deviceClass });

  if (state === "off") {
    return null;
  }
  return (
    <PlayerInfoWrap>
      <Icon icon={mdiIcon} size={"xx-small"} />
      <FriendlyNameText>{playerName}</FriendlyNameText>
      {groupMembers && groupMembers.length > 1 && (
        <FriendlyNameText>+{groupMembers.length - 1}</FriendlyNameText>
      )}
    </PlayerInfoWrap>
  );
};
