import { ActionConfig as ObsoleteActionConfig } from "custom-card-helpers";

export type ActionType =
  | "more-info"
  | "toggle"
  | "navigate"
  | "url"
  | "call-service"
  | "perform-action"
  | "assist";

export type InteractionType = "tap" | "hold" | "double_tap";

export type ActionConfig =
  | ObsoleteActionConfig
  | {
      action: "perform-action";
      perform_action: string;
      target: object;
      data: object;
    };

export type InteractionConfig = {
  entity?: string;
  camera_image?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
};

export type InteractionConfigLegacy = {
  entity?: string;
  camera_image?: string;
  tap_action?: ObsoleteActionConfig;
  hold_action?: ObsoleteActionConfig;
  double_tap_action?: ObsoleteActionConfig;
};
