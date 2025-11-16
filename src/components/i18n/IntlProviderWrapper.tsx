import { createContext } from "preact";
import { IntlProvider } from "react-intl";
import en from "./en.json";
import da from "./da.json";

function flattenMessages(
  nestedMessages: Record<string, any>,
  prefix = ""
): Record<string, string> {
  return Object.keys(nestedMessages).reduce(
    (messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else if (typeof value === "object" && value !== null) {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }
      return messages;
    },
    {} as Record<string, string>
  );
}

const defaultMessages = flattenMessages(en);

export const messages: Record<string, any> = {
  en: defaultMessages,
  da: Object.assign(defaultMessages, flattenMessages(da)),
};

export type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

export const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
});

export function IntlProviderWrapper({
  children,
  locale,
}: {
  children: any;
  locale: string;
}) {
  return (
    <IntlProvider locale={locale} messages={messages[locale] || messages["en"]}>
      {children}
    </IntlProvider>
  );
}
