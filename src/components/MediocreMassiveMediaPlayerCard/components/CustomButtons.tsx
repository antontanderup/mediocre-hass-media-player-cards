import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import type {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMediaPlayerCardConfig,
} from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip } from "@components";
import { useActionProps } from "@hooks";

const CustomButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2px;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonChip = styled(Chip)`
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`;

export const CustomButtons = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { custom_buttons } = config;

  return (
    <CustomButtonsContainer>
      {custom_buttons.map((button, index) => (
        <CustomButton key={index} button={button} />
      ))}
    </CustomButtonsContainer>
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
    <ButtonChip icon={icon} {...actionProps}>
      {!!name && <span>{name}</span>}
      {actionProps.renderLongPressIndicator()}
    </ButtonChip>
  );
};
