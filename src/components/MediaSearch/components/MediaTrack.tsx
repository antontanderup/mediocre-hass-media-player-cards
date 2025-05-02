import styled from "@emotion/styled";
import { MediaImage } from "./MediaImage";

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  @media (prefers-color-scheme: light) {
    &:hover {
      background: rgba(0, 0, 0, 0.01);
    }
  }
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrackName = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-text-color);
`;

const TrackArtist = styled.div`
  font-size: 12px;
  color: var(--secondary-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export type MediaTrackProps = {
  imageUrl?: string | null;
  title: string;
  artist: string;
  onClick: () => void;
};

export const MediaTrack = ({
  imageUrl,
  title,
  artist,
  onClick,
}: MediaTrackProps) => {
  return (
    <TrackItem onClick={onClick}>
      <MediaImage
        css={{
          width: 50,
          height: 50,
        }}
        imageUrl={imageUrl}
      />
      <TrackInfo>
        <TrackName>{title}</TrackName>
        <TrackArtist>{artist}</TrackArtist>
      </TrackInfo>
    </TrackItem>
  );
};
