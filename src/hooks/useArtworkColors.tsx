import { Vibrant } from "node-vibrant/browser";
import type { Palette } from "@vibrant/color";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { usePlayer } from "@components";

// Helper function to detect dark mode
const isDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function useArtworkColors() {
  const {
    attributes: { entity_picture: albumArt },
  } = usePlayer();
  // State for average color
  const [palette, setPalette] = useState<Palette | null>(null);
  // Track dark mode state
  const [darkMode, setDarkMode] = useState(isDarkMode());

  // Handle image load to calculate average color
  const getColors = useCallback(() => {
    if (albumArt) {
      Vibrant.from(albumArt)
        .getPalette()
        .then(setPalette)
        .catch(e => {
          console.error("Error getting color with Vibrant:", e);
        });
    }
  }, [albumArt]);

  // Reset average color when album art changes
  useEffect(() => {
    setPalette(null);
    if (albumArt) {
      getColors();
    }
  }, [albumArt]);

  // Listen for dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setDarkMode(isDarkMode());

    // Set initial value
    setDarkMode(isDarkMode());

    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const cssVariablesLight = useMemo(() => {
    if (darkMode) return null;
    if (!palette) return null;
    const variant = palette.Vibrant ?? palette.Muted;
    if (!variant) return null;

    const primaryColor = { ...vibrantHslToHsl(variant.hsl), l: 50 };
    const onPrimaryColor = getContrastingHsl(primaryColor);
    const surfaceColor = { ...primaryColor, s: 4.35, l: 95.49 };

    const onSurfaceColor = {
      ...getContrastingHsl(surfaceColor),
      l: 15.29,
    };
    const surfaceHigher = { ...surfaceColor, l: surfaceColor.l * 0.98 };
    const onSurfaceHigher = getContrastingHsl(surfaceHigher);
    const surfaceLower = { ...surfaceColor, l: surfaceColor.l * 1.1 };
    const onSurfaceLower = getContrastingHsl(surfaceLower);

    return {
      artVars: {
        "--art-color": `${hslToCss(vibrantHslToHsl(variant.hsl))}`,
        "--art-on-art-color": `${variant.titleTextColor}`,
        "--art-primary-color": `${hslToCss(primaryColor)}`,
        "--art-on-primary-color": `${hslToCss(onPrimaryColor)}`,
        "--art-surface-color": `${hslToCss(surfaceColor)}`,
        "--art-on-surface-color": `${hslToCss(onSurfaceColor)}`,
        "--art-surface-higher-color": `${hslToCss(surfaceHigher)}`,
        "--art-on-surface-higher-color": `${hslToCss(onSurfaceHigher)}`,
        "--art-surface-lower-color": `${hslToCss(surfaceLower)}`,
        "--art-on-surface-lower-color": `${hslToCss(onSurfaceLower)}`,
      },
      haVars: {
        "--primary-color": `${hslToCss(primaryColor)}`,
        "--ha-card-background": `${hslToCss(surfaceColor)}`,
        "--card-background-color": `${hslToCss(surfaceHigher)}`,
        "--primary-text-color": `${hslToCss(onSurfaceColor)}`,
        "--secondary-text-color": `${hslToCss({ ...onSurfaceColor, l: onSurfaceColor.l * 1.1 })}`,
        "--icon-primary-color": `${hslToCss(onSurfaceColor)}`,
        "--divider-color": `${hslToCss({ ...surfaceColor, l: 88 })}`,
        "--clear-background-color": `${hslToCss({ ...surfaceColor, l: 100 })}`,
        "--secondary-background-color": `${hslToCss({ ...onSurfaceColor, l: 95 })}`,
      },
    };
  }, [palette, darkMode]);

  const cssVariablesDark = useMemo(() => {
    if (!darkMode) return null;
    if (!palette) return null;
    const variant = palette.Vibrant ?? palette.Muted;
    if (!variant) return null;

    const primaryColor = { ...vibrantHslToHsl(variant.hsl), l: 50 };
    const onPrimaryColor = getContrastingHsl(primaryColor);
    const surfaceColor = { ...primaryColor, s: 2.91, l: 20.2 };

    const onSurfaceColor = {
      ...getContrastingHsl(surfaceColor),
      l: 86.47,
    };
    const surfaceHigher = { ...surfaceColor, l: surfaceColor.l * 1.02 };
    const onSurfaceHigher = getContrastingHsl(surfaceHigher);
    const surfaceLower = { ...surfaceColor, l: surfaceColor.l * 0.98 };
    const onSurfaceLower = getContrastingHsl(surfaceLower);

    return {
      artVars: {
        "--art-color": `${hslToCss(vibrantHslToHsl(variant.hsl))}`,
        "--art-on-art-color": `${variant.titleTextColor}`,
        "--art-primary-color": `${hslToCss(primaryColor)}`,
        "--art-on-primary-color": `${hslToCss(onPrimaryColor)}`,
        "--art-surface-color": `${hslToCss(surfaceColor)}`,
        "--art-on-surface-color": `${hslToCss(onSurfaceColor)}`,
        "--art-surface-higher-color": `${hslToCss(surfaceHigher)}`,
        "--art-on-surface-higher-color": `${hslToCss(onSurfaceHigher)}`,
        "--art-surface-lower-color": `${hslToCss(surfaceLower)}`,
        "--art-on-surface-lower-color": `${hslToCss(onSurfaceLower)}`,
      },
      haVars: {
        "--primary-color": `${hslToCss(primaryColor)}`,
        "--ha-card-background": `${hslToCss(surfaceColor)}`,
        "--card-background-color": `${hslToCss(surfaceHigher)}`,
        "--primary-text-color": `${hslToCss(onSurfaceColor)}`,
        "--secondary-text-color": `${hslToCss({ ...onSurfaceColor, l: onSurfaceColor.l * 0.9 })}`,
        "--icon-primary-color": `${hslToCss(onSurfaceColor)}`,
        "--divider-color": `${hslToCss({ ...surfaceColor, l: 25 })}`,
        "--clear-background-color": `${hslToCss({ ...surfaceColor, l: 0 })}`,
        "--secondary-background-color": `${hslToCss({ ...onSurfaceColor, l: 19 })}`,
      },
    };
  }, [palette, darkMode]);

  return useMemo(
    () => ({
      artVars: darkMode
        ? cssVariablesDark?.artVars
        : cssVariablesLight?.artVars,
      haVars: darkMode ? cssVariablesDark?.haVars : cssVariablesLight?.haVars,
    }),
    [cssVariablesDark, cssVariablesLight]
  );
}

const vibrantHslToHsl = (hls: number[]) => {
  const h = Math.round(hls[0] * 360);
  const s = Math.round(hls[1] * 100);
  const l = Math.round(hls[2] * 100);
  return { h, s, l };
};

const getContrastingHsl = ({
  h,
  s,
  l,
}: {
  h: number;
  s: number;
  l: number;
}) => {
  // Rotate hue by 180 degrees
  const newHue = (h + 180) % 360;
  return { h: newHue, s, l };
};

const hslToCss = ({
  h,
  s,
  l,
  a,
}: {
  h: number;
  s: number;
  l: number;
  a?: number;
}) => {
  return `hsla(${h}deg, ${s}%, ${l}%, ${a ? a : 1})`;
};
