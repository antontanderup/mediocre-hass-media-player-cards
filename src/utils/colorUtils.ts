import chroma from "chroma-js";

export type HLSA = [number, number, number, number?];
export type RGBA = [number, number, number, number?];

// Helper to parse a CSS color string to RGB
export function parseColorToRgb(color: string): RGBA | null {
  // Remove spaces and lowercase
  return chroma(color).rgba();
}

export function parseColorToHsla(inputColor: string): HLSA | null {
  const color = chroma(inputColor).hsl();
  return [
    color[0],
    color[1] * 100,
    color[2] * 100,
    // @ts-expect-error it's there don't worry
    color[3] !== undefined ? color[3] : 1,
  ];
}

// Helper to calculate brightness
export function getBrightness([r, g, b]: RGBA): number {
  // Perceived brightness formula
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Helper to get css color variable value
export function getCssColorVariable(
  variableName: string,
  root = window.document.documentElement
): string | null {
  const style = getComputedStyle(root);
  const color = style.getPropertyValue(variableName);
  return color ? color.trim() : null;
}
