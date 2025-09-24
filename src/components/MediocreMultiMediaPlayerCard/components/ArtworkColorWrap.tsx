import { useArtworkColors } from "@hooks";
import { HTMLAttributes } from "preact/compat";

type ArtworkColorWrapProps = {
  useArtColors?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ArtworkColorWrap = ({
  style,
  useArtColors,
  ...props
}: ArtworkColorWrapProps) => {
  const { artVars, haVars } = useArtworkColors();

  return (
    <div
      {...props}
      style={{
        ...(artVars ?? {}),
        ...(haVars && useArtColors ? haVars : {}),
        ...(typeof style === "object" ? style : {}),
      }}
    />
  );
};
