import { MediaBrowserConfig } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { SubForm } from "@components/SubForm";
import { EntityPicker, FormGroup } from "@components/FormElements";
import { useHass } from "@components/HassContext";
import { useIntl } from "@components/i18n";

type MediaBrowserFields = {
  media_browser: MediaBrowserConfig;
};

const defaultValues: MediaBrowserFields = {
  media_browser: [],
};

export const FieldGroupMediaBrowser = withFieldGroup({
  defaultValues,
  props: {},
  render: function Render({ group }) {
    const hass = useHass();
    const { t } = useIntl();

    return (
      <group.Field name="media_browser" mode="array">
        {mediaBrowserField => (
          <Fragment>
            {Array.isArray(mediaBrowserField.state.value) &&
              mediaBrowserField.state.value?.map((mediaBrowserEntry, index) => {
                return (
                  <SubForm
                    title={
                      mediaBrowserEntry.name ??
                      mediaBrowserEntry.entity_id ??
                      `${t({ id: "Editor.media_browser.entry" })} ${index}`
                    }
                    buttons={[
                      {
                        icon: "mdi:delete",
                        onClick: () => mediaBrowserField.removeValue(index),
                      },
                      {
                        icon: "mdi:arrow-up",
                        onClick: () => {
                          mediaBrowserField.moveValue(index, index - 1);
                        },
                      },
                      {
                        icon: "mdi:arrow-down",
                        onClick: () => {
                          mediaBrowserField.moveValue(index, index + 1);
                        },
                      },
                    ]}
                    key={index}
                  >
                    <FormGroup>
                      <group.AppField
                        name={`media_browser[${index}].name`}
                        children={field => (
                          <field.Text
                            label={t({ id: "Editor.media_browser.name" })}
                          />
                        )}
                      />
                      <group.AppField
                        name={`media_browser[${index}].entity_id`}
                        children={field => (
                          <field.EntityPicker
                            label={t({ id: "Editor.media_browser.entity_id" })}
                            domains={["media_player"]}
                          />
                        )}
                      />
                    </FormGroup>
                  </SubForm>
                );
              })}
            <EntityPicker
              hass={hass}
              value={""}
              onChange={value => {
                if (!value) return;
                mediaBrowserField.pushValue({
                  entity_id: value,
                  name:
                    hass.states[value]?.attributes.friendly_name ?? undefined,
                });
              }}
              label={t({ id: "Editor.media_browser.add" })}
              domains={["media_player"]}
            />
          </Fragment>
        )}
      </group.Field>
    );
  },
});
