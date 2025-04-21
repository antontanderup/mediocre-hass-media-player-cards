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
  const { title, subtitle } = usePlayer();

  return (
    <Fragment>
      {!!title && <TitleText>{title}</TitleText>}
      {!!subtitle && <ArtistText>{subtitle}</ArtistText>}
    </Fragment>
  );
};
