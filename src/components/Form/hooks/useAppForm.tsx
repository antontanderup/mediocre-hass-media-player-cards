import { createFormHookContexts, createFormHook } from '@tanstack/react-form'
import { EntityPicker } from '../components/EntityPicker'
import { EntitiesPicker } from '../components/EntitiesPicker'

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    EntityPicker,
    EntitiesPicker
  },
  formComponents: {},
})

