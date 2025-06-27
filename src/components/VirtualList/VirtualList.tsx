import { useEffect, useMemo, useRef } from "preact/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { css } from "@emotion/react";
import { type ComponentChildren } from "preact";

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

  useEffect(() => {
    if (parentRef.current) {
      console.log(
        parentRef.current.offsetHeight,
        parentRef.current.scrollHeight,
        parentRef.current
      );
    }
  }, [parentRef.current, items.length]);

  return (
    <div
      ref={parentRef}
      style={{ ...style, maxHeight }}
      css={styles.container}
      className={className}
    >
      <div
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
