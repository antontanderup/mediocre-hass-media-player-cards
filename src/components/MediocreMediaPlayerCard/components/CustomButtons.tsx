import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip, IconButton } from "@components";
import { useActionProps } from "@hooks";

const CustomButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
  padding-top: 16px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  gap: 2px;
`;

const ChipButton = styled(Chip)`
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`;

export const CustomButtons = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { custom_buttons } = config;

  return (
    <CustomButtonsContainer>
      {custom_buttons.map((button, index) => (
        <CustomButton key={index} button={button} />
      ))}
    </CustomButtonsContainer>
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
    <ChipButton icon={icon} {...actionProps}>
      {!!name && <span>{name}</span>}
      {actionProps.renderLongPressIndicator()}
    </ChipButton>
  );
};
