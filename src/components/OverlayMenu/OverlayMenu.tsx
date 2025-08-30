import { Icon } from "@components/Icon";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { JSX } from "preact";

export type OverlayMenuItem = {
  label: string;
  icon?: string; // mdi:icon string
  onClick?: () => void;
  children?: OverlayMenuItem[];
};

export type OverlayMenuProps = {
  trigger: (onClick: () => void) => JSX.Element;
  menuItems: OverlayMenuItem[];
};

const styles = {
  menuRoot: css({
    position: "fixed",
    zIndex: 9,
    background: theme.colors.card,
    color: theme.colors.onCard,
    borderRadius: 12,
    minWidth: 180,
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    padding: 4,
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
  submenu: css({
    position: "absolute",
    minWidth: 180,
  }),
  item: css({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    color: "inherit",
    transition: "background 0.15s",
    position: "relative",
    "&:hover, &[data-highlighted]": {
      background: theme.colors.onCardDivider,
    },
    "&[data-disabled]": {
      color: theme.colors.onCardMuted,
      cursor: "not-allowed",
    },
    // Show submenu on hover/focus
    "> .overlaymenu-submenu": {
      display: "none",
    },
    ":hover > .overlaymenu-submenu, :focus-within > .overlaymenu-submenu": {
      display: "block",
    },
  }),
  trigger: css({
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    boxShadow: "none",
    minWidth: 0,
    minHeight: 0,
    display: "inline",
    lineHeight: "inherit",
    color: "inherit",
    font: "inherit",
    cursor: "pointer",
  }),
};

import { useRef, useState, useEffect, useCallback } from "preact/hooks";

export const OverlayMenu = ({ trigger, menuItems }: OverlayMenuProps) => {
  const [open, setOpen] = useState(false);
  const [alignLeft, setAlignLeft] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click (works in Shadow DOM and with portals)
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const path = e.composedPath ? e.composedPath() : [];
      const target = e.target as Node;
      const menu = menuRef.current;
      const trigger = triggerRef.current;
      const clickedMenu =
        menu && (path.includes(menu) || menu.contains(target));
      const clickedTrigger =
        trigger && (path.includes(trigger) || trigger.contains(target));
      if (!clickedMenu && !clickedTrigger) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  // Function to handle opening and alignment
  const handleOpen = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const menuWidth = 200; // fallback width, adjust if needed or measure
      const menuHeight = 250; // fallback height, adjust if needed or measure
      const spaceRight = window.innerWidth - rect.left;
      const spaceLeft = rect.right;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let pos: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      } = {};
      // Horizontal alignment
      if (spaceRight < menuWidth && spaceLeft > menuWidth) {
        // align right
        pos.right = window.innerWidth - rect.right;
        setAlignLeft(true);
      } else {
        // align left
        pos.left = rect.left;
        setAlignLeft(false);
      }
      // Vertical alignment
      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        // Not enough space below, render above
        pos.bottom = window.innerHeight - rect.top;
        pos.top = undefined;
      } else {
        // Default: render below
        pos.top = rect.bottom;
        pos.bottom = undefined;
      }
      setMenuPosition(pos);
    }
    setOpen(o => !o);
  }, []);

  // Keyboard navigation: close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const renderMenuItems = (items: OverlayMenuItem[], parentLevel = 0) => {
    return items.map((item, idx) => {
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div
          key={item.label + idx}
          css={styles.item}
          tabIndex={item.onClick || hasChildren ? 0 : -1}
          onClick={() => {
            if (item.onClick) item.onClick();
            if (!item.children) setOpen(false);
          }}
          role="menuitem"
          aria-haspopup={hasChildren ? "menu" : undefined}
          aria-disabled={!item.onClick && !hasChildren}
          data-disabled={!item.onClick && !hasChildren ? true : undefined}
        >
          {item.icon && <Icon icon={item.icon} size="x-small" />}
          <span>{item.label}</span>
          {hasChildren && <Icon icon={"mdi:chevron-down"} size="x-small" />}
          {hasChildren && (
            <div
              className="overlaymenu-submenu"
              css={[styles.menuRoot, styles.submenu]}
              role="menu"
              style={{
                left: alignLeft ? undefined : "100%",
                right: alignLeft ? "100%" : undefined,
                zIndex: 9 + parentLevel,
                top: menuPosition.top !== undefined ? 0 : undefined,
                bottom: menuPosition.top === undefined ? 0 : undefined,
              }}
            >
              {renderMenuItems(item.children!, parentLevel + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      style={{ display: "inline-block", position: "relative" }}
    >
      {trigger(() => handleOpen())}
      {open && (
        <div
          ref={menuRef}
          css={styles.menuRoot}
          role="menu"
          style={menuPosition}
        >
          {renderMenuItems(menuItems)}
        </div>
      )}
    </div>
  );
};
