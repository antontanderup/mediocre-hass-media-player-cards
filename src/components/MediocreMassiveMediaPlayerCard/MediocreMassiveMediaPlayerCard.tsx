import { AlbumArt, Title, Track } from "./components";
import { PlaybackControls } from "./components/PlaybackControls";
import styled from "@emotion/styled";
import { PlayerActions } from "./components/PlayerActions";

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // Below gradient transitions from panel header color to transparent
  background: linear-gradient(
    var(--app-header-background-color),
    rgba(255, 255, 255, 0)
  );
  max-height: calc(100vh - var(--header-height, 16px));
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
  align-items: center;
  width: 90%;
  max-width: 400px;
  padding-top: 16px;
  padding-bottom: 16px;
  height: 100%;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  min-height: 280px;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

export const MediocreMassiveMediaPlayerCard = () => {
  return (
    <Root>
      <Wrap>
        <AlbumArt />
        <ControlsWrapper>
          <Title />
          <Track />
          <PlaybackControls />
          <PlayerActions />
        </ControlsWrapper>
      </Wrap>
    </Root>
  );
};
