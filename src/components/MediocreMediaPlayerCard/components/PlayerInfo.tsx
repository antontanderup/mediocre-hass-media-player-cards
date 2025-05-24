import { useContext } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMediaPlayerCardConfig } from "@types";
import { Icon, useHass, usePlayer } from "@components";
import { getDeviceIcon } from "@utils";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  }),
  friendlyName: css({
    fontSize: "11px",
    color: theme.colors.onCardMuted,
    opacity: 0.8,
    fontStyle: "italic",
  }),
};

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
    <div css={styles.root}>
      <Icon icon={mdiIcon} size={"xx-small"} />
      <span css={styles.friendlyName}>{playerName}</span>
      {groupMembers && groupMembers.length > 1 && (
        <span css={styles.friendlyName}>+{groupMembers.length - 1}</span>
      )}
    </div>
  );
};
