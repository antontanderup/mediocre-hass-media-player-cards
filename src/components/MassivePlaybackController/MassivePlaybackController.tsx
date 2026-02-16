import { PlaybackControls } from "./components/PlaybackControls";
import { AlbumArt } from "@components";
import { css } from "@emotion/react";
import { Title, Track } from "./components";

const styles = {
  root: css({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: "16px",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: "16px",
    paddingBottom: "16px",
    height: "100%",
  }),
};

type MassivePlaybackControllerProps = {
  className?: string;
  artworkButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
  children?: React.ReactNode;
};

export const MassivePlaybackController = ({
  className,
  artworkButtonProps = {},
  children,
}: MassivePlaybackControllerProps) => {
  return (
    <div css={styles.root} className={className}>
      <AlbumArt iconSize="x-large" borderRadius={8} {...artworkButtonProps} />
      <Title />
      <Track />
      <PlaybackControls />
      {children}
    </div>
  );
};
