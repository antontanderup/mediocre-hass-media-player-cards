import type {
  InteractionConfig,
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
import { useActionProps } from "@hooks";
import { Chip } from "@components";

const styles = {
  root: css({
    padding: 16,
    display: "grid",
    gridTemplateRows: "1fr auto",
    gridTemplateColumns: "1fr",
  }),
  massive: css({
    overflow: "hidden",
  }),
  customButtons: css({
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: "8px",
    marginTop: "12px",
  })
};

export type MassiveViewViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const MassiveViewView = ({ mediaPlayer, height }: MassiveViewViewProps) => {
  const { rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const massiveConfig: MediocreMassiveMediaPlayerCardConfig = useMemo(() => {
    return {
      ...mediaPlayer,
      mode: "multi",
      type: "custom:mediocre-massive-media-player-card",
    };
  }, [mediaPlayer]);

  return (
    <div css={styles.root} style={{ height }}>
      <CardContextProvider rootElement={rootElement} config={massiveConfig}>
        <MediocreMassiveMediaPlayerCard css={styles.massive} />
      </CardContextProvider>
      <div css={styles.customButtons}>
        {mediaPlayer.custom_buttons?.map((button, index) => (
          <CustomButton key={index} button={button} rootElement={rootElement} entityId={mediaPlayer.entity_id} />
        ))}
      </div>
    </div>
  );
};

const CustomButton = ({
  button,
  rootElement,
  entityId,
}: {
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
  entityId: string;
  rootElement: HTMLElement;
}) => {
  const { icon, name, ...actionConfig } = button;
  const actionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: entityId,
    },
  });

  return (
    <Chip icon={icon} {...actionProps}>
      {!!name && <span>{name}</span>}
      {actionProps.renderLongPressIndicator()}
    </Chip>
  );
};
