import { SearchConfig } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { FormGroup, Label } from "@components/FormElements";
import { HaSearchMediaTypesEditor } from "@components/HaSearch/HaSearchMediaTypesEditor";
import { useHass } from "@components/HassContext";

type SearchGroupFields = {
  search: SearchConfig;
  ma_entity_id?: string | null;
};

// These default values are not used at runtime, but the keys are needed for mapping purposes.
const defaultValues: SearchGroupFields = {
  search: {},
  ma_entity_id: null,
};

export const FieldGroupSearch = withFieldGroup({
  defaultValues,
  props: {
    fallbackEntityId: "" as string,
  },
  render: function Render({ group, fallbackEntityId }) {
    const hass = useHass();
    return (
      <group.Field name="search">
        {searchField => (
          <Fragment>
            <group.Field name="ma_entity_id">
              {tapField => (
                <>
                  {(tapField.state.value?.length ?? 0) > 0 && (
                    <Label>
                      ma_entity_id is already set. Any change in this section
                      will not have any effect.
                    </Label>
                  )}
                </>
              )}
            </group.Field>
            <FormGroup>
              <group.AppField
                name="search.enabled"
                children={field => <field.Toggle label="Enable Search" />}
              />

              <group.Field name="search.enabled">
                {enabledField => (
                  <>
                    {enabledField.state.value && (
                      <group.AppField
                        name="search.show_favorites"
                        children={field => (
                          <field.Toggle label="Show Favorites when not searching" />
                        )}
                      />
                    )}
                  </>
                )}
              </group.Field>
              <group.AppField
                name="search.entity_id"
                children={field => (
                  <field.EntityPicker
                    label="Search target (Optional, if not set, will use the main entity_id)"
                    domains={["media_player"]}
                  />
                )}
              />
            </FormGroup>
            <group.Field name="search.media_types">
              {field => (
                <HaSearchMediaTypesEditor
                  entityId={
                    searchField.state.value?.entity_id ?? fallbackEntityId
                  }
                  hass={hass}
                  mediaTypes={field.state.value ?? []}
                  onChange={value => {
                    field.handleChange(value ?? []);
                  }}
                />
              )}
            </group.Field>
          </Fragment>
        )}
      </group.Field>
    );
  },
});
