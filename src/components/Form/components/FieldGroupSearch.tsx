import { SearchConfig } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { EntityPicker, FormGroup } from "@components/FormElements";
import { HaSearchMediaTypesEditor } from "@components/HaSearch/HaSearchMediaTypesEditor";
import { useHass } from "@components/HassContext";
import { SubForm } from "@components/SubForm";
import { useIntl } from "@components/i18n";

type SearchGroupFields = {
  search: SearchConfig;
  ma_entity_id?: string | null;
};

const defaultValues: SearchGroupFields = {
  search: {},
  ma_entity_id: null,
};

export const FieldGroupSearch = withFieldGroup({
  defaultValues,
  props: {},
  render: function Render({ group }) {
    const hass = useHass();
    const { t } = useIntl();

    return (
      <group.Field name="search" mode="array">
        {searchField => (
          <Fragment>
            {Array.isArray(searchField.state.value) &&
              searchField.state.value?.map((searchEntry, index) => {
                return (
                  <SubForm
                    title={
                      searchEntry.name ??
                      searchEntry.entity_id ??
                      `${t({ id: "Editor.search.entry" })} ${index}`
                    }
                    buttons={[
                      {
                        icon: "mdi:delete",
                        onClick: () => searchField.removeValue(index),
                      },
                      {
                        icon: "mdi:arrow-up",
                        onClick: () => {
                          searchField.moveValue(index, index - 1);
                        },
                      },
                      {
                        icon: "mdi:arrow-down",
                        onClick: () => {
                          searchField.moveValue(index, index + 1);
                        },
                      },
                    ]}
                    key={index}
                  >
                    <FormGroup>
                      <group.AppField
                        name={`search[${index}].name`}
                        children={field => (
                          <field.Text label={t({ id: "Editor.search.name" })} />
                        )}
                      />
                      <group.AppField
                        name={`search[${index}].entity_id`}
                        children={field => (
                          <field.EntityPicker
                            label={t({ id: "Editor.search.entity_id" })}
                            domains={["media_player"]}
                            required
                          />
                        )}
                      />
                      {searchEntry.entity_id && (
                        <group.Field name={`search[${index}].media_types`}>
                          {field => (
                            <HaSearchMediaTypesEditor
                              entityId={searchEntry.entity_id}
                              hass={hass}
                              mediaTypes={field.state.value ?? []}
                              onChange={value => {
                                field.handleChange(value ?? []);
                              }}
                            />
                          )}
                        </group.Field>
                      )}
                    </FormGroup>
                  </SubForm>
                );
              })}
            <EntityPicker
              hass={hass}
              value={""}
              onChange={value => {
                if (!value) return;
                searchField.pushValue({
                  entity_id: value,
                  name:
                    hass.states[value]?.attributes.friendly_name ?? "Search",
                });
              }}
              label={t({ id: "Editor.search.add" })}
              domains={["media_player"]}
            />
          </Fragment>
        )}
      </group.Field>
    );
  },
});
