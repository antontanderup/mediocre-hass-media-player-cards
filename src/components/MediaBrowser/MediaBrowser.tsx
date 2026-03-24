import { HaMediaBrowser } from "@components/HaMediaBrowser";
import { LyrionMediaBrowser } from "@components/LyrionMediaBrowser";
import { OverlayMenuItem } from "@components/OverlayMenu/OverlayMenu";
import { MediaBrowserEntry } from "@types";
import { getCanDisplayLyrionMediaBrowser } from "@utils";
import { FC, useEffect, useMemo, useState } from "preact/compat";
import { MaLibraryBrowser } from "../MaSearch/MaLibraryBrowser";

export type MediaBrowserProps = {
  mediaBrowserEntryArray: MediaBrowserEntry[];
  horizontalPadding?: number;
  maxHeight?: number;
  maEntityId?: string | null;
  maLibraryCompactThumbColumns?: number;
  maLibraryRootColumns?: number;
  maLibraryThumbColumns?: number;
  lmsEntityId?: string | null;
  useExperimentalLmsMediaBrowser?: boolean;
  renderHeader?: () => preact.JSX.Element;
};

export const MediaBrowser: FC<MediaBrowserProps> = ({
  mediaBrowserEntryArray,
  maEntityId,
  maLibraryCompactThumbColumns,
  maLibraryRootColumns,
  maLibraryThumbColumns,
  lmsEntityId,
  horizontalPadding,
  maxHeight,
  useExperimentalLmsMediaBrowser,
  renderHeader,
}) => {
  // Component implementation
  const [selectedMediaBrowser, setSelectedMediaBrowser] =
    useState<MediaBrowserEntry>(mediaBrowserEntryArray[0]);

  useEffect(() => {
    // reset when entryArray changes
    setSelectedMediaBrowser(mediaBrowserEntryArray[0]);
  }, [mediaBrowserEntryArray]);

  const selectMediaBrowserMenuItems: OverlayMenuItem[] = useMemo(() => {
    return mediaBrowserEntryArray.map(mediaBrowserEntry => ({
      label: mediaBrowserEntry.name ?? mediaBrowserEntry.entity_id,
      selected: mediaBrowserEntry.entity_id === selectedMediaBrowser.entity_id,
      onClick: () => {
        setSelectedMediaBrowser(mediaBrowserEntry);
      },
    }));
  }, [mediaBrowserEntryArray, selectedMediaBrowser.entity_id]);

  const isLyrionEntity = selectedMediaBrowser.entity_id === lmsEntityId;
  const isMusicAssistantEntity = selectedMediaBrowser.entity_id === maEntityId;
  const canDisplayLyrionMediaBrowser =
    useExperimentalLmsMediaBrowser && getCanDisplayLyrionMediaBrowser();

  if (!selectedMediaBrowser) return null;

  if (canDisplayLyrionMediaBrowser && isLyrionEntity) {
    return (
      <LyrionMediaBrowser
        selectedMediaBrowser={selectedMediaBrowser}
        selectMediaBrowserMenuItems={
          selectMediaBrowserMenuItems.length > 1
            ? selectMediaBrowserMenuItems
            : undefined
        }
        horizontalPadding={horizontalPadding}
        maxHeight={maxHeight}
        renderHeader={renderHeader}
      />
    );
  }
  if (isMusicAssistantEntity && maEntityId) {
    return (
      <MaLibraryBrowser
        maEntityId={maEntityId}
        filterConfig={selectedMediaBrowser.media_types}
        providerLabel={selectedMediaBrowser.name ?? selectedMediaBrowser.entity_id}
        providerMenuItems={
          selectMediaBrowserMenuItems.length > 1
            ? selectMediaBrowserMenuItems
            : undefined
        }
        rootColumns={maLibraryRootColumns}
        thumbColumns={maLibraryThumbColumns}
        compactThumbColumns={maLibraryCompactThumbColumns}
        horizontalPadding={horizontalPadding}
        maxHeight={maxHeight}
        renderHeader={renderHeader}
      />
    );
  }
  return (
    <HaMediaBrowser
      selectedMediaBrowser={selectedMediaBrowser}
      selectMediaBrowserMenuItems={
        selectMediaBrowserMenuItems.length > 1
          ? selectMediaBrowserMenuItems
          : undefined
      }
      horizontalPadding={horizontalPadding}
      maxHeight={maxHeight}
      renderHeader={renderHeader}
    />
  );
};
