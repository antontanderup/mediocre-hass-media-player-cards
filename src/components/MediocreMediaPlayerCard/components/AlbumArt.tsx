import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon/config";
import { Icon } from "../../Icon";
import { ButtonHTMLAttributes, Fragment, JSX } from "preact/compat";

const AlbumArtContainer = styled.button<{
  maxHeight: string;
}>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  max-height: ${props => props.maxHeight};
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const AlbumArtImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoAlbumArt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  opacity: 0.5;
`;

const SourceIndicator = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  --icon-primary-color: var(--art-on-art-color, --primary-text-color);
  opacity: 0.8;
`;

export type AlbumArtProps = {
  maxHeight: string;
  renderLongPressIndicator?: () => JSX.Element | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Component
export const AlbumArt = ({
  maxHeight,
  renderLongPressIndicator,
  ...buttonProps
}: AlbumArtProps) => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const player = hass.states[entity_id];
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    source,
  } = player.attributes;
  const state = player.state;

  return (
    <AlbumArtContainer maxHeight={maxHeight} {...buttonProps}>
      {!!albumArt ? (
        <Fragment>
          <AlbumArtImage src={albumArt} alt={`${title} by ${artist}`} />
          <SourceIndicator>
            <Icon size="xx-small" icon={getIcon({ source, state })} />
          </SourceIndicator>
        </Fragment>
      ) : (
        <NoAlbumArt>
          <Icon size="x-large" icon={getIcon({ source, state })} />
        </NoAlbumArt>
      )}
      {!!renderLongPressIndicator && renderLongPressIndicator()}
    </AlbumArtContainer>
  );
};

const getIcon = ({ source, state }: { source: string; state: string }) => {
  if (state === "off") return "mdi:power-off";
  switch (source?.toLowerCase()) {
    case "spotify":
      return "mdi:spotify";
    case "airplay":
      return "mdi:airplay";
    case "bluetooth":
      return "mdi:bluetooth";
    case "net radio":
      return "mdi:radio";
    case "server":
      return "mdi:server";
    case "usb":
      return "mdi:usb";
    case "aux":
      return "mdi:audio-input-rca";
    case "hdmi":
      return "mdi:hdmi-port";
    case "tv":
      return "mdi:television";
    case "tuner":
      return "mdi:radio-tower";
    case "optical":
      return "mdi:audio-input-stereo-minijack";
    default:
      return "mdi:music";
  }
};
