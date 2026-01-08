import { getBrightness, getHass, parseColorToRgb } from "@utils";

export const isDarkMode = () => {
  const hass = getHass();
  if (typeof hass.selectedTheme?.dark === "boolean") {
    return hass.selectedTheme.dark;
  }

  // Try to get --primary-text-color from document root
  const root = window.document.documentElement;
  const style = getComputedStyle(root);
  const color = style.getPropertyValue("--primary-text-color");
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
