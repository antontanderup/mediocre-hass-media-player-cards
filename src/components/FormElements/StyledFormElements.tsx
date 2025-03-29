import styled from "@emotion/styled";

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 16px;
  font-weight: 500;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--primary-color, #03a9f4);
  color: white;
  font-weight: 500;

  &:hover {
    background-color: var(--primary-color-dark, #007ac1);
  }
  align-self: flex-start;
`;

export const DeleteButton = styled(Button)`
  background-color: var(--error-color, #ff5252);

  &:hover {
    background-color: var(--error-color-dark, #c50b0b);
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const ToggleLabel = styled.label`
  margin-left: 8px;
  font-weight: normal;
`;

export const Toggle = styled.input`
  cursor: pointer;
`;
