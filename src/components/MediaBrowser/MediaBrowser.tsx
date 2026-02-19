import { HaMediaBrowser } from "@components/HaMediaBrowser";
import { LyrionMediaBrowser } from "@components/LyrionMediaBrowser";
import { OverlayMenuItem } from "@components/OverlayMenu/OverlayMenu";
import { MediaBrowserEntry } from "@types";
import { getCanDisplayLyrionMediaBrowser } from "@utils";
import { FC, useMemo, useState } from "preact/compat";

export type MediaBrowserProps = {
  mediaBrowserEntryArray: MediaBrowserEntry[];
  horizontalPadding?: number;
  maxHeight?: number;
  lmsEntityId?: string | null;
  renderHeader?: () => preact.JSX.Element;
};

export const MediaBrowser: FC<MediaBrowserProps> = ({
  mediaBrowserEntryArray,
  lmsEntityId,
  horizontalPadding,
  maxHeight,
  renderHeader,
}) => {
  // Component implementation
  const [selectedMediaBrowser, setSelectedMediaBrowser] =
    useState<MediaBrowserEntry>(mediaBrowserEntryArray[0]);

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
  const canDisplayLyrionMediaBrowser = getCanDisplayLyrionMediaBrowser();

  if (!selectedMediaBrowser) return null;

  if (canDisplayLyrionMediaBrowser && isLyrionEntity) {
    return (
      <LyrionMediaBrowser
        selectedMediaBrowser={selectedMediaBrowser}
        selectMediaBrowserMenuItems={selectMediaBrowserMenuItems}
        horizontalPadding={horizontalPadding}
        maxHeight={maxHeight}
        renderHeader={renderHeader}
      />
    );
  }
  return (
    <HaMediaBrowser
      selectedMediaBrowser={selectedMediaBrowser}
      selectMediaBrowserMenuItems={selectMediaBrowserMenuItems}
      horizontalPadding={horizontalPadding}
      maxHeight={maxHeight}
      renderHeader={renderHeader}
    />
  );
};
