/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomeAssistant as CCHHomeAssistant } from "custom-card-helpers";
import "preact";
import { MediaPlayerEntity } from "@types";

export type HomeAssistant = Omit<
  CCHHomeAssistant,
  "states" | "selectedTheme"
> & {
  hassUrl: (path: string) => string;
  selectedTheme?: { theme: string; dark: boolean } | null;
  states: CCHHomeAssistant["states"] & {
    [key: `media_player.${string}`]: MediaPlayerEntity | undefined;
  };
};

interface HaIconAttributes extends preact.JSX.HTMLAttributes<HTMLElement> {
  icon: string;
}

export type HaFormSchema = {
  name: string;
  label?: string;
  selector?: {
    [key: string]: unknown;
  };
}[];

interface HaFormAttributes extends preact.JSX.HTMLAttributes<HTMLElement> {
  hass?: HomeAssistant;
  data?: any;
  schema?: HaFormSchema;
  computeLabel?: (arg0: any) => string;
  disabled?: boolean;
  required?: boolean;
}

interface HaIconPickerAttributes extends preact.JSX
  .HTMLAttributes<HTMLElement> {
  label?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  hass?: HomeAssistant;
  "onvalue-changed"?: (e: CustomEvent) => void;
}

interface HaTextfieldAttributes extends preact.JSX.HTMLAttributes<HTMLElement> {
  label?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onchange?: (e: Event) => void;
}

interface HaEntityPickerAttributes extends preact.JSX
  .HTMLAttributes<HTMLElement> {
  hass?: HomeAssistant;
  value?: string;
  label?: string;
  includeDomains?: string[];
  disabled?: boolean;
  required?: boolean;
  "allow-custom-entity"?: boolean;
}

interface HaEntitiesPickerAttributes extends preact.JSX
  .HTMLAttributes<HTMLElement> {
  hass?: HomeAssistant;
  value?: string[];
  label?: string;
  includeDomains?: string[];
  disabled?: boolean;
  required?: boolean;
  "allow-custom-entity"?: boolean;
}

interface HaButtonAttributes extends preact.JSX.HTMLAttributes<HTMLElement> {
  size?: "small" | "medium";
  variant?: "brand" | "neutral" | "danger" | "warning" | "success";
  appearance?: "accent" | "filled" | "plain";
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e?: preact.JSX.TargetedMouseEvent<HTMLElement>) => void;
}

declare module "preact" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "ha-icon": HaIconAttributes;
      "ha-card": preact.JSX.HTMLAttributes;
      "ha-slider": preact.JSX.InputHTMLAttributes<HTMLInputElement>;
      "ha-form": HaFormAttributes;
      "ha-icon-picker": HaIconPickerAttributes;
      "ha-textfield": HaTextfieldAttributes;
      "ha-entity-picker": HaEntityPickerAttributes;
      "ha-entities-picker": HaEntitiesPickerAttributes;
      "ha-button": HaButtonAttributes;
    }
  }
}

declare global {
  interface Window {
    customCards: any[];
  }
}
