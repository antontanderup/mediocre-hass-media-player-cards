import { FC, JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

export const GlanceGuard: FC<{ children: JSX.Element }> = ({ children }) => {
  const [isGlanceLoaded, setIsGlanceLoaded] = useState(false);
  useEffect(() => {
    // https://community.home-assistant.io/t/re-using-existing-frontend-components-in-lovelace-card-editor/103415/9
    const glanceCard = customElements.get("hui-glance-card");
    // @ts-ignore
    glanceCard.getConfigElement().then(() => {
      setIsGlanceLoaded(true);
    });
  }, []);

  if (!isGlanceLoaded) {
    return null;
  }

  return children;
};
