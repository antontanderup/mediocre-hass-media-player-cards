import { HomeAssistant } from "custom-card-helpers";
import { MediocreMassiveMediaPlayerCardConfig } from "../MediaPlayerCommon/config";
import { useCallback } from "preact/hooks";
import {
  Button,
  ButtonsContainer,
  DeleteButton,
  EntitiesPicker,
  EntityPicker,
  FormGroup,
  InputGroup,
  InteractionsPicker,
  Label,
  Select,
  TextInput,
} from "../FormElements";
import { SubForm } from "../SubForm/SubForm";

export type MediocreMassiveMediaPlayerCardEditorProps = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: MediocreMassiveMediaPlayerCardConfig;
};

export const MediocreMassiveMediaPlayerCardEditor = ({
  config,
  rootElement,
  hass,
}: MediocreMassiveMediaPlayerCardEditorProps) => {
  if (!config || !hass || !rootElement) {
    console.error("No config or hass");
  }

  const updateConfig = useCallback(
    (newConfig: MediocreMassiveMediaPlayerCardConfig) => {
      const event = new Event("config-changed", {
        bubbles: true,
        composed: true,
      });
      // @ts-ignore
      event.detail = { config: newConfig };
      rootElement.dispatchEvent(event);
    },
    [rootElement]
  );

  // Direct update function - creates a new config object and calls updateConfig
  const updateField = useCallback(
    (path: string, value: any) => {
      if (!config) return;

      const pathParts = path.split(".");
      const newConfig = { ...config };

      let current = newConfig;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = value;
      updateConfig(newConfig);
    },
    [config, updateConfig]
  );

  const addCustomButton = useCallback(() => {
    const newButtons: MediocreMassiveMediaPlayerCardConfig["custom_buttons"] = [
      ...(config.custom_buttons || []),
      {
        icon: "mdi:paper-roll",
        name: "New Button",
        tap_action: { action: "toggle-menu" },
      },
    ];

    updateConfig({
      ...config,
      custom_buttons: newButtons,
    });
  }, [config, updateConfig]);

  const removeCustomButton = useCallback(
    (index: number) => {
      const newButtons = [...(config.custom_buttons || [])];
      newButtons.splice(index, 1);

      updateConfig({
        ...config,
        custom_buttons: newButtons,
      });
    },
    [config, updateConfig]
  );

  const updateCustomButton = useCallback(
    (index: number, field: string, value: any) => {
      const newButtons = [...(config.custom_buttons || [])];
      newButtons[index] = {
        ...newButtons[index],
        [field]: value,
      };

      updateConfig({
        ...config,
        custom_buttons: newButtons,
      });
    },
    [config, updateConfig]
  );

  const updateButtonInteractions = useCallback(
    (index: number, interactions: any) => {
      const newButtons = [...(config.custom_buttons || [])];
      newButtons[index] = {
        ...newButtons[index],
        ...interactions,
      };

      updateConfig({
        ...config,
        custom_buttons: newButtons,
      });
    },
    [config, updateConfig]
  );

  if (!config || !hass) return null;

  // Ensure these properties exist with default values to avoid errors
  const safeConfig: typeof config = {
    ...config,
    speaker_group: config.speaker_group || { entity_id: "", entities: [] },
    custom_buttons: config.custom_buttons || [],
  };

  return (
    <form>
      <FormGroup>
        <EntityPicker
          hass={hass}
          value={safeConfig.entity_id}
          onChange={newValue => updateField("entity_id", newValue)}
          label="Media Player Entity"
          domains={["media_player"]}
          required
        />
      </FormGroup>

      <SubForm title="Display Mode">
        <Select
          options={[
            { name: "Panel", value: "panel" },
            { name: "Card", value: "card" },
            { name: "In Card", value: "in-card" },
          ]}
          onSelected={value => updateField("mode", value)}
          selected={config.mode || "panel"}
        />
      </SubForm>

      <FormGroup>
        <SubForm title="Interactions">
          <InteractionsPicker
            hass={hass}
            value={safeConfig.action || {}}
            onChange={newValue => updateField("action", newValue)}
          />
        </SubForm>
      </FormGroup>

      <FormGroup>
        <SubForm title="Speaker Group Configuration (optional)">
          <FormGroup>
            <EntityPicker
              hass={hass}
              value={safeConfig.speaker_group.entity_id}
              onChange={newValue =>
                updateField("speaker_group.entity_id", newValue)
              }
              label="Main Speaker Entity ID (Optional)"
              domains={["media_player"]}
            />
          </FormGroup>
          <Label>Select Speakers (including main speaker)</Label>
          <FormGroup>
            <EntitiesPicker
              hass={hass}
              value={safeConfig.speaker_group.entities}
              onChange={newValue =>
                updateField("speaker_group.entities", newValue)
              }
              label="Speaker Group Entities (including main speaker)"
              domains={["media_player"]}
            />
          </FormGroup>
        </SubForm>
      </FormGroup>

      <FormGroup>
        <ButtonsContainer>
          {safeConfig.custom_buttons.map((button, index) => {
            const { name, icon, ...interactions } = button;
            return (
              <SubForm title={`Button ${index} - ${button.name}`} key={index}>
                <FormGroup>
                  <InputGroup>
                    <TextInput
                      value={name || ""}
                      onChange={e => updateCustomButton(index, "name", e)}
                      hass={hass}
                      label={"Name"}
                    />
                  </InputGroup>

                  <InputGroup>
                    <TextInput
                      value={icon || ""}
                      onChange={e => updateCustomButton(index, "icon", e)}
                      hass={hass}
                      isIconInput
                      label={"Icon"}
                    />
                  </InputGroup>
                  <Label>Interactions</Label>
                  <InteractionsPicker
                    hass={hass}
                    value={interactions}
                    onChange={newValue =>
                      updateButtonInteractions(index, newValue)
                    }
                  />
                </FormGroup>
                <DeleteButton
                  type="button"
                  onClick={() => removeCustomButton(index)}
                >
                  Remove Button
                </DeleteButton>
              </SubForm>
            );
          })}
          <Button type="button" onClick={addCustomButton}>
            Add Custom Button
          </Button>
        </ButtonsContainer>
      </FormGroup>
    </form>
  );
};
