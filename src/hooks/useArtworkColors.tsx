import { Vibrant } from "node-vibrant/browser";
import type { Palette } from "@vibrant/color";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { usePlayer } from "@components";
import {
  converter,
  getCssColorVariable,
  isDarkMode,
  parseColorToRgb,
} from "@utils";

export function useArtworkColors() {
  const {
    attributes: { entity_picture, entity_picture_local },
  } = usePlayer();
  const albumArt = entity_picture_local || entity_picture;
  const albumArtRef = useRef<string | undefined>(null);
  // State for average color
  const [palette, setPalette] = useState<Palette | null>(null);
  // Track dark mode state
  const [darkMode, setDarkMode] = useState(isDarkMode());

  // Handle image load to calculate average color
  const getColors = useCallback(() => {
    if (albumArt && albumArt !== albumArtRef.current) {
      albumArtRef.current = albumArt;
      // delay ensures we wait for the image to be loaded and rely on caching
      setTimeout(() => {
        if (albumArtRef.current !== albumArt) return;
        Vibrant.from(albumArt)
          .getPalette()
          .then(setPalette)
          .catch(e => {
            console.error("Error getting color with Vibrant:", e);
          });
      }, 800);
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

  const extractHslFromCssVariable = useCallback((variableName: string) => {
    const color = getCssColorVariable(variableName);
    if (color) {
      const rgba = parseColorToRgb(color);
      if (!rgba) return null;
      const hslObject = converter
        .rgba({ r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3] ?? 255 })
        .to("HSL", false) as
        | { h: number; s: number; l: number; a?: number }
        | string;
      if (typeof hslObject === "string") return null;
      return hslObject;
    }
    return null;
  }, []);

  const cssVariablesLight = useMemo(() => {
    if (darkMode) return null;
    if (!palette) return null;
    const variant = palette.Vibrant ?? palette.Muted;
    if (!variant) return null;

    const haCardBackgroundHsl = extractHslFromCssVariable(
      "--card-background-color"
    );
    const haDialogSurfaceBackgroundHsl = extractHslFromCssVariable(
      "--ha-dialog-surface-background"
    ) ??
      extractHslFromCssVariable("--mdc-theme-surface") ?? {
        h: 0,
        s: 0,
        l: 100,
        a: 1,
      };

    const primaryColorHsl = extractHslFromCssVariable("--primary-color");
    const secondaryBackgroundColorHsl = extractHslFromCssVariable(
      "--secondary-background-color"
    );
    const dividerColorHsl = extractHslFromCssVariable("--divider-color");

    const primaryVibrantHls = vibrantHslToHsl(variant.hsl);
    const primaryColor = {
      ...primaryVibrantHls,
      s: primaryColorHsl?.s ?? primaryVibrantHls.s,
      l: primaryColorHsl?.l ?? 50,
    };
    const surfaceColor = {
      ...primaryColor,
      s: haCardBackgroundHsl?.s ?? 4.35,
      l: haCardBackgroundHsl?.l ?? 95.49,
    };

    const onSurfaceColor = {
      ...getContrastingHsl(surfaceColor),
      l: 15.29,
    };

    return {
      artVars: {
        "--art-color": `${hslToCss(vibrantHslToHsl(variant.hsl))}`,
        "--art-surface-color": `${hslToCss(surfaceColor)}`,
      },
      haVars: {
        "--primary-color": `${hslToCss(primaryColor)}`,
        "--ha-card-background": `${hslToCss(surfaceColor)}`,
        "--card-background-color": `${hslToCss(surfaceColor)}`,
        "--primary-text-color": `${hslToCss(onSurfaceColor)}`,
        "--secondary-text-color": `${hslToCss({ ...onSurfaceColor, l: onSurfaceColor.l * 1.1 })}`,
        "--icon-primary-color": `${hslToCss(onSurfaceColor)}`,
        "--divider-color": `${hslToCss({ ...surfaceColor, s: dividerColorHsl?.s ?? surfaceColor.s, l: dividerColorHsl?.l ?? 88, a: dividerColorHsl?.a ?? 0.2 })}`,
        "--clear-background-color": `${hslToCss({ ...surfaceColor, l: 10 })}`,
        "--secondary-background-color": `${hslToCss({ ...onSurfaceColor, l: secondaryBackgroundColorHsl?.l ?? 95 })}`,
        "--ha-dialog-surface-background": `${hslToCss({ ...haDialogSurfaceBackgroundHsl, h: primaryColor.h })}`,
      },
    };
  }, [palette, darkMode]);

  const cssVariablesDark = useMemo(() => {
    if (!darkMode) return null;
    if (!palette) return null;
    const variant = palette.Vibrant ?? palette.Muted;
    if (!variant) return null;

    const haCardBackgroundHsl = extractHslFromCssVariable(
      "--card-background-color"
    );
    const haDialogSurfaceBackgroundHsl = extractHslFromCssVariable(
      "--ha-dialog-surface-background"
    ) ??
      extractHslFromCssVariable("--mdc-theme-surface") ?? {
        h: 0,
        s: 0,
        l: 0,
        a: 1,
      };

    const primaryColorHsl = extractHslFromCssVariable("--primary-color");
    const secondaryBackgroundColorHsl = extractHslFromCssVariable(
      "--secondary-background-color"
    );
    const dividerColorHsl = extractHslFromCssVariable("--divider-color");

    const primaryVibrantHls = vibrantHslToHsl(variant.hsl);
    const primaryColor = {
      ...primaryVibrantHls,
      s: primaryColorHsl?.s ?? primaryVibrantHls.s,
      l: primaryColorHsl?.l ?? 50,
      a: primaryColorHsl?.a ?? 1,
    };
    const surfaceColor = {
      ...primaryColor,
      s: haCardBackgroundHsl?.s ?? 2.91,
      l: haCardBackgroundHsl?.l ?? 20.2,
      a: haCardBackgroundHsl?.a ?? 1,
    };

    const onSurfaceColor = {
      ...getContrastingHsl(surfaceColor),
      l: 86.47,
    };

    return {
      artVars: {
        "--art-color": `${hslToCss(vibrantHslToHsl(variant.hsl))}`,
        "--art-surface-color": `${hslToCss(surfaceColor)}`,
      },
      haVars: {
        "--primary-color": `${hslToCss(primaryColor)}`,
        "--ha-card-background": `${hslToCss(surfaceColor)}`,
        "--card-background-color": `${hslToCss(surfaceColor)}`,
        "--primary-text-color": `${hslToCss(onSurfaceColor)}`,
        "--secondary-text-color": `${hslToCss({ ...onSurfaceColor, l: onSurfaceColor.l * 0.9 })}`,
        "--icon-primary-color": `${hslToCss(onSurfaceColor)}`,
        "--divider-color": `${hslToCss({ ...surfaceColor, s: dividerColorHsl?.s ?? surfaceColor.s, l: dividerColorHsl?.l ?? 25, a: dividerColorHsl?.a ?? 0.2 })}`,
        "--clear-background-color": `${hslToCss({ ...surfaceColor, l: 0 })}`,
        "--secondary-background-color": `${hslToCss({ ...onSurfaceColor, l: secondaryBackgroundColorHsl?.l ?? 19 })}`,
        "--ha-dialog-surface-background": `${hslToCss({ ...haDialogSurfaceBackgroundHsl, h: primaryColor.h })}`,
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
