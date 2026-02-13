import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { JSX } from "preact";
import { useState } from "preact/hooks";
import { memo } from "preact/compat";

export type EmotionContextProviderProps = {
  rootElement: HTMLElement;
  children: JSX.Element;
};

export const EmotionContextProvider = memo<EmotionContextProviderProps>(
  ({ rootElement, children }: EmotionContextProviderProps) => {
    const [emotionCache] = useState(() =>
      createCache({ key: "mmpc", container: rootElement, speedy: false })
    );
    return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
  }
);
