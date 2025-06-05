import {
  HomeAssistant,
  MediocreMassiveMediaPlayerCardConfigSchema,
} from "@types";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { useCallback, useEffect } from "preact/hooks";
import { useForm, useStore } from "@tanstack/react-form";
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
  Select,
} from "@components";
import { css } from "@emotion/react";
import { FC } from "preact/compat";

export type MediocreMassiveMediaPlayerCardEditorProps = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: MediocreMassiveMediaPlayerCardConfig;
};

export const MediocreMassiveMediaPlayerCardEditor: FC<
  MediocreMassiveMediaPlayerCardEditorProps
> = ({ config, rootElement, hass }) => {
  const updateConfig = useCallback(
    (newConfig: MediocreMassiveMediaPlayerCardConfig) => {
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
      onChange: MediocreMassiveMediaPlayerCardConfigSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        // autosave logic
        if (formApi.state.isValid) {
          const simpleConfig = getSimpleConfigFromFormValues(
            formApi.state.values
          );
          if (
            JSON.stringify(config) !==
            JSON.stringify(getSimpleConfigFromFormValues(simpleConfig))
          ) {
            updateConfig(simpleConfig);
          }
        } else {
          console.log(formApi.state.errors);
        }
      },
      onChangeDebounceMs: 500,
    },
  });

  const formErrorMap = useStore(form.store, state => state.errorMap);
  const getSubformError = useCallback(
    (fieldName: string) => {
      return !!Object.keys(formErrorMap?.onChange ?? {}).find((key: string) =>
        key.startsWith(fieldName)
      );
    },
    [formErrorMap]
  );

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
      // Reset the form with the new config values
      form.reset(newConfigValues);
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
      <form.Field name="entity_id">
        {field => (
          <FormGroup>
            <EntityPicker
              hass={hass}
              value={field.state.value}
              onChange={value => field.handleChange(value ?? "")}
              label="Media Player Entity"
              domains={["media_player"]}
              error={getFieldError(field)}
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
      </FormGroup>
      <SubForm title="Display Mode" error={getSubformError("mode")}>
        <form.Field name="mode">
          {field => (
            <Select
              options={[
                { name: "Panel", value: "panel" },
                { name: "Card", value: "card" },
                { name: "In Card", value: "in-card" },
              ]}
              onSelected={value =>
                field.handleChange(
                  value as MediocreMassiveMediaPlayerCardConfig["mode"]
                )
              }
              selected={config.mode || "panel"}
            />
          )}
        </form.Field>
      </SubForm>

      <SubForm title="Interactions" error={getSubformError("action")}>
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

      <SubForm
        title="Speaker Group Configuration (optional)"
        error={getSubformError("speaker_group")}
      >
        <form.Field name="speaker_group.entity_id">
          {field => (
            <FormGroup>
              <EntityPicker
                hass={hass}
                value={field.state.value || ""}
                onChange={value => {
                  field.handleChange(value ?? null);
                }}
                label="Main Speaker Entity ID (Optional)"
                error={getFieldError(field)}
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
                value={field.state.value ?? []}
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

      <SubForm title="Search (optional)" error={getSubformError("search")}>
        <form.Field name="ma_entity_id">
          {tapField => (
            <>
              {(tapField.state.value?.length ?? 0) > 0 && (
                <Label>
                  ma_entity_id is already set. Any change in this section will
                  not have any effect.
                </Label>
              )}
            </>
          )}
        </form.Field>
        <FormGroup>
          <form.Field name="search.enabled">
            {field => (
              <ToggleContainer>
                <Toggle
                  type="checkbox"
                  id="search.enabled"
                  checked={field.state.value ?? false}
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
                          checked={field.state.value ?? false}
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
                value={field.state.value ?? ""}
                onChange={value => {
                  console.log("Search entity_id changed:", value);
                  field.handleChange(value ?? null);
                }}
                label="Search target (Optional, if not set, will use the main entity_id)"
                error={getFieldError(field)}
                domains={["media_player"]}
              />
            )}
          </form.Field>
        </FormGroup>
      </SubForm>

      <form.Field name="ma_entity_id">
        {field => (
          <SubForm
            title="Music Assistant Configuration (optional)"
            error={getFieldError(field)}
          >
            <FormGroup>
              <EntityPicker
                hass={hass}
                value={field.state.value ?? ""}
                onChange={value => {
                  field.handleChange(value ?? null);
                }}
                label="Music Assistant Entity ID (Optional)"
                error={getFieldError(field)}
                domains={["media_player"]}
              />
            </FormGroup>
          </SubForm>
        )}
      </form.Field>

      <SubForm
        title="Custom Buttons (optional)"
        error={getSubformError("custom_buttons")}
      >
        <ButtonsContainer>
          <form.Field name="custom_buttons">
            {field =>
              field.state.value?.map((button, index) => {
                return (
                  <SubForm
                    title={`Button ${index} - ${button.name}`}
                    error={getSubformError(`custom_buttons[${index}]`)}
                    key={index}
                  >
                    <FormGroup>
                      <form.Field name={`custom_buttons[${index}].name`}>
                        {field => (
                          <InputGroup>
                            <TextInput
                              value={field.state.value ?? ""}
                              onChange={value =>
                                field.handleChange(value ?? "")
                              }
                              hass={hass}
                              label={"Name"}
                              error={getFieldError(field)}
                            />
                          </InputGroup>
                        )}
                      </form.Field>

                      <form.Field name={`custom_buttons[${index}].icon`}>
                        {field => (
                          <InputGroup>
                            <TextInput
                              value={field.state.value ?? ""}
                              onChange={value =>
                                field.handleChange(value ?? "")
                              }
                              hass={hass}
                              isIconInput
                              label={"Icon"}
                              error={getFieldError(field)}
                            />
                          </InputGroup>
                        )}
                      </form.Field>
                      <Label>Interactions</Label>
                      <form.Field name={`custom_buttons[${index}]`}>
                        {field => {
                          const value = field.state.value ?? {
                            icon: "",
                            name: "",
                          };
                          const { name, icon, ...interactions } = value;
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
              })
            }
          </form.Field>
          <Button type="button" onClick={addCustomButton}>
            Add Custom Button
          </Button>
        </ButtonsContainer>
      </SubForm>
    </form>
  );
};

const getDefaultValuesFromConfig = (
  config: MediocreMassiveMediaPlayerCardConfig
): MediocreMassiveMediaPlayerCardConfig => ({
  type:
    config.type ?? `custom:${import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD}`,
  entity_id: config?.entity_id ?? "",
  use_art_colors: config?.use_art_colors ?? false,
  mode: config?.mode ?? "card",
  action: config?.action ?? {},
  speaker_group: {
    entity_id: config?.speaker_group?.entity_id ?? null,
    entities: config?.speaker_group?.entities ?? [],
  },
  search: {
    enabled: config?.search?.enabled ?? false,
    show_favorites: config?.search?.show_favorites ?? false,
    entity_id: config?.search?.entity_id ?? null,
  },
  ma_entity_id: config?.ma_entity_id ?? null,
  custom_buttons: config?.custom_buttons ?? [],
});

// While not strictly nessary this removes unnessesary values from the config
const getSimpleConfigFromFormValues = (
  formValues: MediocreMassiveMediaPlayerCardConfig
): MediocreMassiveMediaPlayerCardConfig => {
  const config: MediocreMassiveMediaPlayerCardConfig = { ...formValues };

  // Remove falsy or empty values
  if (!config.use_art_colors) delete config.use_art_colors;
  if (!config.action || Object.keys(config.action).length === 0)
    delete config.action;
  if (!config.ma_entity_id) delete config.ma_entity_id;
  if (!config.custom_buttons || config.custom_buttons.length === 0)
    delete config.custom_buttons;

  if (config.speaker_group?.entity_id === null) {
    delete config.speaker_group.entity_id;
  }

  // Handle speaker_group - remove if no entity_id and no entities
  if (
    !config.speaker_group?.entity_id &&
    (!config.speaker_group?.entities ||
      config.speaker_group.entities.length === 0)
  ) {
    delete config.speaker_group;
  }

  if (config.search?.entity_id === null) {
    delete config.search.entity_id;
  }
  // Handle search - remove if all search properties are falsy
  if (
    !config.search?.enabled &&
    !config.search?.show_favorites &&
    !config.search?.entity_id
  ) {
    delete config.search;
  }

  return config;
};

// Helper function to get field error message
const getFieldError = (field: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: { meta: { isValid: boolean; errors: any[] } };
}) =>
  !field.state.meta.isValid
    ? field.state.meta.errors
        .map(error =>
          typeof error === "string" ? error : error?.message || String(error)
        )
        .filter(Boolean)
        .join(", ")
    : undefined;
