import styled from "@emotion/styled";
import { CardContext, CardContextType, Icon, usePlayer } from "@components";
import { ButtonHTMLAttributes, Fragment, JSX, useContext } from "preact/compat";
import { getDeviceIcon } from "@utils";
import { MediocreMediaPlayerCardConfig } from "@types";

const AlbumArtContainer = styled.button<{
  $small: boolean;
  $useArtColors?: boolean;
}>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  max-height: ${props => (props.$small ? "68px" : "100px")};
  height: ${props => (props.$small ? "68px" : "100px")};
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  ${props =>
    props.$useArtColors &&
    `
    box-shadow:
      -50px -60px 300px var(--art-color, transparent),
      350px 120px 300px var(--art-color, transparent);
  `}
`;

const AlbumArtImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: transparent; /* Hide alt text if it shows */
  text-indent: -10000px; /* Move alt text off-screen */
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
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { use_art_colors } = config;
  const player = usePlayer();
  const {
    media_title: title,
    media_artist: artist,
    media_album_name: albumName,
    entity_picture: albumArt,
    icon,
    device_class: deviceClass,
    source,
  } = player.attributes;
  const state = player.state;

  const small = state === "off" || (!title && !artist && !albumName);

  return (
    <AlbumArtContainer
      $useArtColors={use_art_colors}
      $small={small}
      {...buttonProps}
    >
      {albumArt ? (
        <Fragment>
          <AlbumArtImage
            src={albumArt}
            alt={
              !!title && !!artist
                ? `${title} by ${artist}`
                : `Source: ${source}`
            }
          />
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
