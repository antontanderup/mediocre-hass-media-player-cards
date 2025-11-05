import { css } from "@emotion/react";

export const searchStyles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "hidden",
  }),
  rootSearchBarBottom: css({
    overflow: "hidden",
  }),
  searchBarContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 12,
  }),
  filterContainer: css({
    display: "flex",
    flexDirection: "row",
    gap: "2px",
    justifyContent: "flex-start",
    overflowX: "auto",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
  chip: css({
    "&:first-child": {
      marginLeft: "var(--mmpc-chip-horizontal-margin, 0px)",
    },
    "&:last-child": {
      marginRight: "var(--mmpc-chip-horizontal-margin, 0px)",
    },
  }),
  verticalChipSeperator: css({
    height: "28px",
    alignSelf: "center",
    borderRight: "1px solid var(--divider-color)",
    marginRight: "6px",
  }),
  mediaEmptyText: css({
    padding: "0px var(--mmpc-search-padding, 0px)",
  }),
  resultsContainerSearchBarBottom: css({
    overflowY: "auto",
  }),
  inputRow: css({
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    padding: "1px var(--mmpc-search-padding, 0px)",
  }),
  input: css({
    flexGrow: 1,
  }),
};
