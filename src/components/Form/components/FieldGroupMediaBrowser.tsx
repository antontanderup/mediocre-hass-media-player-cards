import { MediaBrowserConfig } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { SubForm } from "@components/SubForm";
import {
  EntityPicker,
  FormGroup,
} from "@components/FormElements";
import { useHass } from "@components/HassContext";

type MediaBrowserFields = {
  media_browser: MediaBrowserConfig;
};

// These default values are not used at runtime, but the keys are needed for mapping purposes.
const defaultValues: MediaBrowserFields = {
  media_browser: [],
};

export const FieldGroupMediaBrowser = withFieldGroup({
  defaultValues,
  props: {},
  render: function Render({ group }) {
    const hass = useHass();

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
                      `Entry ${index}`
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
                        children={field => <field.Text label={"Name"} />}
                      />
                      <group.AppField
                        name={`media_browser[${index}].entity_id`}
                        children={field => (
                          <field.EntityPicker label={"Media Browser Entity ID"} domains={["media_player"]} />
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
              label="Add Media Browser"
              domains={["media_player"]}
            />
          </Fragment>
        )}
      </group.Field>
    );
  },
});
