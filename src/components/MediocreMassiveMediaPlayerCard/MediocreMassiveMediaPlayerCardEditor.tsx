import {
  HomeAssistant,
  MediocreMassiveMediaPlayerCardConfigSchema,
} from "@types";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { useCallback, useEffect } from "preact/hooks";
import { useStore, ValidationErrorMap } from "@tanstack/react-form";
import {
  FormGroup,
  SubForm,
  FormSelect,
} from "@components";
import { css } from "@emotion/react";
import { FC } from "preact/compat";
import {
  getDefaultValuesFromMassiveConfig,
  getSimpleConfigFromMassiveFormValues,
} from "@utils/cardConfigUtils";
import { useAppForm } from "@components/Form/hooks/useAppForm";
import { FieldGroupMaEntities } from "@components/Form/components/FieldGroupMaEntities";
import { FieldGroupSearch } from "@components/Form/components/FieldGroupSearch";
import { FieldGroupMediaBrowser } from "@components/Form/components/FieldGroupMediaBrowser";
import { FieldGroupCustomButtons } from "@components/Form/components/FieldGroupCustomButtons";

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

  const form = useAppForm({
    defaultValues: getDefaultValuesFromMassiveConfig(config),
    validators: {
      onChange: MediocreMassiveMediaPlayerCardConfigSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        // autosave logic
        if (formApi.state.isValid) {
          const simpleConfig = getSimpleConfigFromMassiveFormValues(
            formApi.state.values
          );
          if (
            JSON.stringify(config) !==
            JSON.stringify(getSimpleConfigFromMassiveFormValues(simpleConfig))
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

  // Reset form when config changes externally
  useEffect(() => {
    const currentFormValues = form.state.values;
    const newConfigValues = getDefaultValuesFromMassiveConfig(config);

    // Check if the external config is different from current form values
    if (JSON.stringify(currentFormValues) !== JSON.stringify(newConfigValues)) {
      // Reset the form with the new config values
      form.reset(newConfigValues);
    }
  }, [config, form]);

  if (!config || !hass) return null;

  return (
    <form.AppForm>
      <form.AppField
        name="entity_id"
        children={field => (
          <field.EntityPicker
            label="Media Player Entity"
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
      </FormGroup>

      <SubForm title="Interactions" error={getSubformError("action")}>
        <form.AppField
          name="action"
          children={field => <field.InteractionsPicker />}
        />
      </SubForm>

      <SubForm
        title="Speaker Group Configuration (optional)"
        error={getSubformError("speaker_group")}
      >
        <form.AppField
          name="speaker_group.entity_id"
          children={field => (
            <field.EntityPicker
              label="Main Speaker Entity ID (Optional)"
              domains={["media_player"]}
            />
          )}
        />
        <form.AppField
          name="speaker_group.entities"
          children={field => (
            <field.EntitiesPicker
              label="Select Speakers (including main speaker)"
              domains={["media_player"]}
            />
          )}
        />
      </SubForm>

      <SubForm
        title="Music Assistant Configuration (optional)"
        error={
          getSubformError("ma_entity_id") ??
          getSubformError("ma_favorite_button_entity_id")
        }
      >
        <FieldGroupMaEntities
          form={form}
          fields={{
            ma_entity_id: "ma_entity_id",
            ma_favorite_button_entity_id: "ma_favorite_button_entity_id",
          }}
        />
      </SubForm>

      <SubForm title="Search (optional)" error={getSubformError("search")}>
        <FieldGroupSearch
          form={form}
          fallbackEntityId={config.entity_id}
          fields={{ search: "search", ma_entity_id: "ma_entity_id" }}
        />
      </SubForm>

      <SubForm
        title="Media Browser (optional)"
        error={getSubformError("media_browser")}
      >
        <FieldGroupMediaBrowser
          form={form}
          fields={{ media_browser: "media_browser" as never }} // todo this casting is stupid
        />
      </SubForm>

      <SubForm
        title="Custom Buttons (optional)"
        error={getSubformError("custom_buttons")}
      >
        <FieldGroupCustomButtons
          form={form}
          formErrors={formErrorMap as ValidationErrorMap<unknown>}
          fields={{ custom_buttons: "custom_buttons" as never }} // todo this casting is stupid
        />
      </SubForm>
      <SubForm
        title="Additional options (optional)"
        error={getSubformError("options")}
      >
        <form.AppField
          name="options.always_show_power_button"
          children={field => <field.Toggle label="Always show power button." />}
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
      </SubForm>
    </form.AppForm>
  );
};
