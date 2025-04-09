import { Fragment } from "preact/jsx-runtime";
import styled from "@emotion/styled";
import { usePlayer } from "@components/PlayerContext";

const TitleText = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-text-color, #333);
`;

const ArtistText = styled.p`
  margin: 0px;
  font-size: 14px;
  color: var(--secondary-text-color, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaInfo = () => {
  const {
    attributes: {
      media_title: title,
      media_artist: artist,
      media_album_name: albumName,
      source,
      friendly_name: friendlyName,
    },
  } = usePlayer();
  const titleText = title ?? source ?? friendlyName;
  const artistText = `${albumName !== title ? `${albumName} - ` : ""}${artist}`;

  return (
    <Fragment>
      {!!titleText && <TitleText>{titleText}</TitleText>}
      {(!!albumName || !!artist) && <ArtistText>{artistText}</ArtistText>}
    </Fragment>
  );
};
