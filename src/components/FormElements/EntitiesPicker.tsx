import { HomeAssistant } from "custom-card-helpers";
import { useCallback } from "preact/hooks";
import styled from "@emotion/styled";
import { EntityPicker } from "./EntityPicker";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export type EntitiesPickerProps = {
  hass: HomeAssistant;
  value: string[]; // entity_id
  onChange: (value?: string[]) => void; // returns new entity id or undefined
  label?: string;
  domains?: string[]; // Optional domain to filter entities
  disabled?: boolean;
  allowCustomEntity?: boolean;
};

export const EntitiesPicker = ({
  hass,
  value,
  onChange,
  label,
  domains,
  disabled = false,
  allowCustomEntity = false,
}: EntitiesPickerProps) => {
  // Filter out undefined/null values
  const entities = value?.filter(Boolean) || [];

  // Handle individual entity change
  const handleEntityChange = useCallback(
    (newEntityId: string | undefined, index: number) => {
      const newEntities = [...entities];

      // If the value is empty and not the last one, remove it
      if (!newEntityId && index < entities.length) {
        newEntities.splice(index, 1);
      }
      // If we're changing an existing entity
      else if (index < entities.length) {
        newEntities[index] = newEntityId || "";
      }
      // If we're adding a new entity (from the empty slot)
      else if (newEntityId) {
        newEntities.push(newEntityId);
      }

      // Filter out any empty values that might have been added
      onChange(newEntities.filter(Boolean));
    },
    [entities, onChange]
  );

  return (
    <Root className="entities-picker">
      {label && <label>{label}</label>}

      {/* Render existing entities */}
      {entities.map((entityId, index) => (
        <EntityPicker
          key={`entity-${index}`}
          hass={hass}
          value={entityId}
          onChange={newValue => handleEntityChange(newValue, index)}
          domains={domains}
          disabled={disabled}
          required={false}
          allowCustomEntity={allowCustomEntity}
        />
      ))}

      {/* Always add one empty picker at the end */}
      <EntityPicker
        key="entity-new"
        hass={hass}
        value=""
        onChange={newValue => handleEntityChange(newValue, entities.length)}
        domains={domains}
        disabled={disabled}
        required={false}
        allowCustomEntity={allowCustomEntity}
      />
    </Root>
  );
};
