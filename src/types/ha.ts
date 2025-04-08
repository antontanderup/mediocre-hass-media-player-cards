/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomeAssistant } from "custom-card-helpers";
import "preact";

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

interface HaIconPickerAttributes
  extends preact.JSX.HTMLAttributes<HTMLElement> {
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

interface HaEntityPickerAttributes
  extends preact.JSX.HTMLAttributes<HTMLElement> {
  hass?: HomeAssistant;
  value?: string;
  label?: string;
  includeDomains?: string[];
  disabled?: boolean;
  required?: boolean;
  "allow-custom-entity"?: boolean;
}

interface HaEntitiesPickerAttributes
  extends preact.JSX.HTMLAttributes<HTMLElement> {
  hass?: HomeAssistant;
  value?: string[];
  label?: string;
  includeDomains?: string[];
  disabled?: boolean;
  required?: boolean;
  "allow-custom-entity"?: boolean;
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
    }
  }
}

declare global {
  interface Window {
    customCards: any[];
  }
}
