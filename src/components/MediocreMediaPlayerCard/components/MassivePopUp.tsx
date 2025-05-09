import { useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextType,
  CardContextProvider,
} from "@components/CardContext";
import {
  MediocreMassiveMediaPlayerCard,
  IconButton,
  Icon,
  useHass,
  usePlayer,
} from "@components";
import { css, keyframes } from "@emotion/react";
import { useActionProps } from "@hooks";
import { MediocreMediaPlayerCardConfig } from "@types";
import { getDeviceIcon } from "@utils";

const slideUp = keyframes`
  from {
    transform: translateY(15%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const headerHeight = 58;

const styles = {
  overlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 8, // Above header and below dialogs
    transition: "opacity 0.3s ease-in-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    "@media screen and (min-height: 832px)": {
      alignItems: "center",
    },
  }),
  clickableBackground: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  }),
  popUpContainer: css({
    animation: `${slideUp} 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
    maxHeight: "98vh",
    height: "fit-content",
    width: "424px",
    maxWidth: "98vw",
    backgroundColor: "var(--ha-card-background, var(--card-background-color))",
    overflow: "hidden",
    boxShadow: "0px 10px 20px var(--clear-background-color)",
    borderTopLeftRadius: "var(--ha-dialog-border-radius, 28px)",
    borderTopRightRadius: "var(--ha-dialog-border-radius, 28px)",
    "@media screen and (min-height: 832px)": {
      borderRadius: "var(--ha-dialog-border-radius, 28px)",
      boxShadow: "0px 0px 20px var(--clear-background-color)",
    },
    "@media (prefers-color-scheme: light)": {
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
    },
  }),
  popUpContent: css({
    display: "grid",
    height: "100%",
  }),
  popUpHeader: css({
    display: "flex",
    height: headerHeight,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0px 16px",
    borderBottom: "1px solid var(--divider-color, rgba(0, 0, 0, 0.12))",
    gap: "8px",
  }),
  title: css({
    margin: 0,
    fontSize: "18px",
    fontWeight: 500,
    color: "var(--primary-text-color, #212121)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: "auto",
  }),
  massiveCard: css({
    maxHeight: `calc(98vh - ${headerHeight}px)`,
    maxWidth: "98vw",
    width: "100%",
    height: "100%",
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
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { entity_id, speaker_group } = config;
  const {
    attributes: {
      friendly_name: friendlyName,
      icon,
      device_class: deviceClass,
    },
  } = usePlayer();

  const groupMembers =
    hass.states[speaker_group?.entity_id ?? entity_id]?.attributes
      ?.group_members;
  const mdiIcon = getDeviceIcon({ icon, deviceClass });

  const massiveConfig = useMemo(() => {
    const { tap_opens_popup: _tap_opens_popup, ...commonConfig } = config;
    return {
      ...commonConfig,
      mode: "popup",
    };
  }, [config]);

  const moreInfoButtonProps = useActionProps({
    rootElement,
    actionConfig: {
      tap_action: {
        action: "more-info",
      },
      entity: entity_id,
    },
  });

  if (!visible) {
    return null;
  }

  return (
    <div css={styles.overlay}>
      <div css={styles.clickableBackground} onClick={() => setVisible(false)} />
      <div css={styles.popUpContainer}>
        <div css={styles.popUpHeader}>
          <Icon size={"small"} icon={mdiIcon} />
          <h2 css={styles.title}>
            {friendlyName}
            {groupMembers?.length > 1 && (
              <span> +{groupMembers.length - 1}</span>
            )}
          </h2>
          <IconButton
            size="small"
            {...moreInfoButtonProps}
            icon="mdi:dots-vertical"
          />
          <IconButton
            icon="mdi:close"
            size="small"
            onClick={() => setVisible(false)}
          />
        </div>
        <div css={styles.popUpContent}>
          <CardContextProvider rootElement={rootElement} config={massiveConfig}>
            <MediocreMassiveMediaPlayerCard css={styles.massiveCard} />
          </CardContextProvider>
        </div>
      </div>
    </div>
  );
};
