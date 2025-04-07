export type ActionType =
  | "more-info"
  | "toggle"
  | "navigate"
  | "url"
  | "perform-action"
  | "assist";

export type InteractionType = "tap" | "hold" | "double_tap";

export type ActionConfig =
  | {
      action: "perform-action";
      perform_action: string;
      target: object;
      data: object;
    }
  | {
      action: "assist";
      pipeline_id?: string;
    }
  | {
      action: "url";
      url_path: string;
    }
  | {
      action: "navigate";
      navigation_path: string;
    }
  | {
      action: "more-info";
      entity?: string;
      camera_image?: string;
    }
  | {
      action: "toggle";
      entity?: string;
    }
  | {
      action: "none";
    };

export type InteractionConfig = {
  entity?: string;
  camera_image?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
};
