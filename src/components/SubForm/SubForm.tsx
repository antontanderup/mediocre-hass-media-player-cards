import { useState } from "preact/hooks";
import styled from "@emotion/styled";
import { IconButton } from "../IconButton";

const SubFormContainer = styled.div`
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: 8px;
  position: relative;
  margin-bottom: 16px;
  background-color: var(--card-background-color, #fff);
`;

const SubFormHeader = styled.div<{ $expanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: ${(props) =>
    props.$expanded ? "1px solid var(--divider-color, #e0e0e0)" : "none"};
`;

const SubFormTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const SubFormContent = styled.div<{ $expanded: boolean }>`
  padding: 16px;
  display: ${(props) => (props.$expanded ? "block" : "none")};
`;

export const SubForm = ({ title, children, initiallyExpanded = false }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <SubFormContainer>
      <SubFormHeader $expanded={expanded}>
        <SubFormTitle>{title}</SubFormTitle>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          Icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
          type="button"
          size={"small"}
        />
      </SubFormHeader>
      <SubFormContent $expanded={expanded}>{children}</SubFormContent>
    </SubFormContainer>
  );
};
