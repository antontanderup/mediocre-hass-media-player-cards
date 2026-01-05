import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import {
  Text,
  InteractionsPicker,
  Toggle,
  EntitiesPicker,
  EntityPicker,
} from "@components/Form/components";

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
