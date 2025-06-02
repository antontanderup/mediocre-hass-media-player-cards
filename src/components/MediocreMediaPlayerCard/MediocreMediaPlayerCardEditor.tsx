import { HomeAssistant, MediocreMediaPlayerCardConfigSchema } from "@types";
import { MediocreMediaPlayerCardConfig } from "@types";
import { useCallback, useEffect } from "preact/hooks";
import { useForm } from "@tanstack/react-form";
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
  TextInput,
  Toggle,
  ToggleContainer,
  ToggleLabel,
  SubForm,
} from "@components";
import { css } from "@emotion/react";
import { FC } from "preact/compat";

export type MediocreMediaPlayerCardEditorProps = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: MediocreMediaPlayerCardConfig;
};

const getDefaultValuesFromConfig = (config: MediocreMediaPlayerCardConfig) => ({
  type: `custom:${import.meta.env.VITE_MEDIA_PLAYER_CARD}`,
  entity_id: config?.entity_id || "",
  use_art_colors: config?.use_art_colors ?? false,
  tap_opens_popup: config?.tap_opens_popup ?? false,
  action: config?.action || {},
  speaker_group: {
    entity_id: config?.speaker_group?.entity_id || undefined,
    entities: config?.speaker_group?.entities || [],
  },
  search: {
    enabled: config?.search?.enabled ?? false,
    show_favorites: config?.search?.show_favorites ?? false,
    entity_id: config?.search?.entity_id || undefined,
  },
  ma_entity_id: config?.ma_entity_id || undefined,
  custom_buttons: config?.custom_buttons || [],
});

// While not strictly nessary this removes unnessesary values from the config
const getSimpleConfigFromFormValues = (
  formValues: MediocreMediaPlayerCardConfig
) => {
  const config: MediocreMediaPlayerCardConfig & { type: string } = {
    type: `custom:${import.meta.env.VITE_MEDIA_PLAYER_CARD}`,
    entity_id: formValues.entity_id,
  };

  if (formValues.use_art_colors) {
    config.use_art_colors = formValues.use_art_colors;
  }

  if (formValues.tap_opens_popup) {
    config.tap_opens_popup = formValues.tap_opens_popup;
  }

  if (formValues.action && Object.keys(formValues.action).length > 0) {
    config.action = formValues.action;
  }

  if (
    formValues.speaker_group?.entity_id ||
    (formValues.speaker_group?.entities?.length ?? 0) > 0
  ) {
    config.speaker_group = {
      entities: formValues.speaker_group?.entities || [],
    };
    if (formValues.speaker_group?.entity_id) {
      config.speaker_group.entity_id = formValues.speaker_group.entity_id;
    }
  }

  if (
    formValues.search?.enabled ||
    formValues.search?.show_favorites ||
    formValues.search?.entity_id
  ) {
    config.search = {};
    if (formValues.search.enabled) {
      config.search.enabled = formValues.search.enabled;
    }
    if (formValues.search.show_favorites) {
      config.search.show_favorites = formValues.search.show_favorites;
    }
    if (formValues.search.entity_id) {
      config.search.entity_id = formValues.search.entity_id;
    }
  }

  if (formValues.ma_entity_id) {
    config.ma_entity_id = formValues.ma_entity_id;
  }

  if ((formValues.custom_buttons?.length ?? 0) > 0) {
    config.custom_buttons = formValues.custom_buttons;
  }

  return config;
};

export const MediocreMediaPlayerCardEditor: FC<
  MediocreMediaPlayerCardEditorProps
> = ({ config, rootElement, hass }) => {
  const updateConfig = useCallback(
    (newConfig: MediocreMediaPlayerCardConfig) => {
      const event = new Event("config-changed", {
        bubbles: true,
        composed: true,
      });
      // @ts-expect-error its ok shh... we know what we're doing (we think)
      event.detail = { config: newConfig };
      rootElement.dispatchEvent(event);
    },
    [rootElement]
  );

  const form = useForm({
    defaultValues: getDefaultValuesFromConfig(config),
    validators: {
      onChange: MediocreMediaPlayerCardConfigSchema,
    },
    onSubmit: ({ value }) => {
      updateConfig(getSimpleConfigFromFormValues(value));
    },
    listeners: {
      onChange: ({ formApi }) => {
        // autosave logic
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        } else {
          console.log(formApi.state.errors);
        }
      },
      onChangeDebounceMs: 500,
    },
  });

  const addCustomButton = useCallback(() => {
    const currentButtons = form.getFieldValue("custom_buttons") || [];
    form.setFieldValue("custom_buttons", [
      ...currentButtons,
      {
        icon: "mdi:paper-roll",
        name: "New Button",
        tap_action: { action: "toggle" },
      },
    ]);
  }, [form]);

  const removeCustomButton = useCallback(
    (index: number) => {
      const currentButtons = form.getFieldValue("custom_buttons") || [];
      const newButtons = [...currentButtons];
      newButtons.splice(index, 1);
      form.setFieldValue("custom_buttons", newButtons);
    },
    [form]
  );

  // Reset form when config changes externally
  useEffect(() => {
    const currentFormValues = form.state.values;
    const newConfigValues = getDefaultValuesFromConfig(config);

    // Check if the external config is different from current form values
    if (JSON.stringify(currentFormValues) !== JSON.stringify(newConfigValues)) {
      form.reset();
    }
  }, [config, form]);

  if (!config || !hass) return null;

  return (
    <form
      onSubmit={(e: {
        preventDefault: () => void;
        stopPropagation: () => void;
      }) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={state => [state.errorMap]}
        children={([errorMap]) =>
          errorMap.onChange ? (
            <div>
              <em>
                There was an error on the form: {errorMap.onChange.toString()}
              </em>
            </div>
          ) : null
        }
      />
      <form.Field name="entity_id">
        {field => (
          <FormGroup>
            <EntityPicker
              hass={hass}
              value={field.state.value}
              onChange={value => field.handleChange(value ?? "")}
              label="Media Player Entity"
              domains={["media_player"]}
              required
            />
          </FormGroup>
        )}
      </form.Field>
      <FormGroup
        css={css({ display: "flex", flexDirection: "row", gap: "16px" })}
      >
        <form.Field name="use_art_colors">
          {field => (
            <ToggleContainer>
              <Toggle
                id="use_art_colors"
                checked={field.state.value}
                onChange={e =>
                  field.handleChange(
                    (e.target as HTMLInputElement)?.checked ?? false
                  )
                }
              />
              <ToggleLabel htmlFor="use_art_colors">
                Use album art colors
              </ToggleLabel>
            </ToggleContainer>
          )}
        </form.Field>

        <form.Field name="tap_opens_popup">
          {field => (
            <ToggleContainer>
              <Toggle
                id="tap_opens_popup"
                checked={field.state.value}
                onChange={e =>
                  field.handleChange((e.target as HTMLInputElement).checked)
                }
              />
              <ToggleLabel htmlFor="tap_opens_popup">
                Tap opens popup.
              </ToggleLabel>
            </ToggleContainer>
          )}
        </form.Field>
      </FormGroup>
      <FormGroup>
        <SubForm title="Interactions">
          <form.Field name="tap_opens_popup">
            {tapField => (
              <>
                {tapField.state.value && (
                  <Label>Tap action overridden by "tap opens popup".</Label>
                )}
              </>
            )}
          </form.Field>
          <form.Field name="action">
            {field => (
              <InteractionsPicker
                hass={hass}
                value={field.state.value}
                onChange={value => field.handleChange(value ?? {})}
              />
            )}
          </form.Field>
        </SubForm>
      </FormGroup>
      <FormGroup>
        <SubForm title="Speaker Group Configuration (optional)">
          <form.Field name="speaker_group.entity_id">
            {field => (
              <FormGroup>
                <EntityPicker
                  hass={hass}
                  value={field.state.value || ""}
                  onChange={value => field.handleChange(value || undefined)}
                  label="Main Speaker Entity ID (Optional)"
                  domains={["media_player"]}
                />
              </FormGroup>
            )}
          </form.Field>

          <form.Field name="speaker_group.entities">
            {field => (
              <FormGroup>
                <EntitiesPicker
                  hass={hass}
                  value={field.state.value}
                  onChange={value => {
                    field.handleChange(value ?? []);
                  }}
                  label="Select Speakers (including main speaker)"
                  domains={["media_player"]}
                />
              </FormGroup>
            )}
          </form.Field>
        </SubForm>
      </FormGroup>
      <FormGroup>
        <SubForm title="Search (optional)">
          <FormGroup>
            <form.Field name="search.enabled">
              {field => (
                <ToggleContainer>
                  <Toggle
                    type="checkbox"
                    id="search.enabled"
                    checked={field.state.value}
                    onChange={e =>
                      field.handleChange((e.target as HTMLInputElement).checked)
                    }
                  />
                  <ToggleLabel htmlFor="search.enabled">
                    Enable Search
                  </ToggleLabel>
                </ToggleContainer>
              )}
            </form.Field>

            <form.Field name="search.enabled">
              {enabledField => (
                <>
                  {enabledField.state.value && (
                    <form.Field name="search.show_favorites">
                      {field => (
                        <ToggleContainer>
                          <Toggle
                            type="checkbox"
                            id="search.show_favorites"
                            checked={field.state.value}
                            onChange={e =>
                              field.handleChange(
                                (e.target as HTMLInputElement).checked
                              )
                            }
                          />
                          <ToggleLabel htmlFor="search.show_favorites">
                            Show Favorites when not searching
                          </ToggleLabel>
                        </ToggleContainer>
                      )}
                    </form.Field>
                  )}
                </>
              )}
            </form.Field>

            <form.Field name="search.entity_id">
              {field => (
                <EntityPicker
                  hass={hass}
                  value={field.state.value || ""}
                  onChange={value => field.handleChange(value || undefined)}
                  label="Search target (Optional, if not set, will use the main entity_id)"
                  domains={["media_player"]}
                />
              )}
            </form.Field>
          </FormGroup>
        </SubForm>
      </FormGroup>
      <FormGroup>
        <SubForm title="Music Assistant Configuration (optional)">
          <form.Field name="ma_entity_id">
            {field => (
              <FormGroup>
                <EntityPicker
                  hass={hass}
                  value={field.state.value || ""}
                  onChange={value => field.handleChange(value || undefined)}
                  label="Music Assistant Entity ID (Optional)"
                  domains={["media_player"]}
                />
              </FormGroup>
            )}
          </form.Field>
        </SubForm>
      </FormGroup>
      <FormGroup>
        <SubForm title="Custom Buttons (optional)">
          <ButtonsContainer>
            <form.Field name="custom_buttons">
              {field => (
                <>
                  {field.state.value.map((button, index) => {
                    // const { name, icon, ...interactions } = button;
                    return (
                      <SubForm
                        title={`Button ${index} - ${button.name}`}
                        key={index}
                      >
                        <FormGroup>
                          <form.Field name={`custom_buttons[${index}].name`}>
                            {field => (
                              <InputGroup>
                                <TextInput
                                  value={field.state.value}
                                  onChange={value =>
                                    field.handleChange(value ?? "")
                                  }
                                  hass={hass}
                                  label={"Name"}
                                />
                              </InputGroup>
                            )}
                          </form.Field>

                          <form.Field name={`custom_buttons[${index}].icon`}>
                            {field => (
                              <InputGroup>
                                <TextInput
                                  value={field.state.value}
                                  onChange={value =>
                                    field.handleChange(value ?? "")
                                  }
                                  hass={hass}
                                  isIconInput
                                  label={"Icon"}
                                />
                              </InputGroup>
                            )}
                          </form.Field>
                          <Label>Interactions</Label>
                          <form.Field name={`custom_buttons[${index}]`}>
                            {field => {
                              const { name, icon, ...interactions } =
                                field.state.value;
                              return (
                                <InteractionsPicker
                                  hass={hass}
                                  value={interactions}
                                  onChange={newValue => {
                                    field.handleChange({
                                      name,
                                      icon,
                                      ...newValue,
                                    });
                                  }}
                                />
                              );
                            }}
                          </form.Field>
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
                </>
              )}
            </form.Field>
            <Button type="button" onClick={addCustomButton}>
              Add Custom Button
            </Button>
          </ButtonsContainer>
        </SubForm>
      </FormGroup>
    </form>
  );
};
