import { AlbumArt, Title, Track } from "./components";
import { PlaybackControls } from "./components/PlaybackControls";
import styled from "@emotion/styled";
import { PlayerActions } from "./components/PlayerActions";
import { useContext } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { useArtworkColors } from "@hooks";

const Root = styled.div<{
  mode: MediocreMassiveMediaPlayerCardConfig["mode"];
  $artColorVars?: string;
  $haColorVars?: string;
  $useArtColors?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => props.$artColorVars ?? ""}
  ${props => {
    if (props.$useArtColors && !!props.$haColorVars) {
      return props.$haColorVars;
    } else return "";
  }}

  ${props => {
    switch (props?.mode) {
      case "panel": {
        return `
          width: 100%;
          height: 100%;
          // Below gradient transitions from panel header color to transparent
          background: linear-gradient(
            var(--app-header-background-color),
            rgba(255, 255, 255, 0)
          );
          max-height: calc(100vh - var(--header-height, 16px));
        `;
      }
      default: {
        return ``;
      }
    }
  }}

  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  --mmpc-surface-higher: var(--card-background-color);
`;

const Wrap = styled.div<{
  mode: MediocreMassiveMediaPlayerCardConfig["mode"];
}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  ${props => {
    switch (props?.mode) {
      case "panel": {
        return `
          width: 90%;
          max-width: 400px;
        `;
      }
      case "popup": {
        return `
          max-width: 100%;
          padding: 16px;
          padding-bottom: max(calc(env(safe-area-inset-bottom) + 8px), 16px);
        `;
      }
      case "card": {
        return `
          width: 100%;
          padding: 16px;
        `;
      }
      default: {
        return "";
      }
    }
  }}
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

export const MediocreMassiveMediaPlayerCard = ({
  className,
}: {
  className?: string;
}) => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const { mode, use_art_colors } = config;

  const { artVars, haVars } = useArtworkColors();

  const renderRoot = () => (
    <Root
      className={className}
      mode={mode}
      $artColorVars={artVars}
      $haColorVars={haVars}
      $useArtColors={use_art_colors}
    >
      <Wrap mode={mode}>
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

  if (mode === "card") {
    return <ha-card>{renderRoot()}</ha-card>;
  }
  return renderRoot();
};
