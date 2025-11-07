import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import da from "./da.json";
import { getHass } from "@utils";

const resources = {
  en: { translation: en },
  da: { translation: da },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getHass().locale.language ?? "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
