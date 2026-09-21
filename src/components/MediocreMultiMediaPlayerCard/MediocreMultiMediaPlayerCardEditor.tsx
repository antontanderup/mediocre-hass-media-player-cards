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
  Label,
} from "@components";
import { useIntl } from "@components/i18n";
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
  const { t } = useIntl();
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
          size: "large",
          mode: "card",
          use_art_colors: true,
          media_players: [],
        };
      }

      const mediaPlayers = config.media_players.map(mp => ({
        ...mp,
        search: getSearchEntryArray(mp.search, mp.entity_id),
        media_browser: mp?.media_browser
          ? Array.isArray(mp.media_browser)
            ? mp.media_browser
            : [{ entity_id: mp.media_browser.entity_id ?? mp.entity_id }]
          : [],
      }));

      const isLarge = config.size === "large" || !config.size;
      if (isLarge) {
        const largeConfig = config as MediocreMultiMediaPlayerCardConfig & {
          size: "large";
        };
        return {
          ...largeConfig,
          size: "large",
          media_players: mediaPlayers,
        };
      }

      return {
        ...config,
        size: "compact",
        media_players: mediaPlayers,
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

  const size = useStore(form.store, state => state.values.size);

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
  }, [config, form]); // eslint-disable-line react-hooks/exhaustive-deps -- getDefaultValuesFromConfig is a stable imported function

  if (!config || !hass) return null;

  return (
    <form.AppForm>
      <form.AppField
        name="entity_id"
        children={field => (
          <field.EntityPicker
            label={t({ id: "Editor.multi.default_media_player" })}
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
          children={field => (
            <field.Toggle label={t({ id: "Editor.common.use_art_colors" })} />
          )}
        />
        <form.Field name="size">
          {field => (
            <FormSelect
              options={[
                { name: t({ id: "Editor.select.large" }), value: "large" },
                {
                  name: t({ id: "Editor.select.compact" }),
                  value: "compact",
                },
              ]}
              onSelected={value =>
                field.handleChange(value as "large" | "compact")
              }
              selected={field.state.value || "large"}
            />
          )}
        </form.Field>
        {size === "compact" && (
          <form.AppField
            name="tap_opens_popup"
            children={field => (
              <field.Toggle
                label={t({ id: "Editor.common.tap_opens_popup" })}
              />
            )}
          />
        )}
        {size === "large" && (
          <form.Field name="mode">
            {field => (
              <FormSelect
                options={[
                  { name: t({ id: "Editor.select.panel" }), value: "panel" },
                  { name: t({ id: "Editor.select.card" }), value: "card" },
                ]}
                onSelected={value =>
                  field.handleChange(value as "panel" | "card")
                }
                selected={field.state.value || "panel"}
              />
            )}
          </form.Field>
        )}
      </FormGroup>
      <SubForm
        title={t({ id: "Editor.multi.media_players" })}
        error={getSubformError("media_players")}
      >
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
                        t({ id: "Editor.multi.media_player_fallback" })
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
                            <subField.Text
                              label={t({ id: "Editor.common.name_optional" })}
                            />
                          )}
                        />
                        <form.AppField
                          name={`media_players[${index}].speaker_group_entity_id`}
                          children={subField => (
                            <subField.EntityPicker
                              label={t({
                                id: "Editor.multi.group_media_player",
                              })}
                              domains={["media_player"]}
                            />
                          )}
                        />
                        <form.AppField
                          name={`media_players[${index}].can_be_grouped`}
                          children={subField => (
                            <subField.Toggle
                              label={t({ id: "Editor.multi.enable_grouping" })}
                            />
                          )}
                        />
                      </FormGroup>
                      <SubForm
                        title={t({ id: "Editor.multi.ma_integration" })}
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
                        title={t({ id: "Editor.common.lms_config" })}
                        error={getSubformError(
                          `media_players[${index}].lms_entity_id`
                        )}
                      >
                        <form.AppField
                          name={`media_players[${index}].lms_entity_id`}
                          children={field => (
                            <field.EntityPicker
                              label={t({ id: "Editor.common.lms_entity" })}
                              domains={["media_player"]}
                            />
                          )}
                        />
                      </SubForm>
                      <SubForm
                        title={t({ id: "Editor.multi.search_config" })}
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
                        title={t({
                          id: "Editor.common.media_browser_optional",
                        })}
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
                        title={t({
                          id: "Editor.common.custom_buttons_optional",
                        })}
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
                    label={t({ id: "Editor.multi.add_media_player" })}
                    domains={["media_player"]}
                  />
                  <span>{t({ id: "Editor.multi.or" })}</span>
                  <Button
                    onClick={() => {
                      const newPlayers = getMusicAssistantPlayers();
                      newPlayers.forEach(newPlayer => {
                        field.pushValue(newPlayer);
                      });
                    }}
                  >
                    {t({ id: "Editor.multi.add_all_ma" })}
                  </Button>
                </div>
              </Fragment>
            );
          }}
        </form.Field>
      </SubForm>
      <SubForm
        title={t({ id: "Editor.multi.advanced" })}
        error={getSubformError("height")}
      >
        <FormGroup>
          {size === "large" && (
            <Fragment>
              <form.AppField
                name="height"
                children={field => (
                  <field.Text label={t({ id: "Editor.multi.height" })} />
                )}
              />
              <form.AppField
                name="options.transparent_background_on_home"
                children={field => (
                  <field.Toggle
                    label={t({ id: "Editor.multi.transparent_background" })}
                  />
                )}
              />
              <form.Field name="options.default_tab">
                {field => (
                  <div
                    css={css({
                      display: "flex",
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                      justifyContent: "space-between",
                    })}
                  >
                    <Label>{t({ id: "Editor.multi.default_tab" })}</Label>
                    <FormSelect
                      options={[
                        {
                          name: t({ id: "Editor.select.home" }),
                          value: "massive",
                        },
                        {
                          name: t({ id: "Editor.select.search" }),
                          value: "search",
                        },
                        {
                          name: t({ id: "Editor.select.media_browser" }),
                          value: "media-browser",
                        },
                        {
                          name: t({ id: "Editor.select.queue" }),
                          value: "queue",
                        },
                        {
                          name: t({ id: "Editor.select.custom_buttons" }),
                          value: "custom-buttons",
                        },
                        {
                          name: t({ id: "Editor.select.speaker_grouping" }),
                          value: "speaker-grouping",
                        },
                      ]}
                      onSelected={value =>
                        field.handleChange(
                          value as
                            | "massive"
                            | "search"
                            | "media-browser"
                            | "speaker-grouping"
                            | "custom-buttons"
                            | "queue"
                        )
                      }
                      selected={field.state.value || "massive"}
                    />
                  </div>
                )}
              </form.Field>
            </Fragment>
          )}
          {size === "compact" && (
            <Fragment>
              <form.AppField
                name="options.always_show_power_button"
                children={field => (
                  <field.Toggle
                    label={t({ id: "Editor.options.always_show_power_button" })}
                  />
                )}
              />
              <form.AppField
                name="options.always_show_custom_buttons"
                children={field => (
                  <field.Toggle
                    label={t({
                      id: "Editor.options.always_show_custom_buttons",
                    })}
                  />
                )}
              />
              <form.AppField
                name="options.hide_when_off"
                children={field => (
                  <field.Toggle
                    label={t({ id: "Editor.options.hide_when_off" })}
                  />
                )}
              />
              <form.AppField
                name="options.hide_when_group_child"
                children={field => (
                  <field.Toggle
                    label={t({ id: "Editor.options.hide_when_group_child" })}
                  />
                )}
              />
            </Fragment>
          )}
          <form.AppField
            name="options.show_volume_step_buttons"
            children={field => (
              <field.Toggle
                label={t({ id: "Editor.options.show_volume_step_buttons" })}
              />
            )}
          />
          <form.AppField
            name="options.use_volume_up_down_for_step_buttons"
            children={field => (
              <field.Toggle
                label={t({ id: "Editor.options.use_volume_up_down" })}
              />
            )}
          />
          <form.AppField
            name="options.use_experimental_lms_media_browser"
            children={field => (
              <field.Toggle
                label={t({ id: "Editor.options.use_experimental_lms" })}
              />
            )}
          />
          <form.Field name="options.player_is_active_when">
            {field => (
              <div
                css={css({
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                <Label>{t({ id: "Editor.multi.player_active_when" })}</Label>
                <FormSelect
                  options={[
                    {
                      name: t({ id: "Editor.select.playing" }),
                      value: "playing",
                    },
                    {
                      name: t({ id: "Editor.select.playing_or_paused" }),
                      value: "playing_or_paused",
                    },
                  ]}
                  onSelected={value =>
                    field.handleChange(value as "playing" | "playing_or_paused")
                  }
                  selected={field.state.value || "playing"}
                />
              </div>
            )}
          </form.Field>
        </FormGroup>
      </SubForm>
    </form.AppForm>
  );
};
