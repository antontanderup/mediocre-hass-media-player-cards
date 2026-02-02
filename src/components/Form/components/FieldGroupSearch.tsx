import { SearchConfig } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { EntityPicker, FormGroup } from "@components/FormElements";
import { HaSearchMediaTypesEditor } from "@components/HaSearch/HaSearchMediaTypesEditor";
import { useHass } from "@components/HassContext";
import { SubForm } from "@components/SubForm";
import { FieldGroupSearchFilters } from "./FieldGroupSearchFilters";

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
                      `Entry ${index}`
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
                        children={field => <field.Text label={"Name"} />}
                      />
                      <group.AppField
                        name={`search[${index}].entity_id`}
                        children={field => (
                          <field.EntityPicker
                            label={"Media Player Entity ID (to search)"}
                            domains={["media_player"]}
                            required
                          />
                        )}
                      />
                      <FieldGroupSearchFilters
                        form={group}
                        entity_id={searchEntry.entity_id ?? ""}
                        fields={{
                          filters: `search[${index}].filters` as never,
                        }} // todo this casting is stupid
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
                searchField.pushValue({
                  entity_id: value,
                  name:
                    hass.states[value]?.attributes.friendly_name ?? "Search",
                });
              }}
              label="Add Search"
              domains={["media_player"]}
            />
          </Fragment>
        )}
      </group.Field>
    );
  },
});
