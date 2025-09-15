import type { MediocreMultiMediaPlayer } from "@types";
import { MaSearch, HaSearch } from "@components";
import { css } from "@emotion/react";

const styles = {
  root: css({
    height: "100%",
    paddingTop: 12,
    paddingBottom: 12,
    overflowY: "auto",
  }),
};

export type SearchViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const SearchView = ({
  mediaPlayer: { ma_entity_id, search, entity_id },
  height,
}: SearchViewProps) => {
  const renderSearch = () => {
    if (ma_entity_id) {
      return (
        <MaSearch
          maEntityId={ma_entity_id}
          horizontalPadding={12}
          maxHeight={height}
        />
      );
    }
    if (search?.enabled) {
      return (
        <HaSearch
          entityId={search.entity_id ?? entity_id}
          showFavorites={search.show_favorites ?? false}
          horizontalPadding={12}
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
};
