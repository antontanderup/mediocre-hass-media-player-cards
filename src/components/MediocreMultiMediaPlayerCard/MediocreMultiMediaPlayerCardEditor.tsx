import {
  HomeAssistant,
  MediocreMultiMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfigSchema,
} from "@types";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { useStore, ValidationErrorMap } from "@tanstack/react-form";
import {
  EntityPicker,
  FormGroup,
  Toggle,
  ToggleContainer,
  ToggleLabel,
  SubForm,
  FormSelect,
  Label,
  InputGroup,
  TextInput,
  Button,
} from "@components";
import { css } from "@emotion/react";
import { FC, Fragment } from "preact/compat";
import { HaSearchMediaTypesEditor } from "@components/HaSearch/HaSearchMediaTypesEditor";
import { getAllMassPlayers } from "@utils";
import { useAppForm } from "@components/Form/hooks/useAppForm";
import { FieldGroupMediaBrowser } from "@components/Form/components/FieldGroupMediaBrowser";
import { FieldGroupCustomButtons } from "@components/Form/components/FieldGroupCustomButtons";
import { FieldGroupMaEntities } from "@components/Form/components/FieldGroupMaEntities";

export type MediocreMultiMediaPlayerCardEditorProps = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: MediocreMultiMediaPlayerCardConfig;
};

export const MediocreMultiMediaPlayerCardEditor: FC<
  MediocreMultiMediaPlayerCardEditorProps
> = ({ config, rootElement, hass }) => {
  const updateConfigTimeout = useRef<number | null>(null);
  const updateConfig = useCallback(
    (newConfig: MediocreMultiMediaPlayerCardConfig) => {
      if (updateConfigTimeout.current) {
        clearTimeout(updateConfigTimeout.current);
      }
      updateConfigTimeout.current = window.setTimeout(() => {
        const event = new Event("config-changed", {
          bubbles: true,
          composed: true,
        });
        // @ts-expect-error its ok shh... we know what we're doing (we think)
        event.detail = { config: newConfig };
        rootElement.dispatchEvent(event);
      }, 500);
    },
    [rootElement]
  );

  const getDefaultValuesFromConfig = useCallback(
    (
      config?: MediocreMultiMediaPlayerCardConfig
    ): MediocreMultiMediaPlayerCardConfig => {
      if (!config) {
        return {
          type: "custom:mediocre-multi-media-player-card",
          entity_id: "",
          mode: "card",
          use_art_colors: true,
          media_players: [],
        };
      }
      return {
        ...config,
        media_players: config.media_players.map(mp => ({
          ...mp,
          media_browser: mp?.media_browser
            ? Array.isArray(mp.media_browser)
              ? mp.media_browser
              : [{ entity_id: mp.media_browser.entity_id ?? mp.entity_id }]
            : [],
        })),
      };
    },
    []
  );

  const form = useAppForm({
    defaultValues: getDefaultValuesFromConfig(config),
    validators: {
      onChange: MediocreMultiMediaPlayerCardConfigSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        // autosave logic
        const newConfig = Object.assign(formApi.state.values);
        const stripNulls = <T,>(obj: Record<string, T>) => {
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
      onChangeDebounceMs: 150,
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

  const getMusicAssistantPlayers = useCallback(() => {
    const maPlayers = getAllMassPlayers().filter(
      player => !player.attributes.active_child
    );
    return maPlayers.map(player => ({
      entity_id: player.entity_id,
      ma_entity_id: player.entity_id,
      can_be_grouped: true,
    }));
  }, []);

  // Reset form when config changes externally
  useEffect(() => {
    const currentFormValues = form.state.values;
    const newConfigValues = config;

    // Check if the external config is different from current form values
    if (JSON.stringify(currentFormValues) !== JSON.stringify(newConfigValues)) {
      // Reset the form with the new config values
      form.reset(getDefaultValuesFromConfig(newConfigValues));
    }
  }, [config, form]);

  if (!config || !hass) return null;

  return (
    <form.AppForm>
      <form.AppField
        name="entity_id"
        children={field => (
          <field.EntityPicker
            label="Default Media Player (used when no media player is active)"
            required
            domains={["media_player"]}
          />
        )}
      />
      <FormGroup
        css={css({ display: "flex", flexDirection: "row", gap: "16px" })}
      >
        <form.AppField
          name="use_art_colors"
          children={field => <field.Toggle label="Use album art colors." />}
        />
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
                        <form.Field name={`media_players[${index}].name`}>
                          {subField => (
                            <InputGroup>
                              <TextInput
                                value={subField.state.value ?? ""}
                                onChange={value => {
                                  if (value === "") {
                                    subField.handleChange(null);
                                  } else {
                                    subField.handleChange(value ?? null);
                                  }
                                }}
                                hass={hass}
                                label={"Name (optional)"}
                                error={getFieldError(subField)}
                              />
                            </InputGroup>
                          )}
                        </form.Field>
                        <form.AppField
                          name={`media_players[${index}].speaker_group_entity_id`}
                          children={subField => (
                            <subField.EntityPicker
                              label="Group Media Player (if different from above)"
                              domains={["media_player"]}
                            />
                          )}
                        />
                        <form.AppField
                          name={`media_players[${index}].can_be_grouped`}
                          children={subField => (
                            <subField.Toggle label="Enable speaker grouping (joining) for this player" />
                          )}
                        />
                      </FormGroup>
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
                        <FieldGroupMaEntities
                          form={form}
                          fields={{
                            ma_entity_id: `media_players[${index}].ma_entity_id`,
                            ma_favorite_button_entity_id: `media_players[${index}].ma_favorite_button_entity_id`,
                          }}
                        />
                      </SubForm>
                      <SubForm
                        title="Search Configuration (optional) (not for music assistant)"
                        error={getSubformError(
                          `media_players[${index}].search`
                        )}
                      >
                        <FormGroup>
                          <form.Field
                            name={`media_players[${index}].ma_entity_id`}
                          >
                            {tapField => (
                              <>
                                {(tapField.state.value?.length ?? 0) > 0 && (
                                  <Label>
                                    ma_entity_id is set. Any change in this
                                    section will not have any effect.
                                  </Label>
                                )}
                              </>
                            )}
                          </form.Field>
                          <form.Field
                            name={`media_players[${index}].search.enabled`}
                          >
                            {subField => (
                              <ToggleContainer>
                                <Toggle
                                  type="checkbox"
                                  id={`media_players[${index}].search.enabled`}
                                  checked={subField.state.value ?? false}
                                  onChange={e =>
                                    subField.handleChange(
                                      (e.target as HTMLInputElement).checked
                                    )
                                  }
                                />
                                <ToggleLabel htmlFor="search.enabled">
                                  Enable Search
                                </ToggleLabel>
                              </ToggleContainer>
                            )}
                          </form.Field>
                          <form.Field
                            name={`media_players[${index}].search.show_favorites`}
                          >
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
                          <form.Field
                            name={`media_players[${index}].search.entity_id`}
                          >
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
                          <form.Field
                            name={`media_players[${index}].search.entity_id`}
                          >
                            {tapField => (
                              <form.Field
                                name={`media_players[${index}].search.media_types`}
                              >
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
                      <SubForm
                        title="Media Browser (optional)"
                        error={getSubformError(
                          `media_players[${index}].media_browser`
                        )}
                      >
                        <FieldGroupMediaBrowser
                          form={form}
                          fields={{
                            media_browser:
                              `media_players[${index}].media_browser` as never,
                          }} // todo this casting is stupid
                        />
                      </SubForm>

                      <SubForm
                        title="Custom Buttons (optional)"
                        error={getSubformError(
                          `media_players[${index}].custom_buttons`
                        )}
                      >
                        <FieldGroupCustomButtons
                          form={form}
                          formErrors={
                            formErrorMap as ValidationErrorMap<unknown>
                          }
                          fields={{
                            custom_buttons:
                              `media_players[${index}].custom_buttons` as never,
                          }} // todo this casting is stupid
                        />
                      </SubForm>
                    </SubForm>
                  );
                })}
                <div
                  css={css({
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  })}
                >
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
                  <span>or</span>
                  <Button
                    type="button"
                    onClick={() => {
                      const newPlayers = getMusicAssistantPlayers();
                      newPlayers.forEach(newPlayer => {
                        field.pushValue(newPlayer);
                      });
                    }}
                  >
                    Add all Music Assistant media players
                  </Button>
                </div>
              </Fragment>
            );
          }}
        </form.Field>
      </SubForm>
      <SubForm title="Advanced" error={getSubformError("height")}>
        <form.Field name={"height"}>
          {field => (
            <InputGroup>
              <TextInput
                value={
                  typeof field.state.value === "number"
                    ? field.state.value.toString()
                    : (field.state.value ?? "")
                }
                onChange={value => field.handleChange(value ?? "")}
                hass={hass}
                label={"Height"}
                error={getFieldError(field)}
              />
            </InputGroup>
          )}
        </form.Field>
        <form.Field name={"options.transparent_background_on_home"}>
          {field => (
            <div>
              <Toggle
                id="options.transparent_background_on_home"
                checked={field.state.value}
                onChange={e =>
                  field.handleChange(
                    (e.target as HTMLInputElement)?.checked ?? false
                  )
                }
              />
              <ToggleLabel htmlFor="options.transparent_background_on_home">
                Hide the card background on the home tab (massive player)
              </ToggleLabel>
            </div>
          )}
        </form.Field>
        <form.Field name={"options.show_volume_step_buttons"}>
          {field => (
            <div>
              <Toggle
                id="options.show_volume_step_buttons"
                checked={field.state.value}
                onChange={e =>
                  field.handleChange(
                    (e.target as HTMLInputElement)?.checked ?? false
                  )
                }
              />
              <ToggleLabel htmlFor="options.show_volume_step_buttons">
                Show volume step buttons + - on volume sliders
              </ToggleLabel>
            </div>
          )}
        </form.Field>
        <form.Field name={"options.use_volume_up_down_for_step_buttons"}>
          {field => (
            <div>
              <Toggle
                id="options.use_volume_up_down_for_step_buttons"
                checked={field.state.value}
                onChange={e =>
                  field.handleChange(
                    (e.target as HTMLInputElement)?.checked ?? false
                  )
                }
              />
              <ToggleLabel htmlFor="options.use_volume_up_down_for_step_buttons">
                Use volume_up and volume_down services for step buttons (breaks
                volume sync when step buttons are used)
              </ToggleLabel>
            </div>
          )}
        </form.Field>
      </SubForm>
    </form.AppForm>
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
