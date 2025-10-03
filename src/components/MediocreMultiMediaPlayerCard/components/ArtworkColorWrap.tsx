import { useArtworkColors } from "@hooks";
import { HTMLAttributes, memo } from "preact/compat";

type ArtworkColorWrapProps = {
  useArtColors?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ArtworkColorWrap = memo<ArtworkColorWrapProps>(
  ({ style, useArtColors, ...props }: ArtworkColorWrapProps) => {
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
  }
);
