import { createContext } from "preact";
import { useMemo } from "preact/hooks";

export type CardContextType<T> = {
  rootElement: HTMLElement;
  config: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CardContext = createContext<CardContextType<any>>({
  rootElement: null,
  config: null,
});

export const CardContextProvider = <T,>({
  rootElement,
  config,
  children,
}: CardContextType<T> & {
  children: React.ReactElement;
}): React.ReactElement => {
  const contextValue = useMemo(() => {
    return { rootElement, config };
  }, [rootElement, config]);

  return (
    <CardContext.Provider value={contextValue}>{children}</CardContext.Provider>
  );
};
