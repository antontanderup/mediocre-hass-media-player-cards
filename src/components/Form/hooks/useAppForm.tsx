import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { EntityPicker } from "../components/EntityPicker";
import { EntitiesPicker } from "../components/EntitiesPicker";
import { Toggle } from "../components/Toggle";
import { InteractionsPicker } from "../components/InteractionsPicker";
import { Text } from "../components/Text";

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    EntityPicker,
    EntitiesPicker,
    InteractionsPicker,
    Toggle,
    Text,
  },
  formComponents: {},
});
