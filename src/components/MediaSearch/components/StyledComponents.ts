import { Chip } from "@components";
import styled from "@emotion/styled";

export const SearchContainer = styled.div<{
  $horizontalPadding?: number;
  $searchBarPosition: "top" | "bottom";
}>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  ${props => (props.$searchBarPosition === "top" ? "" : "overflow: hidden;")}
  --mmpc-search-padding: ${props => props.$horizontalPadding ?? 0}px;
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

export const ResultsContainer = styled.div<{
  $searchBarPosition: "top" | "bottom";
}>`
  ${props => (props.$searchBarPosition === "top" ? "" : "overflow-y: auto;")}
`;

export const VerticalChipSeparator = styled.div`
  height: 28px;
  align-self: center;
  border-right: 1px solid var(--divider-color);
  margin-right: 6px;
`;

export const FilterChip = styled(Chip)<{ $horizontalPadding?: number }>`
  &:first-child {
    margin-left: ${props => props.$horizontalPadding ?? 0}px;
  }
  &:last-child {
    margin-right: ${props => props.$horizontalPadding ?? 0}px;
  }
`;

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 16px;
  padding: 0px var(--mmpc-search-padding, 0px);
`;

export const TrackListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0px var(--mmpc-search-padding, 0px);
`;

export const MediaEmptyState = styled.p`
  padding: 0px var(--mmpc-search-padding, 0px);
`;
