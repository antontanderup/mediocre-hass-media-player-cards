import { LinkedVolumePanel } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { css } from "@emotion/react";
import { EntityPicker, InputGroup } from "@components/FormElements";
import { FormGroup, Label, SubForm } from "@components";
import { useHass } from "@components/HassContext";

type VolumePanelFields = {
  linked_volume_panel?: LinkedVolumePanel | null;
};

const defaultValues: VolumePanelFields = {
  linked_volume_panel: {
    launch_from: "disabled",
    include_grouped_players: false,
    entities: [],
  },
};

const styles = {
  helperText: css({
    display: "block",
    marginBottom: "12px",
    opacity: 0.75,
    lineHeight: 1.4,
  }),
  selectRow: css({
    maxWidth: "360px",
    marginBottom: "16px",
  }),
  toggleRow: css({
    marginBottom: "16px",
  }),
  select: css({
    width: "100%",
    minHeight: "56px",
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid rgba(0, 0, 0, 0.18)",
    backgroundColor: "var(--card-background-color, #fff)",
    color: "var(--primary-text-color)",
    font: "inherit",
    boxSizing: "border-box",
    outline: "none",
    ":focus": {
      borderColor: "var(--primary-color)",
      boxShadow: "0 0 0 1px var(--primary-color)",
    },
  }),
  fieldLabel: css({
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
  }),
  entitySectionLabel: css({
    display: "block",
    margin: "4px 0 12px",
    fontWeight: 600,
  }),
  addEntity: css({
    marginTop: "12px",
  }),
};

export const FieldGroupVolumePanel = withFieldGroup({
  defaultValues,
  props: {},
  render: function Render({ group }) {
    const hass = useHass();

    return (
      <Fragment>
        <Label css={styles.helperText}>
          Configure which linked volume endpoints should appear for this player
          in the Volume Panel.
        </Label>
        <div css={styles.selectRow}>
          <group.Field name="linked_volume_panel.launch_from">
            {field => (
              <InputGroup>
                <Label css={styles.fieldLabel}>Launch Panel from</Label>
                <select
                  css={styles.select}
                  onChange={event =>
                    field.handleChange(
                      (event.target as HTMLSelectElement).value as
                        | "disabled"
                        | "trailing_volume_bar_button"
                    )
                  }
                  value={field.state.value ?? "disabled"}
                >
                  <option value="disabled">Disabled</option>
                  <option value="trailing_volume_bar_button">
                    Trailing Volume Button
                  </option>
                </select>
              </InputGroup>
            )}
          </group.Field>
        </div>
        <div css={styles.toggleRow}>
          <group.AppField
            name="linked_volume_panel.include_grouped_players"
            children={field => (
              <field.Toggle label="Include Grouped Players" />
            )}
          />
        </div>
        <Label css={styles.entitySectionLabel}>Volume Panel Entities</Label>
        <group.Field name="linked_volume_panel.entities" mode="array">
          {entitiesField => (
            <Fragment>
              {entitiesField.state.value?.map((entity, index) => (
                <SubForm
                  title={entity.name ?? entity.entity_id ?? `Entity ${index + 1}`}
                  buttons={[
                    {
                      icon: "mdi:delete",
                      onClick: () => entitiesField.removeValue(index),
                    },
                    {
                      icon: "mdi:arrow-up",
                      onClick: () => entitiesField.moveValue(index, index - 1),
                    },
                    {
                      icon: "mdi:arrow-down",
                      onClick: () => entitiesField.moveValue(index, index + 1),
                    },
                  ]}
                  key={index}
                >
                  <FormGroup>
                    <group.AppField
                      name={`linked_volume_panel.entities[${index}].entity_id`}
                      children={field => (
                        <field.EntityPicker
                          label="Media Player Entity ID"
                          domains={["media_player"]}
                          required
                        />
                      )}
                    />
                    <group.AppField
                      name={`linked_volume_panel.entities[${index}].name`}
                      children={field => <field.Text label="Name (optional)" />}
                    />
                    <group.AppField
                      name={`linked_volume_panel.entities[${index}].icon`}
                      children={field => (
                        <field.Text label="Icon (optional)" isIconInput />
                      )}
                    />
                    <group.AppField
                      name={`linked_volume_panel.entities[${index}].show_power`}
                      children={field => (
                        <field.Toggle label="Show power button for this media player" />
                      )}
                    />
                  </FormGroup>
                </SubForm>
              ))}
              <div css={styles.addEntity}>
                <EntityPicker
                  hass={hass}
                  value=""
                  onChange={value => {
                    if (!value) return;
                    entitiesField.pushValue({
                      entity_id: value,
                      name:
                        hass.states[value]?.attributes?.friendly_name ??
                        undefined,
                    });
                  }}
                  label="Add volume panel entity"
                  domains={["media_player"]}
                />
              </div>
            </Fragment>
          )}
        </group.Field>
      </Fragment>
    );
  },
});
