import { useArtworkColors } from "@hooks";
import { MediocreMultiMediaPlayer } from "@types";
import { HTMLAttributes } from "preact/compat";

type ArtworkColorWrapProps = {
  activePlayer: MediocreMultiMediaPlayer;
} & HTMLAttributes<HTMLDivElement>;

export const ArtworkColorWrap = ({
  activePlayer,
  ...props
}: ArtworkColorWrapProps) => {
  const { artVars, haVars } = useArtworkColors();

  return (
    <div
      {...props}
      style={{
        ...(artVars ?? {}),
        ...(haVars && activePlayer.use_art_colors ? haVars : {}),
      }}
    />
  );
};
