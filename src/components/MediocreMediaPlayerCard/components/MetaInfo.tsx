import { useContext } from "preact/hooks";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../../../types/config";
import { Fragment } from "preact/jsx-runtime";
import styled from "@emotion/styled";

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
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const {
    media_title: title,
    media_artist: artist,
    media_album_name: albumName,
    source,
    friendly_name: friendlyName,
  } = hass.states[entity_id].attributes;

  const titleText = title ?? source ?? friendlyName;
  const artistText = `${albumName !== title ? `${albumName} - ` : ""}${artist}`;

  return (
    <Fragment>
      {!!titleText && <TitleText>{titleText}</TitleText>}
      {(!!albumName || !!artist) && <ArtistText>{artistText}</ArtistText>}
    </Fragment>
  );
};
