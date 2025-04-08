import { JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

export const GlanceGuard = ({ children }: { children: JSX.Element }) => {
  const [isGlanceLoaded, setIsGlanceLoaded] = useState(false);
  useEffect(() => {
    // https://community.home-assistant.io/t/re-using-existing-frontend-components-in-lovelace-card-editor/103415/9
    const glanceCard = customElements.get("hui-glance-card");
    // @ts-expect-error it should be there and if not we need to update anyway so error is fine
    glanceCard.getConfigElement().then(() => {
      setIsGlanceLoaded(true);
    });
  }, []);

  if (!isGlanceLoaded) {
    return null;
  }

  return children;
};
