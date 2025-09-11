import { HomeAssistant, MediaPlayerConfigEntity } from "@types";
import { useCallback, useMemo } from "preact/hooks";
import { EntityPicker } from "./EntityPicker";
import { css } from "@emotion/react";
import { TextInput } from "./TextInput";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }),
  entityPickedWrap: css({
    display: "grid",
    gridTemplateColumns: "auto auto",
    gap: "8px",
  }),
};

export type EntitiesPickerProps = {
  hass: HomeAssistant;
  value: MediaPlayerConfigEntity[]; // entity_id
  onChange: (value?: MediaPlayerConfigEntity[]) => void; // returns new entity id or undefined
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
  const entities = useMemo(() => {
    const values = value?.filter(Boolean) || [];
    return values.map(value => {
      if (typeof value === "string") {
        return { entity: value, name: null };
      } else {
        return value;
      }
    });
  }, [value]);

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
        newEntities[index].entity = newEntityId || "";
      }
      // If we're adding a new entity (from the empty slot)
      else if (newEntityId) {
        newEntities.push({ entity: newEntityId, name: null });
      }

      // Filter out any empty values that might have been added
      handleOnChange(newEntities.filter(Boolean));
    },
    [entities, onChange]
  );

  const handleNameChange = useCallback(
    (newName: string | undefined, index: number) => {
      const newEntities = [...entities];
      if (index < entities.length) {
        newEntities[index].name = newName || null;
        handleOnChange(newEntities.filter(Boolean));
      }
    },
    [entities, onChange]
  );

  const handleOnChange = useCallback(
    (newValue?: MediaPlayerConfigEntity[]) => {
      onChange(
        newValue?.map(entity => {
          if (typeof entity === "string") return entity;
          if (entity.name) {
            return { entity: entity.entity, name: entity.name };
          } else {
            return entity.entity;
          }
        })
      );
    },
    [onChange]
  );

  return (
    <div css={styles.root} className="entities-picker">
      {label && <label>{label}</label>}

      {/* Render existing entities */}
      {entities.map((entity, index) => (
        <div key={`entity-${index}`} css={styles.entityPickedWrap}>
          <TextInput
            value={entity.name ?? ""}
            onChange={newValue => handleNameChange(newValue, index)}
            disabled={disabled}
            label="Name"
          />
          <EntityPicker
            hass={hass}
            value={entity.entity}
            onChange={newValue => handleEntityChange(newValue, index)}
            domains={domains}
            disabled={disabled}
            required={false}
            allowCustomEntity={allowCustomEntity}
          />
        </div>
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
    </div>
  );
};
