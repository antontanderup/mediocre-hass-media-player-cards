import { searchFilter } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { SubForm } from "@components/SubForm";
import { FormGroup } from "@components/FormElements";

// Type for a single SearchFilter item
export type SearchFilter = typeof searchFilter.infer;

type SearchFilterGroupFields = {
  filters: SearchFilter[];
};
const defaultValues: SearchFilterGroupFields = {
  filters: [],
};

export const FieldGroupSearchFilters = withFieldGroup({
  defaultValues,
  props: {},
  render: function Render({ group }) {
    return (
      <group.Field name="filters" mode="array">
        {filtersField => (
          <Fragment>
            {Array.isArray(filtersField.state.value) &&
              filtersField.state.value.map((filter, index) => (
                <SubForm
                  title={
                    filter.name ||
                    ("media_content_type" in filter
                      ? filter.media_content_type
                      : undefined) ||
                    ("media_filter_class" in filter
                      ? filter.media_filter_class
                      : undefined) ||
                    `Filter ${index}`
                  }
                  buttons={[
                    {
                      icon: "mdi:delete",
                      onClick: () => filtersField.removeValue(index),
                    },
                    {
                      icon: "mdi:arrow-up",
                      onClick: () => filtersField.moveValue(index, index - 1),
                    },
                    {
                      icon: "mdi:arrow-down",
                      onClick: () => filtersField.moveValue(index, index + 1),
                    },
                  ]}
                  key={index}
                >
                  <FormGroup>
                    <group.AppField
                      name={`filters[${index}].name`}
                      children={field => <field.Text label={"Name"} />}
                    />
                    <group.AppField
                      name={`filters[${index}].icon`}
                      children={field => (
                        <field.Text isIconInput label={"Icon (mdi:...)"} />
                      )}
                    />
                    <group.AppField
                      name={`filters[${index}].media_content_type`}
                      children={field => (
                        <field.Text label={"Media Content Type"} />
                      )}
                    />
                    <group.AppField
                      name={`filters[${index}].media_filter_class`}
                      children={field => (
                        <field.Text label={"Media Filter Class"} />
                      )}
                    />
                  </FormGroup>
                </SubForm>
              ))}
            <button
              type="button"
              onClick={() => filtersField.pushValue({} as SearchFilter)}
              style={{ marginTop: 8 }}
            >
              Add Filter
            </button>
          </Fragment>
        )}
      </group.Field>
    );
  },
});
