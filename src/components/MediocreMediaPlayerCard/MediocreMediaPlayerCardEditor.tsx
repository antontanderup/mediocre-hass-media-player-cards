import { HomeAssistant, MediocreMediaPlayerCardConfigSchema } from "@types";
import { MediocreMediaPlayerCardConfig } from "@types";
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
} from "@components";
import { css } from "@emotion/react";
import { FC } from "preact/compat";
import { HaSearchMediaTypesEditor } from "@components/HaSearch/HaSearchMediaTypesEditor";
import {
  getDefaultValuesFromConfig,
  getSimpleConfigFromFormValues,
} from "@utils/cardConfigUtils";

export type MediocreMediaPlayerCardEditorProps = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: MediocreMediaPlayerCardConfig;
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

      <SubForm title="Interactions" error={getSubformError("action")}>
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
                  field.handleChange(value ?? null);
                }}
                label="Search target (Optional, if not set, will use the main entity_id)"
                error={getFieldError(field)}
                domains={["media_player"]}
              />
            )}
          </form.Field>
        </FormGroup>
        <form.Field name="search.media_types">
          {field => (
            <HaSearchMediaTypesEditor
              entityId={config.search?.entity_id ?? config.entity_id ?? ""}
              hass={hass}
              mediaTypes={field.state.value ?? []}
              onChange={value => {
                field.handleChange(value ?? []);
              }}
            />
          )}
        </form.Field>
      </SubForm>

      <SubForm
        title="Music Assistant Configuration (optional)"
        error={
          getSubformError("ma_entity_id") ??
          getSubformError("ma_favorite_button_entity_id")
        }
      >
        <form.Field name="ma_entity_id">
          {field => (
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
          )}
        </form.Field>
        <form.Field name="ma_favorite_button_entity_id">
          {field => (
            <FormGroup>
              <EntityPicker
                hass={hass}
                value={field.state.value ?? ""}
                onChange={value => {
                  field.handleChange(value ?? null);
                }}
                label="MA Favorite Button Entity ID (Optional)"
                error={getFieldError(field)}
                domains={["button"]}
              />
            </FormGroup>
          )}
        </form.Field>
      </SubForm>

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
      <SubForm
        title="Additional options (optional)"
        error={getSubformError("options")}
      >
        <form.Field name="options.always_show_power_button">
          {field => (
            <ToggleContainer>
              <Toggle
                id="options.always_show_power_button"
                checked={field.state.value ?? false}
                onChange={e =>
                  field.handleChange((e.target as HTMLInputElement).checked)
                }
              />
              <ToggleLabel htmlFor="options.always_show_power_button">
                Always show power button
              </ToggleLabel>
            </ToggleContainer>
          )}
        </form.Field>
        <form.Field name="options.always_show_custom_buttons">
          {field => (
            <ToggleContainer>
              <Toggle
                id="options.always_show_custom_buttons"
                checked={field.state.value ?? false}
                onChange={e =>
                  field.handleChange((e.target as HTMLInputElement).checked)
                }
              />
              <ToggleLabel htmlFor="options.always_show_custom_buttons">
                Always show custom buttons panel below card
              </ToggleLabel>
            </ToggleContainer>
          )}
        </form.Field>
      </SubForm>
    </form>
  );
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
