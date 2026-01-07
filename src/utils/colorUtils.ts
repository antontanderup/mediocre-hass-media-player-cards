import TsColorConverter from "ts-color-converter";

export const converter = new TsColorConverter();

// Helper to parse a CSS color string to RGB
export function parseColorToRgb(
  color: string
): [number, number, number, number?] | null {
  // Remove spaces and lowercase
  color = color.replace(/\s+/g, "").toLowerCase();
  // Hex
  if (color[0] === "#") {
    const rgbaObject = converter.hex(color).to("RGBA", false) as
      | { r: number; g: number; b: number; a?: number }
      | string;
    console.log("Parsed RGBA from hex:", rgbaObject);
    if (typeof rgbaObject === "string") return null;
    return [
      rgbaObject.r,
      rgbaObject.g,
      rgbaObject.b,
      rgbaObject.a !== undefined ? Math.round(rgbaObject.a * 255) : 255,
    ];
  }
  // rgb/rgba
  const rgbMatch = color.match(/^rgba?\((\d+),(\d+),(\d+)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
      parseInt(rgbMatch[4] || "255", 10),
    ];
  }
  return null;
}

// Helper to calculate brightness
export function getBrightness([r, g, b]: [
  number,
  number,
  number,
  number?,
]): number {
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
