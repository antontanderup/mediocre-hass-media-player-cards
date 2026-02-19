import { useEffect, useMemo, useRef } from "preact/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { css } from "@emotion/react";
import { type ComponentChildren } from "preact";
import { useMeasure } from "@uidotdev/usehooks";
import { theme } from "@constants";

const styles = {
  container: css({
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    boxSizing: "border-box",
    /* Only apply custom scrollbar styles for non-touch devices */
    "@media (hover: hover) and (pointer: fine)": {
      paddingRight: "2px", // slight padding to avoid content shift
      scrollbarWidth: "thin",
      scrollbarColor: `${theme.colors.onCardDivider} transparent`,
      "&::-webkit-scrollbar": {
        width: "8px",
        background: "transparent",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: theme.colors.onCardDivider,
        borderRadius: "8px",
        minHeight: "24px",
        border: `2px solid ${theme.colors.onCardDivider}`,
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: theme.colors.onCard,
        opacity: 0.8,
      },
    },
  }),
  item: css({
    padding: "4px 0",
  }),
};

export type VirtualListProps<T> = {
  onLayout?: ({ width }: { width: number }) => void;
  data: T[];
  renderItem: (item: T, index: number) => ComponentChildren;
  renderHeader?: () => ComponentChildren;
  renderEmpty?: () => ComponentChildren;
  keyExtractor?: (item: T, index: number) => number | string | bigint;
  estimateSize?: number;
  overscan?: number;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
};

export const VirtualList = <T,>({
  onLayout,
  data,
  renderItem,
  renderHeader,
  renderEmpty,
  keyExtractor,
  estimateSize = 80,
  maxHeight = 300,
  overscan = 5,
  className,
  style = {},
  onEndReached,
  onEndReachedThreshold = 0.8,
}: VirtualListProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [sizeRef, { width }] = useMeasure<HTMLDivElement>();
  const hasCalledOnEndReached = useRef(false);

  useEffect(() => {
    if (onLayout && width !== null) {
      onLayout({ width: width ?? 0 });
    }
  }, [onLayout, width]);

  const items = useMemo(() => {
    if (data?.length === 0) {
      return ["empty" as const];
    }
    return data;
  }, [data]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    getItemKey:
      keyExtractor && data.length > 0
        ? index => keyExtractor(data[index], index)
        : undefined,
    overscan,
  });

  // Handle onEndReached
  useEffect(() => {
    if (!onEndReached || !parentRef.current) return;

    const handleScroll = () => {
      const element = parentRef.current;
      if (!element) return;

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;

      // Calculate scroll percentage
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // If scrolled past threshold and haven't called yet
      if (scrollPercentage >= onEndReachedThreshold) {
        if (!hasCalledOnEndReached.current) {
          hasCalledOnEndReached.current = true;
          onEndReached();
        }
      } else {
        // Reset flag when scrolling back up
        hasCalledOnEndReached.current = false;
      }
    };

    const element = parentRef.current;
    element.addEventListener("scroll", handleScroll);

    // Check initial state
    handleScroll();

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [onEndReached, onEndReachedThreshold]);

  // Reset the flag when data length changes (new page loaded)
  useEffect(() => {
    hasCalledOnEndReached.current = false;
  }, [data.length]);

  return (
    <div
      ref={parentRef}
      style={{ ...style, maxHeight }}
      css={styles.container}
      className={className}
    >
      <div
        ref={sizeRef}
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            css={styles.item}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {virtualItem.index === 0 && renderHeader && renderHeader()}
            {items[virtualItem.index] === "empty" &&
              renderEmpty &&
              renderEmpty()}
            {items[virtualItem.index] !== "empty" &&
              renderItem(data[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
};
