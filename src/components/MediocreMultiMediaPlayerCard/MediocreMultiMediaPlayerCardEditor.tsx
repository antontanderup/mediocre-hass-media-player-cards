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
  SubForm,
  FormSelect,
  Button,
} from "@components";
import { css } from "@emotion/react";
import { FC, Fragment } from "preact/compat";
import { getAllMassPlayers } from "@utils";
import { useAppForm } from "@components/Form/hooks/useAppForm";
import { FieldGroupMediaBrowser } from "@components/Form/components/FieldGroupMediaBrowser";
import { FieldGroupCustomButtons } from "@components/Form/components/FieldGroupCustomButtons";
import { FieldGroupMaEntities } from "@components/Form/components/FieldGroupMaEntities";
import { FieldGroupSearch } from "@components/Form/components/FieldGroupSearch";
import { getSearchEntryArray } from "@utils/getSearchEntryArray";

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
          search: getSearchEntryArray(mp.search, mp.entity_id),
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
      media_browser: [{ entity_id: player.entity_id, name: "Music Assistant" }],
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
        css={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
        })}
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
                        {
                          icon: "mdi:arrow-up",
                          onClick: () => {
                            field.moveValue(index, index - 1);
                          },
                        },
                        {
                          icon: "mdi:arrow-down",
                          onClick: () => {
                            field.moveValue(index, index + 1);
                          },
                        },
                      ]}
                    >
                      <FormGroup>
                        <form.AppField
                          name={`media_players[${index}].name`}
                          children={subField => (
                            <subField.Text label="Name (optional)" />
                          )}
                        />
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
                        title="LMS Configuration (optional)"
                        error={getSubformError(
                          `media_players[${index}].lms_entity_id`
                        )}
                      >
                        <form.AppField
                          name={`media_players[${index}].lms_entity_id`}
                          children={field => (
                            <field.EntityPicker
                              label="LMS Media Player Entity ID"
                              domains={["media_player"]}
                            />
                          )}
                        />
                      </SubForm>
                      <SubForm
                        title="Search Configuration (optional) (not for music assistant)"
                        error={getSubformError(
                          `media_players[${index}].search`
                        )}
                      >
                        <FieldGroupSearch
                          form={form}
                          fields={{
                            search: `media_players[${index}].search`,
                            ma_entity_id: `media_players[${index}].ma_entity_id`,
                          }}
                        />
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
        <FormGroup>
          <form.AppField
            name="height"
            children={field => <field.Text label="Height" />}
          />
          <form.AppField
            name="options.transparent_background_on_home"
            children={field => (
              <field.Toggle label="Hide the card background on the home tab (massive player)" />
            )}
          />
          <form.AppField
            name="options.show_volume_step_buttons"
            children={field => (
              <field.Toggle label="Show volume step buttons + - on volume sliders" />
            )}
          />
          <form.AppField
            name="options.use_volume_up_down_for_step_buttons"
            children={field => (
              <field.Toggle label="Use volume_up and volume_down services for step buttons (breaks volume sync when step buttons are used)" />
            )}
          />
        </FormGroup>
      </SubForm>
    </form.AppForm>
  );
};
