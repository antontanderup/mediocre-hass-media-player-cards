import {
  MaSearch,
  HaSearch,
  useSearchProviderMenu,
  Chip,
  Icon,
  CardContext,
  CardContextType,
} from "@components";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { useIntl } from "@components/i18n";
import { memo, useContext } from "preact/compat";
import { OverlayMenu } from "@components/OverlayMenu/OverlayMenu";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";
import { MediocreMultiMediaPlayerCardConfig } from "@types";

const styles = {
  root: css({
    height: "100%",
    overflowY: "auto",
  }),
  header: css({
    padding: "12px 16px 12px 16px",
  }),
};

export type SearchViewProps = {
  height: number;
};

export const SearchView = memo<SearchViewProps>(({ height }) => {
  const { selectedPlayer } = useSelectedPlayer();
  const { ma_entity_id, search, entity_id } = selectedPlayer!;
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(CardContext);
  const { selectedSearchProvider, searchProvidersMenu } = useSearchProviderMenu(
    search,
    entity_id,
    ma_entity_id
  );

  const { t } = useIntl();
  const configuredTitle = config?.options?.search_view_title?.trim();

  const renderHeader = () => (
    <ViewHeader
      title={
        configuredTitle ||
        (selectedSearchProvider?.entity_id === ma_entity_id
          ? t({
              id: "MediocreMultiMediaPlayerCard.SearchView.search_in_ma_title",
            })
          : t({
              id: "MediocreMultiMediaPlayerCard.SearchView.search_title",
            }))
      }
      css={styles.header}
      renderAction={
        searchProvidersMenu.length > 1
          ? () => (
              <OverlayMenu
                menuItems={searchProvidersMenu}
                align="end"
                renderTrigger={triggerProps => (
                  <Chip
                    icon="mdi:import"
                    invertedColors
                    border
                    size="small"
                    {...triggerProps}
                  >
                    {selectedSearchProvider?.name ??
                      selectedSearchProvider?.entity_id}
                    <Icon icon="mdi:chevron-down" size="x-small" />
                  </Chip>
                )}
              />
            )
          : undefined
      }
    />
  );

  const renderSearch = () => {
    if (!selectedSearchProvider) return null;
    if (selectedSearchProvider.entity_id === ma_entity_id) {
      return (
        <MaSearch
          renderHeader={renderHeader}
          maEntityId={ma_entity_id}
          horizontalPadding={16}
          maxHeight={height}
        />
      );
    }

    return (
      <HaSearch
        renderHeader={renderHeader}
        entityId={selectedSearchProvider.entity_id}
        showFavorites={true}
        horizontalPadding={16}
        filterConfig={selectedSearchProvider.media_types}
        maxHeight={height}
      />
    );
  };

  return (
    <div css={styles.root} style={{ maxHeight: height }}>
      {renderSearch()}
    </div>
  );
});
