import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { JSX } from "preact";
import { useState } from "preact/hooks";

export type EmotionContextProviderProps = {
  rootElement: HTMLElement;
  children: JSX.Element;
};

export const EmotionContextProvider = ({
  rootElement,
  children,
}: EmotionContextProviderProps) => {
  const [emotionCache] = useState(() =>
    createCache({ key: "mmpc", container: rootElement, speedy: false })
  );
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
};
