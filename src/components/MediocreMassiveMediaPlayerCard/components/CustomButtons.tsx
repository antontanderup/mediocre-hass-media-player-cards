import { useContext } from "preact/hooks";
import type {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMediaPlayerCardConfig,
} from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip } from "@components";
import { useActionProps } from "@hooks";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: "2px",
    overflowX: "auto",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
  chip: css({
    "&:first-child": {
      marginLeft: "16px",
    },
    "&:last-child": {
      marginRight: "16px",
    },
  }),
};

export const CustomButtons = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { custom_buttons } = config;

  return (
    <div css={styles.root}>
      {custom_buttons.map((button, index) => (
        <CustomButton key={index} button={button} />
      ))}
    </div>
  );
};

const CustomButton = ({
  button,
}: {
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
}) => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { icon, name, ...actionConfig } = button;
  const actionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: config.entity_id,
    },
  });

  return (
    <Chip css={styles.chip} icon={icon} {...actionProps}>
      {!!name && <span>{name}</span>}
      {actionProps.renderLongPressIndicator()}
    </Chip>
  );
};
