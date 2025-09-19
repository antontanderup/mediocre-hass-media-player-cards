import { useContext } from "preact/hooks";
import type {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip } from "@components";
import { useActionProps } from "@hooks";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  }),
  buttons: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: "8px 4px",
  }),
};

export type CustomButtonsViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
};

export const CustomButtonsView = ({ mediaPlayer }: CustomButtonsViewProps) => {
  const { custom_buttons } = mediaPlayer;

  return (
    <div css={styles.root}>
      <ViewHeader
        title="Shortcuts"
        subtitle="Quick access to your favorite actions"
      />
      <div css={styles.buttons}>
        {custom_buttons?.map((button, index) => (
          <CustomButton
            key={index}
            button={button}
            entityId={mediaPlayer.entity_id}
          />
        ))}
      </div>
    </div>
  );
};

const CustomButton = ({
  button,
  entityId,
}: {
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
  entityId: string;
}) => {
  const { rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
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
