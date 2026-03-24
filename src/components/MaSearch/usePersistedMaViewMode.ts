import { useCallback, useMemo, useState } from "preact/hooks";
import { MaFilterType, MaViewMode } from "./types";

const STORAGE_KEY = "mmpc:ma-view-modes";

type MaViewModeSurface = "global-search" | "library";

type StoredViewModes = Record<string, MaViewMode>;

export const usePersistedMaViewMode = (
  surface: MaViewModeSurface,
  maEntityId: string,
  filter: MaFilterType | null,
  defaultMode: MaViewMode
) => {
  const [storedModes, setStoredModes] = useState<StoredViewModes>(() =>
    getStoredViewModes()
  );

  const persistedKey = useMemo(
    () => `${surface}:${maEntityId}:${filter ?? "__root__"}`,
    [surface, maEntityId, filter]
  );

  const viewMode = storedModes[persistedKey] ?? defaultMode;

  const setViewMode = useCallback(
    (nextViewMode: MaViewMode) => {
      setStoredModes(previousModes => {
        const nextModes = {
          ...previousModes,
          [persistedKey]: nextViewMode,
        };
        setStoredViewModes(nextModes);
        return nextModes;
      });
    },
    [persistedKey]
  );

  return [viewMode, setViewMode] as const;
};

const getStoredViewModes = (): StoredViewModes => {
  if (typeof window === "undefined") return {};

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return {};

    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") return {};

    return Object.entries(parsed).reduce<StoredViewModes>((acc, [key, value]) => {
      if (
        value === "list" ||
        value === "thumbs" ||
        value === "compact_thumbs"
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const setStoredViewModes = (value: StoredViewModes) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage failures and keep the UI functional.
  }
};
