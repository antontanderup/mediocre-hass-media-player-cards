import { useEffect, useMemo, useRef } from "preact/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { css } from "@emotion/react";
import { type ComponentChildren } from "preact";
import { useMeasure } from "@uidotdev/usehooks";

const styles = {
  container: css({
    height: "100%",
    overflow: "auto",
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
  estimateSize?: number;
  overscan?: number;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const VirtualList = <T,>({
  onLayout,
  data,
  renderItem,
  renderHeader,
  renderEmpty,
  estimateSize = 80,
  maxHeight = 300,
  overscan = 5,
  className,
  style = {},
}: VirtualListProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [sizeRef, { width }] = useMeasure<HTMLDivElement>();

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
    overscan,
  });

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
