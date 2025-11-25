import { createContext } from "preact";
import en from "./en.json";
import da from "./da.json";
import pt from "./pt.json";
import de from "./de.json";
import { useCallback, useContext, useMemo } from "preact/hooks";
import { memo } from "preact/compat";

type Messages = { [key: string]: string | Messages };

function flattenMessages(
  nestedMessages: Messages,
  prefix = ""
): Record<string, string> {
  return Object.keys(nestedMessages).reduce(
    (messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else if (typeof value === "object" && value !== null) {
        Object.assign(
          messages,
          flattenMessages(value as Messages, prefixedKey)
        );
      }
      return messages;
    },
    {} as Record<string, string>
  );
}

const translatedLocales = ["en", "da", "pt", "de"];

export const messages = {
  en,
  da,
  pt,
  de,
};

export type IntlContextType = {
  locale: string;
  messages: ReturnType<typeof flattenMessages>;
};

export const IntlContext = createContext<IntlContextType>(
  {} as IntlContextType
);

export const IntlContextProvider = memo<
  Omit<IntlContextType, "messages"> & { children: preact.ComponentChildren }
>(
  ({
    locale,
    children,
  }: Omit<IntlContextType, "messages"> & {
    children: preact.ComponentChildren;
  }): preact.ComponentChildren => {
    const messagesForLocale = useMemo(() => {
      if (translatedLocales.includes(locale)) {
        return flattenMessages(
          Object.assign(
            {},
            messages["en"],
            messages[locale as keyof typeof messages]
          )
        );
      }
      return flattenMessages(messages["en"]);
    }, [locale]);

    return (
      <IntlContext.Provider value={{ messages: messagesForLocale, locale }}>
        {children}
      </IntlContext.Provider>
    );
  }
);

export const useIntl = () => {
  const context = useContext(IntlContext);

  const t = useCallback(
    ({ id, defaultMessage }: { id: string; defaultMessage?: string }) => {
      return context.messages[id] ?? defaultMessage ?? id;
    },
    [context.messages]
  );

  return useMemo(() => {
    return {
      t,
    };
  }, [t]);
};
