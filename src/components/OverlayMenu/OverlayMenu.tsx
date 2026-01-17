import { Icon } from "@components/Icon";
import { theme } from "@constants";
import { css } from "@emotion/react";

export type OverlayMenuItem =
  | {
      type?: "item" | undefined;
      label: string;
      icon?: string; // mdi:icon string
      selected?: boolean;
      onClick?: () => void;
      children?: OverlayMenuItem[];
    }
  | {
      type: "title";
      label: string;
    };

export type OverlayMenuProps = {
  menuItems: OverlayMenuItem[];
} & Omit<OverlayPopoverProps, "children">;

const styles = {
  menuRoot: css({
    background: theme.colors.dialog,
    color: theme.colors.onDialog,
    borderRadius: 12,
    minWidth: 180,
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    padding: 4,
    gap: 4,
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.colors.onDialogDivider}`,
  }),
  item: css({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px",
    borderRadius: 8,
    backgroundColor: "transparent",
    fontSize: 15,
    cursor: "pointer",
    color: "inherit",
    transition: "background 0.15s",
    position: "relative",
    border: "none",
    "&:hover, &[data-highlighted]": {
      background: theme.colors.onDialogDivider,
    },
    "&[data-disabled]": {
      color: theme.colors.onDialogMuted,
      cursor: "not-allowed",
    },
  }),
  itemSelected: css({
    background: theme.colors.onDialogDivider,
  }),
  itemChevron: css({
    marginLeft: "auto",
  }),
  itemTitle: css({
    padding: "8px 14px 4px 14px",
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.onDialogMuted,
  }),
};

import {
  OverlayPopover,
  OverlayPopoverHandle,
  OverlayPopoverProps,
} from "./OverlayPopover";
import { ButtonHTMLAttributes, useRef } from "preact/compat";

export const OverlayMenu = ({
  menuItems,
  ...overlayMenuProps
}: OverlayMenuProps) => {
  const overlayRef = useRef<OverlayPopoverHandle>(null);

  const renderMenuItem = (
    item: OverlayMenuItem,
    buttonProps: Partial<ButtonHTMLAttributes>,
    hasChildren: boolean,
    index: number
  ) => {
    if (item?.type === "title") {
      return (
        <span key={item.label + index} css={styles.itemTitle}>
          {item.label}
        </span>
      );
    }
    return (
      <button
        key={item.label + index}
        css={[styles.item, item.selected && styles.itemSelected]}
        onClick={() => {
          if (!hasChildren) {
            overlayRef.current?.setOpen(false);
          }
          if (item.onClick) item.onClick();
        }}
        role="menuitem"
        {...buttonProps}
      >
        {item.icon && <Icon icon={item.icon} size="x-small" />}
        <span>{item.label}</span>
        {hasChildren && (
          <Icon
            icon={"mdi:chevron-down"}
            size="x-small"
            css={styles.itemChevron}
          />
        )}
      </button>
    );
  };

  const renderMenuItems = (items: OverlayMenuItem[], parentLevel = 0) => {
    return items.map((item, index) => {
      const hasChildren =
        (!item.type || item.type === "item") &&
        !!(item.children && item.children.length > 0);
      if (hasChildren) {
        return (
          <OverlayPopover
            side="right"
            align="start"
            renderTrigger={buttonProps =>
              renderMenuItem(item, buttonProps, hasChildren, index)
            }
          >
            <div css={styles.menuRoot} role="menu">
              {renderMenuItems(item.children!, parentLevel + 1)}
            </div>
          </OverlayPopover>
        );
      } else {
        return renderMenuItem(item, {}, hasChildren, index);
      }
    });
  };

  return (
    <OverlayPopover ref={overlayRef} {...overlayMenuProps}>
      <div css={styles.menuRoot} role="menu">
        {renderMenuItems(menuItems)}
      </div>
    </OverlayPopover>
  );
};
