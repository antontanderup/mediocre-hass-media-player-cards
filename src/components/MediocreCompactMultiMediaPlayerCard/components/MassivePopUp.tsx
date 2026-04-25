import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import {
  CardContext,
  CardContextType,
  CardContextProvider,
} from "@components/CardContext";
import {
  IconButton,
  Icon,
  useHass,
  usePlayer,
  MediocreLargeMultiMediaPlayerCard,
} from "@components";
import { css } from "@emotion/react";
import { useActionProps } from "@hooks";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { getDeviceIcon } from "@utils";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  titleContainer: css({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflow: "hidden",
  }),
  title: css({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  massiveCard: css({
    width: "100%",
    height: 754,
    overflow: "hidden",
  }),
};

export const MassivePopUp = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const hass = useHass();
  const { config, rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const { selectedPlayer } = useSelectedPlayer();
  const { entity_id, speaker_group_entity_id } = selectedPlayer || {};
  const {
    attributes: {
      friendly_name: friendlyName,
      icon,
      device_class: deviceClass,
    },
  } = usePlayer();

  const groupMembers =
    hass.states[speaker_group_entity_id ?? entity_id!]?.attributes
      ?.group_members;
  const mdiIcon = getDeviceIcon({ icon, deviceClass });

  const cardConfig = useMemo(() => {
    if (config.size === "large") return config;
    const {
      size: _size,
      tap_opens_popup: _tap_opens_popup,
      options,
      ...commonConfig
    } = config;
    return {
      ...commonConfig,
      entity_id,
      size: "large",
      mode: "in-card",
      disable_player_focus_switching: true,
      options: {
        hide_selected_player_header: true,
        transparent_background_on_home: true,
        player_is_active_when: options?.player_is_active_when,
        show_volume_step_buttons: options?.show_volume_step_buttons,
        use_volume_up_down_for_step_buttons:
          options?.use_volume_up_down_for_step_buttons,
      },
    };
  }, [config, entity_id]);

  const moreInfoButtonProps = useActionProps({
    rootElement,
    actionConfig: {
      tap_action: {
        action: "more-info",
      },
      entity: entity_id,
    },
  });

  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClosed = () => setVisible(false);
    dialog.addEventListener("closed", handleClosed);
    return () => dialog.removeEventListener("closed", handleClosed);
  }, [setVisible]);

  return (
    <ha-adaptive-dialog ref={dialogRef} hass={hass} open={visible}>
      <span slot="headerTitle" css={styles.titleContainer}>
        <Icon size="small" icon={mdiIcon} />
        <span css={styles.title}>
          {friendlyName}
          {groupMembers?.length > 1 && <span> +{groupMembers.length - 1}</span>}
        </span>
      </span>
      <span slot="headerActionItems">
        <IconButton
          size="small"
          {...moreInfoButtonProps}
          icon="mdi:dots-vertical"
        />
      </span>
      <CardContextProvider rootElement={rootElement} config={cardConfig}>
        <MediocreLargeMultiMediaPlayerCard css={styles.massiveCard} />
      </CardContextProvider>
    </ha-adaptive-dialog>
  );
};
