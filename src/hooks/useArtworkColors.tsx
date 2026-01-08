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
import { getCssColorVariable, isDarkMode, parseColorToHsla } from "@utils";

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
          .then(palette => {
            setPalette(palette);
          })
          .catch(e => {
            setPalette(null);
            console.error("Error getting color with Vibrant:", e);
          });
      }, 800);
    }
  }, [albumArt]);

  // Reset average color when album art changes
  useEffect(() => {
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
      const hsla = parseColorToHsla(color);
      if (!hsla) return null;
      return {
        h: hsla[0],
        s: hsla[1],
        l: hsla[2],
        a: hsla[3] ?? 1,
      };
    }
    return null;
  }, []);

  const userThemeHlsValues = useMemo(() => {
    const cardBackgroundColor = extractHslFromCssVariable(
      "--card-background-color"
    );
    const haDialogSurfaceBackground = extractHslFromCssVariable(
      "--ha-dialog-surface-background"
    ) ??
      extractHslFromCssVariable("--mdc-theme-surface") ?? {
        h: 0,
        s: 0,
        l: darkMode ? 0 : 100,
        a: 1,
      };
    const primaryColor = extractHslFromCssVariable("--primary-color");
    const secondaryBackgroundColor = extractHslFromCssVariable(
      "--secondary-background-color"
    );
    const dividerColor = extractHslFromCssVariable("--divider-color");

    return {
      cardBackgroundColor,
      haDialogSurfaceBackground,
      primaryColor,
      secondaryBackgroundColor,
      dividerColor,
    };
  }, [darkMode, extractHslFromCssVariable]);

  const cssVariablesLight = useMemo(() => {
    if (darkMode || !palette) return null;

    const artColor = palette.Vibrant;
    const variant = palette.LightVibrant ?? palette.Vibrant;
    const variantAlternative = palette.DarkVibrant ?? palette.Muted;
    if (!variant || !variantAlternative || !artColor) return null;

    const primaryVibrantHls = vibrantHslToHsl(variant.hsl);
    const primaryColor = {
      ...primaryVibrantHls,
      s: userThemeHlsValues.primaryColor?.s ?? primaryVibrantHls.s,
      l: userThemeHlsValues.primaryColor?.l ?? 50,
    };
    const surfaceColor = {
      ...primaryColor,
      s: userThemeHlsValues.cardBackgroundColor?.s ?? 4.35,
      l: userThemeHlsValues.cardBackgroundColor?.l ?? 95.49,
    };

    const onSurfaceColor = {
      ...getContrastingHsl(surfaceColor),
    };

    return {
      artVars: {
        "--art-color": `${hslToCss(vibrantHslToHsl(artColor.hsl))}`,
        "--art-alternative-color": `${hslToCss(vibrantHslToHsl(variantAlternative.hsl))}`,
        "--art-surface-color": `${hslToCss(surfaceColor)}`,
      },
      haVars: {
        "--primary-color": `${hslToCss(primaryColor)}`,
        "--ha-card-background": `${hslToCss(surfaceColor)}`,
        "--card-background-color": `${hslToCss(surfaceColor)}`,
        "--primary-text-color": `${hslToCss(onSurfaceColor)}`,
        "--secondary-text-color": `${hslToCss({ ...onSurfaceColor, l: onSurfaceColor.l * 1.1 })}`,
        "--icon-primary-color": `${hslToCss(onSurfaceColor)}`,
        "--divider-color": `${hslToCss({ ...surfaceColor, s: userThemeHlsValues.dividerColor?.s ?? surfaceColor.s, l: userThemeHlsValues.dividerColor?.l ?? 88, a: userThemeHlsValues.dividerColor?.a ?? 0.2 })}`,
        "--clear-background-color": `${hslToCss({ ...surfaceColor, l: 10 })}`,
        "--secondary-background-color": `${hslToCss({ ...onSurfaceColor, s: userThemeHlsValues.secondaryBackgroundColor?.s ?? onSurfaceColor.s, l: userThemeHlsValues.secondaryBackgroundColor?.l ?? 95 })}`,
        "--ha-dialog-surface-background": `${hslToCss({ ...userThemeHlsValues.haDialogSurfaceBackground, h: primaryColor.h, a: 1 })}`,
      },
    };
  }, [palette, darkMode, userThemeHlsValues]);

  const cssVariablesDark = useMemo(() => {
    if (!darkMode || !palette) return null;

    const artColor = palette.Vibrant;
    const variant = palette.DarkVibrant ?? palette.Vibrant;
    const variantAlternative = palette.LightVibrant ?? palette.Muted;
    if (!variant || !variantAlternative || !artColor) return null;

    const primaryVibrantHls = vibrantHslToHsl(variant.hsl);
    const primaryColor = {
      ...primaryVibrantHls,
      s: userThemeHlsValues.primaryColor?.s ?? primaryVibrantHls.s,
      l: userThemeHlsValues.primaryColor?.l ?? 50,
      a: userThemeHlsValues.primaryColor?.a ?? 1,
    };
    const surfaceColor = {
      ...primaryColor,
      s: userThemeHlsValues.cardBackgroundColor?.s ?? 2.91,
      l: userThemeHlsValues.cardBackgroundColor?.l ?? 20.2,
      a: userThemeHlsValues.cardBackgroundColor?.a ?? 1,
    };

    const onSurfaceColor = {
      ...getContrastingHsl(surfaceColor),
    };

    return {
      artVars: {
        "--art-color": `${hslToCss(vibrantHslToHsl(artColor.hsl))}`,
        "--art-alternative-color": `${hslToCss(vibrantHslToHsl(variantAlternative.hsl))}`,
        "--art-surface-color": `${hslToCss(surfaceColor)}`,
      },
      haVars: {
        "--primary-color": `${hslToCss(primaryColor)}`,
        "--ha-card-background": `${hslToCss(surfaceColor)}`,
        "--card-background-color": `${hslToCss(surfaceColor)}`,
        "--primary-text-color": `${hslToCss(onSurfaceColor)}`,
        "--secondary-text-color": `${hslToCss({ ...onSurfaceColor, l: onSurfaceColor.l * 0.9 })}`,
        "--icon-primary-color": `${hslToCss(onSurfaceColor)}`,
        "--divider-color": `${hslToCss({ ...surfaceColor, s: userThemeHlsValues.dividerColor?.s ?? surfaceColor.s, l: userThemeHlsValues.dividerColor?.l ?? 25, a: userThemeHlsValues.dividerColor?.a ?? 0.2 })}`,
        "--clear-background-color": `${hslToCss({ ...surfaceColor, l: 0 })}`,
        "--secondary-background-color": `${hslToCss({ ...surfaceColor, s: userThemeHlsValues.secondaryBackgroundColor?.s ?? onSurfaceColor.s, l: userThemeHlsValues.secondaryBackgroundColor?.l ?? 19 })}`,
        "--ha-dialog-surface-background": `${hslToCss({ ...userThemeHlsValues.haDialogSurfaceBackground, h: primaryColor.h, a: 1 })}`,
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
  // Get opposite lightness
  const newLightness = 100 - l;
  return { h: newHue, s, l: newLightness };
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
