// Thanks to mushroom card for the inspiration
// very hard to find documentation for ha-form

export const getActionsFormSchema = () => {
  return [
    {
      name: "tap_action",
      label: "Tap Action",
      selector: { ui_action: {} },
    },
    {
      name: "hold_action",
      label: "Hold Action",
      selector: { ui_action: {} },
    },
    {
      name: "double_tap_action",
      label: "Double Tap Action",
      selector: { ui_action: {} },
    },
  ];
};
