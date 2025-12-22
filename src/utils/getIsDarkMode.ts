import { getHass } from "@utils";

// Helper to parse a CSS color string to RGB
function parseColorToRgb(color: string): [number, number, number] | null {
  // Remove spaces and lowercase
  color = color.replace(/\s+/g, '').toLowerCase();
  // Hex
  if (color[0] === '#') {
    if (color.length === 4) {
      // #rgb
      return [
        parseInt(color[1] + color[1], 16),
        parseInt(color[2] + color[2], 16),
        parseInt(color[3] + color[3], 16),
      ];
    } else if (color.length === 7) {
      // #rrggbb
      return [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
      ];
    }
  }
  // rgb/rgba
  const rgbMatch = color.match(/^rgba?\((\d+),(\d+),(\d+)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
    ];
  }
  return null;
}

// Helper to calculate brightness
function getBrightness([r, g, b]: [number, number, number]): number {
  // Perceived brightness formula
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export const isDarkMode = () => {
  const hass = getHass();
  if (typeof hass.selectedTheme?.dark === "boolean") {
    return hass.selectedTheme.dark;
  }

  // Try to get --primary-text-color from document root
  const root = window.document.documentElement;
  const style = getComputedStyle(root);
  const color = style.getPropertyValue('--primary-text-color');
  if (color) {
    const rgb = parseColorToRgb(color);
    if (rgb) {
      const brightness = getBrightness(rgb);
      // If text color is bright, assume dark background (dark mode)
      return brightness > 180;
    }
  }

  // Fallback to prefers-color-scheme
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};
