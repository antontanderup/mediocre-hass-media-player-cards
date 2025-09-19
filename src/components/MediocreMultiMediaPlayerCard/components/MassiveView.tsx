import type {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { css } from "@emotion/react";
import { useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { MediocreMassiveMediaPlayerCard } from "@components/MediocreMassiveMediaPlayerCard";
import { Icon, IconButton, useHass, usePlayer } from "@components";
import { getDeviceIcon } from "@utils";
import { useActionProps } from "@hooks";
import { theme } from "@constants/theme";

const styles = {
  root: css({
    padding: 16,
    display: "grid",
    gap: 24,
    gridTemplateRows: "auto 1fr",
    gridTemplateColumns: "1fr",
  }),
  massive: css({
    overflow: "hidden",
  }),
  massiveHeader: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "8px",
  }),
  title: css({
    margin: 0,
    fontSize: "18px",
    color: theme.colors.onCard,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: "auto",
  }),
};

export type MassiveViewViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const MassiveViewView = ({
  mediaPlayer,
  height,
}: MassiveViewViewProps) => {
  const hass = useHass();

  const { rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const {
    attributes: {
      friendly_name: friendlyName,
      icon,
      device_class: deviceClass,
    },
  } = usePlayer();

  const groupMembers =
    hass.states[mediaPlayer.speaker_group_entity_id ?? mediaPlayer.entity_id]
      ?.attributes?.group_members;
  const mdiIcon = getDeviceIcon({ icon, deviceClass });

  const moreInfoButtonProps = useActionProps({
    rootElement,
    actionConfig: {
      tap_action: {
        action: "more-info",
      },
      entity: mediaPlayer.entity_id,
    },
  });

  const massiveConfig: MediocreMassiveMediaPlayerCardConfig = useMemo(() => {
    return {
      ...mediaPlayer,
      mode: "multi",
      type: "custom:mediocre-massive-media-player-card",
    };
  }, [mediaPlayer]);

  return (
    <div css={styles.root} style={{ height }}>
      <div css={styles.massiveHeader}>
        <Icon size={"small"} icon={mdiIcon} />
        <span css={styles.title}>
          {friendlyName}
          {groupMembers?.length > 1 && <span> +{groupMembers.length - 1}</span>}
        </span>
        <IconButton
          size="small"
          {...moreInfoButtonProps}
          icon="mdi:dots-vertical"
        />
      </div>
      <CardContextProvider rootElement={rootElement} config={massiveConfig}>
        <MediocreMassiveMediaPlayerCard css={styles.massive} />
      </CardContextProvider>
    </div>
  );
};
