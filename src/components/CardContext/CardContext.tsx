import { createContext } from "preact";
import { useMemo } from "preact/hooks";
import { memo } from "preact/compat";

export type CardContextType<T> = {
  rootElement: HTMLElement;
  config: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CardContext = createContext<CardContextType<any>>(null!);

const CardContextProviderInner = <T,>({
  rootElement,
  config,
  children,
}: CardContextType<T> & {
  children: preact.ComponentChildren;
}): preact.ComponentChildren => {
  const contextValue = useMemo(() => {
    return { rootElement, config };
  }, [rootElement, config]);

  return (
    <CardContext.Provider value={contextValue}>{children}</CardContext.Provider>
  );
};

export const CardContextProvider = memo(CardContextProviderInner) as typeof CardContextProviderInner;
