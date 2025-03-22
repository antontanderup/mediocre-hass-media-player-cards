import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import type { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon/config";
import { CardContext, CardContextType } from "../../../utils";
import { Icon } from "../../Icon";
import { InteractionConfig } from "../../../types/actionTypes";
import { Chip } from "../../Chip";
import { IconButton } from "../../IconButton";
import { useActionProps } from "../../../hooks";

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
  gap: 12px;
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
  const { hass, rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { icon, name, ...actionConfig } = button;
  const actionProps = useActionProps({
    hass,
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
    <ChipButton {...actionProps}>
      {!!icon && <Icon icon={icon} size={"x-small"} />}
      {!!name && <span>{name}</span>}
    </ChipButton>
  );
};
