import { CustomButtons } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { SubForm } from "@components/SubForm";
import {
  Button,
  FormGroup,
  InteractionsPicker,
  Label,
} from "@components/FormElements";
import { useHass } from "@components/HassContext";
import { ValidationErrorMap } from "@tanstack/react-form";
import { useCallback } from "preact/hooks";

type CustomButtonsFields = {
  custom_buttons: CustomButtons;
};

// These default values are not used at runtime, but the keys are needed for mapping purposes.
const defaultValues: CustomButtonsFields = {
  custom_buttons: [],
};

export const FieldGroupCustomButtons = withFieldGroup({
  defaultValues,
  props: {
    formErrors: {} as ValidationErrorMap<unknown>,
  },
  render: function Render({ group, formErrors }) {
    const hass = useHass();

    const getSubformError = useCallback(
      (fieldName: string) => {
        return !!Object.keys(formErrors?.onChange ?? {}).find((key: string) =>
          key.startsWith(fieldName)
        );
      },
      [formErrors]
    );

    return (
      <group.Field name="custom_buttons" mode="array">
        {customButtonsField => (
          <Fragment>
            {Array.isArray(customButtonsField.state.value) &&
              customButtonsField.state.value?.map(
                (customButtonEntry, index) => {
                  const stableKey = `${customButtonEntry.name}-${index}`;
                  return (
                    <SubForm
                      title={`Button ${index} - ${customButtonEntry.name}`}
                      error={getSubformError(`custom_buttons[${index}]`)}
                      buttons={[
                        {
                          icon: "mdi:delete",
                          onClick: () => customButtonsField.removeValue(index),
                        },
                        {
                          icon: "mdi:arrow-up",
                          onClick: () => {
                            customButtonsField.swapValues(index, index - 1);
                          },
                        },
                        {
                          icon: "mdi:arrow-down",
                          onClick: () => {
                            customButtonsField.swapValues(index, index + 1);
                          },
                        },
                      ]}
                      key={stableKey}
                    >
                      <FormGroup>
                        <group.AppField
                          name={`custom_buttons[${index}].name`}
                          children={field => <field.Text label="Name" />}
                        />
                        <group.AppField
                          name={`custom_buttons[${index}].icon`}
                          children={field => (
                            <field.Text label="Icon" isIconInput />
                          )}
                        />

                        <Label>Interactions</Label>

                        <group.Field name={`custom_buttons[${index}]`}>
                          {field => {
                            const value = field.state.value ?? {
                              icon: "",
                              name: "",
                            };
                            const { name, icon, ...interactions } = value;
                            return (
                              <InteractionsPicker
                                hass={hass}
                                value={interactions}
                                onChange={newValue => {
                                  field.handleChange({
                                    name,
                                    icon,
                                    ...newValue,
                                  });
                                }}
                              />
                            );
                          }}
                        </group.Field>
                      </FormGroup>
                    </SubForm>
                  );
                }
              )}
            <Button
              onClick={() => {
                customButtonsField.pushValue({
                  name: "New Button",
                  icon: "mdi:button-pointer",
                });
              }}
            >
              Add Custom Button
            </Button>
          </Fragment>
        )}
      </group.Field>
    );
  },
});
