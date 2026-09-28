// Thanks to mushroom card for the inspiration
// very hard to find documentation for ha-form

type TranslateFn = (args: { id: string; defaultMessage?: string }) => string;

export const getActionsFormSchema = (t: TranslateFn) => {
  return [
    {
      name: "tap_action",
      label: t({ id: "Editor.actions.tap_action" }),
      selector: { ui_action: {} },
    },
    {
      name: "hold_action",
      label: t({ id: "Editor.actions.hold_action" }),
      selector: { ui_action: {} },
    },
    {
      name: "double_tap_action",
      label: t({ id: "Editor.actions.double_tap_action" }),
      selector: { ui_action: {} },
    },
  ];
};
