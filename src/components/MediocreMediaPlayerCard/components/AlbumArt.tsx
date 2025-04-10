import styled from "@emotion/styled";
import { Icon, usePlayer } from "@components";
import { ButtonHTMLAttributes, Fragment, JSX } from "preact/compat";
import { getDeviceIcon } from "@utils";

const AlbumArtContainer = styled.button<{
  $state: string;
}>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  max-height: ${props => (props.$state === "off" ? "68px" : "100px")};
  height: ${props => (props.$state === "off" ? "68px" : "100px")};
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
  aspect-ratio: 1;
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
  renderLongPressIndicator?: () => JSX.Element | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Component
export const AlbumArt = ({
  renderLongPressIndicator,
  ...buttonProps
}: AlbumArtProps) => {
  const player = usePlayer();
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    icon,
    device_class: deviceClass,
    source,
  } = player.attributes;
  const state = player.state;

  return (
    <AlbumArtContainer $state={state} {...buttonProps}>
      {albumArt ? (
        <Fragment>
          <AlbumArtImage src={albumArt} alt={`${title} by ${artist}`} />
          <SourceIndicator>
            <Icon size="xx-small" icon={getIcon({ source })} />
          </SourceIndicator>
        </Fragment>
      ) : (
        <NoAlbumArt>
          <Icon
            size="large"
            icon={
              state === "off"
                ? getDeviceIcon({ icon, deviceClass })
                : getIcon({ source })
            }
          />
        </NoAlbumArt>
      )}
      {!!renderLongPressIndicator && renderLongPressIndicator()}
    </AlbumArtContainer>
  );
};

const getIcon = ({ source }: { source: string }) => {
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
