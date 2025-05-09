import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip, IconButton } from "@components";
import { useActionProps } from "@hooks";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    overflowX: "auto",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    paddingTop: "16px",
    paddingBottom: "16px",
    borderTop: "0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12))",
    gap: "2px",
  }),
  chip: css({
    "&:first-child": {
      marginLeft: 16,
    },
    "&:last-child": {
      marginRight: 16,
    },
  }),
};

export const CustomButtons = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { custom_buttons } = config;

  return (
    <div css={styles.root}>
      {custom_buttons.map((button, index) => (
        <CustomButton key={index} button={button} />
      ))}
    </div>
  );
};

export const CustomButton = ({
  button,
  type = "chip",
}: {
  type?: "chip" | "icon-button";
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
  if (type === "icon-button") {
    return (
      <IconButton
        icon={button.icon ?? "mdi:dots-vertical"}
        size={"x-small"}
        {...actionProps}
      />
    );
  }

  return (
    <Chip css={styles.chip} icon={icon} {...actionProps}>
      {!!name && <span>{name}</span>}
      {actionProps.renderLongPressIndicator()}
    </Chip>
  );
};
