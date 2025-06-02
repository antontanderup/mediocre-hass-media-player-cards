import { type } from "arktype";

export const actionTypeSchema = type(
  "'more-info' | 'toggle' | 'navigate' | 'url' | 'perform-action' | 'assist'"
);

export const interactionTypeSchema = type("'tap' | 'hold' | 'double_tap'");

export const actionConfigSchema = type({
  action: "'perform-action'",
  perform_action: "string",
  target: "object",
  data: "object",
})
  .or({
    action: "'assist'",
    "pipeline_id?": "string",
  })
  .or({
    action: "'url'",
    url_path: "string",
  })
  .or({
    action: "'navigate'",
    navigation_path: "string",
  })
  .or({
    action: "'more-info'",
    "entity?": "string",
    "camera_image?": "string",
  })
  .or({
    action: "'toggle'",
    "entity?": "string",
  })
  .or({
    action: "'none'",
  });

export const interactionConfigSchema = type({
  "entity?": "string",
  "camera_image?": "string",
  "tap_action?": actionConfigSchema.or("undefined"),
  "hold_action?": actionConfigSchema.or("undefined"),
  "double_tap_action?": actionConfigSchema.or("undefined"),
});

export type ActionType = typeof actionTypeSchema.infer;
export type InteractionType = typeof interactionTypeSchema.infer;
export type ActionConfig = typeof actionConfigSchema.infer;
export type InteractionConfig = typeof interactionConfigSchema.infer;
