import { getHass } from "@utils";

export const isDarkMode = () => !!getHass().selectedTheme?.dark;
