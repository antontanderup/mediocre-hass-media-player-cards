import {
  HomeAssistant,
  MediocreMultiMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfigSchema,
} from "@types";
import { useCallback, useEffect } from "preact/hooks";
import { useForm, useStore } from "@tanstack/react-form";
import {
  EntitiesPicker,
  EntityPicker,
  FormGroup,
  Toggle,
  ToggleContainer,
  ToggleLabel,
  SubForm,
  FormSelect,
  Label,
} from "@components";
import { css } from "@emotion/react";
import { FC, Fragment } from "preact/compat";
import { HaSearchMediaTypesEditor } from "@components/HaSearch/HaSearchMediaTypesEditor";

export type MediocreMultiMediaPlayerCardEditorProps = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: MediocreMultiMediaPlayerCardConfig;
};

export const MediocreMultiMediaPlayerCardEditor: FC<
  MediocreMultiMediaPlayerCardEditorProps
> = ({ config, rootElement, hass }) => {
  const updateConfig = useCallback(
    (newConfig: MediocreMultiMediaPlayerCardConfig) => {
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
    defaultValues: config
      ? config
      : {
        type: "custom:mediocre-multi-media-player-card",
        entity_id: "",
        mode: "card",
        use_art_colors: true,
        media_players: [],
        speaker_group: {
          entities: [],
        },
      },
    validators: {
      onChange: MediocreMultiMediaPlayerCardConfigSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        // autosave logic
        const newConfig = Object.assign(formApi.state.values);
        const stripNulls = (obj: any) => {
          Object.keys(obj).forEach(key => {
            if (obj[key] === undefined || obj[key] === null) {
              delete obj[key];
            }
          });
        };
        stripNulls(newConfig);
        if (newConfig.search) {
          stripNulls(newConfig.search);
        }

        if (formApi.state.isValid) {
          if (JSON.stringify(config) !== JSON.stringify(newConfig)) {
            updateConfig(newConfig);
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

  // Reset form when config changes externally
  useEffect(() => {
    const currentFormValues = form.state.values;
    const newConfigValues = config;

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
              label="Default Media Player (used when no media player is active)"
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
        <form.Field name="mode">
          {field => (
            <FormSelect
              options={[
                { name: "Panel", value: "panel" },
                { name: "Card", value: "card" },
              ]}
              onSelected={value =>
                field.handleChange(
                  value as MediocreMultiMediaPlayerCardConfig["mode"]
                )
              }
              selected={config.mode || "panel"}
            />
          )}
        </form.Field>
      </FormGroup>
      <SubForm title="Media Players" error={getSubformError("media_players")}>
        <form.Field name="media_players" mode="array">
          {field => {
            return (
              <Fragment>
                {field.state.value.map((mediaPlayer, index) => {
                  return (
                    <SubForm
                      key={index}
                      title={
                        hass.states[mediaPlayer.entity_id]?.attributes
                          .friendly_name ||
                        mediaPlayer.entity_id ||
                        "Media Player"
                      }
                      buttons={[
                        {
                          icon: "mdi:delete",
                          onClick: () => field.removeValue(index),
                        },
                      ]}
                    >
                      <FormGroup>
                        <form.Field
                          key={index}
                          name={`media_players[${index}].entity_id`}
                        >
                          {subField => (
                            <EntityPicker
                              hass={hass}
                              value={subField.state.value}
                              onChange={value => {
                                subField.handleChange(value ?? "");
                              }}
                              label="Media Player"
                              domains={["media_player"]}
                              error={getFieldError(subField)}
                              required
                            />
                          )}
                        </form.Field>
                        <form.Field
                          key={index}
                          name={`media_players[${index}].speaker_group_entity_id`}
                        >
                          {subField => (
                            <EntityPicker
                              hass={hass}
                              value={subField.state.value ?? ""}
                              onChange={value => {
                                subField.handleChange(value ?? null);
                              }}
                              label="Group Media Player (if different from above)"
                              domains={["media_player"]}
                              error={getFieldError(subField)}
                              required
                            />
                          )}
                        </form.Field>
                        <SubForm
                          title="Music Assistant Integration (optional)"
                          error={
                            getSubformError(
                              `media_players[${index}].ma_entity_id`
                            ) ??
                            getSubformError(
                              `media_players[${index}].ma_favorite_button_entity_id`
                            )
                          }
                        >
                          <FormGroup>
                            <form.Field
                              key={index}
                              name={`media_players[${index}].ma_entity_id`}
                            >
                              {subField => (
                                <EntityPicker
                                  hass={hass}
                                  value={subField.state.value ?? ""}
                                  onChange={value => {
                                    subField.handleChange(value ?? null);
                                  }}
                                  label="Music Assistant Player (if set this enables MA specific features like search and queue transfer)"
                                  domains={["media_player"]}
                                  error={getFieldError(subField)}
                                  required
                                />
                              )}
                            </form.Field>
                            <form.Field
                              key={index}
                              name={`media_players[${index}].ma_favorite_button_entity_id`}
                            >
                              {subField => (
                                <EntityPicker
                                  hass={hass}
                                  value={subField.state.value ?? ""}
                                  onChange={value => {
                                    subField.handleChange(value ?? null);
                                  }}
                                  label="Music Assistant Favorite Button (entity_id of the MA button to mark current song as favorite)"
                                  domains={["button"]}
                                  error={getFieldError(subField)}
                                  required
                                />
                              )}
                            </form.Field>
                          </FormGroup>
                        </SubForm>
                        <SubForm title="Search Configuration (optional) (not for music assistant)"
                          error={
                            getSubformError(
                              `media_players[${index}].search`
                            )
                          }
                        >
                          <FormGroup>

                            <form.Field name={`media_players[${index}].ma_entity_id`}>
                              {tapField => (
                                <>
                                  {(tapField.state.value?.length ?? 0) > 0 && (
                                    <Label>
                                      ma_entity_id is set. Any change in this section will
                                      not have any effect.
                                    </Label>
                                  )}
                                </>
                              )}
                            </form.Field>
                            <form.Field name={`media_players[${index}].search.enabled`}>
                              {subField => (
                                <ToggleContainer>
                                  <Toggle
                                    type="checkbox"
                                    id={`media_players[${index}].search.enabled`}
                                    checked={subField.state.value ?? false}
                                    onChange={e =>
                                      subField.handleChange((e.target as HTMLInputElement).checked)
                                    }
                                  />
                                  <ToggleLabel htmlFor="search.enabled">
                                    Enable Search
                                  </ToggleLabel>
                                </ToggleContainer>
                              )}
                            </form.Field>
                            <form.Field name={`media_players[${index}].search.show_favorites`}>
                              {subField => (
                                <ToggleContainer>
                                  <Toggle
                                    type="checkbox"
                                    id="search.show_favorites"
                                    checked={subField.state.value ?? false}
                                    onChange={e =>
                                      subField.handleChange(
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
                            <form.Field name={`media_players[${index}].search.entity_id`}>
                              {subField => (
                                <EntityPicker
                                  hass={hass}
                                  value={subField.state.value ?? ""}
                                  onChange={value => {
                                    subField.handleChange(value ?? null);
                                  }}
                                  label="Search target (Optional, if not set, will use the main entity_id)"
                                  error={getFieldError(subField)}
                                  domains={["media_player"]}
                                />
                              )}
                            </form.Field>
                            <form.Field name={`media_players[${index}].search.entity_id`}>
                              {tapField => (
                                <form.Field name={`media_players[${index}].search.media_types`}>
                                  {subField => (
                                    <HaSearchMediaTypesEditor
                                      entityId={tapField.state.value ?? ""}
                                      hass={hass}
                                      mediaTypes={subField.state.value ?? []}
                                      onChange={value => {
                                        subField.handleChange(value ?? []);
                                      }}
                                    />
                                  )}
                                </form.Field>
                              )}
                            </form.Field>
                          </FormGroup>

                        </SubForm>
                      </FormGroup>
                    </SubForm>
                  );
                })}
                <EntityPicker
                  hass={hass}
                  value={""}
                  onChange={value => {
                    if (value) {
                      field.pushValue({ entity_id: value });
                    }
                  }}
                  label="Add a new media player"
                  domains={["media_player"]}
                />
              </Fragment>
            );
          }}
        </form.Field>
      </SubForm>

      <SubForm
        title="Speaker Group Configuration (optional)"
        error={getSubformError("speaker_group")}
      >
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
