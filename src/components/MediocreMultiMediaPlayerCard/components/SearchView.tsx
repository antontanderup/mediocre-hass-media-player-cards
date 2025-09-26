import type { MediocreMultiMediaPlayer } from "@types";
import { MaSearch, HaSearch } from "@components";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { memo } from "preact/compat";

const styles = {
  root: css({
    height: "100%",
    overflowY: "auto",
  }),
  header: css({
    padding: 16,
    paddingBottom: 0,
  }),
};

export type SearchViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const SearchView = memo<SearchViewProps>(({
  mediaPlayer: { ma_entity_id, search, entity_id },
  height,
}) => {
  const renderHeader = () => (
    <ViewHeader
      title={ma_entity_id ? "Search in Music Assistant" : "Search"}
      css={styles.header}
    />
  );

  const renderSearch = () => {
    if (ma_entity_id) {
      return (
        <MaSearch
          renderHeader={renderHeader}
          maEntityId={ma_entity_id}
          horizontalPadding={16}
          maxHeight={height}
        />
      );
    }
    if (search?.enabled) {
      return (
        <HaSearch
          renderHeader={renderHeader}
          entityId={search.entity_id ?? entity_id}
          showFavorites={search.show_favorites ?? false}
          horizontalPadding={16}
          filterConfig={search.media_types}
          maxHeight={height}
        />
      );
    }
    return null;
  };

  return (
    <div css={styles.root} style={{ maxHeight: height }}>
      {renderSearch()}
    </div>
  );
});
