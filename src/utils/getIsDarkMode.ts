import { getHass } from "@utils";

export const isDarkMode = () => {
  if (typeof getHass().selectedTheme?.dark === "boolean") {
    return getHass().selectedTheme?.dark;
  }
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};
