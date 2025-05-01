import styled from "@emotion/styled";

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 16px;
`;

export const TrackListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
