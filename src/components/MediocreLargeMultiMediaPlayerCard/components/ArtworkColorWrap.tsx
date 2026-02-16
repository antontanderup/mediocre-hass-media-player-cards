import { useArtworkColors } from "@hooks";
import { HTMLAttributes, memo, forwardRef } from "preact/compat";

type ArtworkColorWrapProps = {
  useArtColors?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ArtworkColorWrap = memo<ArtworkColorWrapProps>(
  forwardRef<HTMLDivElement, ArtworkColorWrapProps>(
    ({ style, useArtColors, ...props }: ArtworkColorWrapProps, ref) => {
      const { artVars, haVars } = useArtworkColors();

      return (
        <div
          {...props}
          style={{
            ...(artVars ?? {}),
            ...(haVars && useArtColors ? haVars : {}),
            ...(typeof style === "object" ? style : {}),
          }}
          ref={ref}
        />
      );
    }
  )
);
