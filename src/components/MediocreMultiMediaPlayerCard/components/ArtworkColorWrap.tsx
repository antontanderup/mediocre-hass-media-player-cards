import { useArtworkColors } from "@hooks";
import { MediocreMultiMediaPlayer } from "@types";
import { HTMLAttributes } from "preact/compat";

type ArtworkColorWrapProps = {
  activePlayer: MediocreMultiMediaPlayer;
  useArtColors?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ArtworkColorWrap = ({
  activePlayer,
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
