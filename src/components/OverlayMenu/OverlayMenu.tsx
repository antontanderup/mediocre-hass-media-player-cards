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
}


import { useRef, useState, useEffect } from "preact/hooks";

export const OverlayMenu = ({ trigger, menuItems }: OverlayMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      console.log(e)
      const path = e.composedPath ? e.composedPath() : [];
      if (
        menuRef.current &&
        !path.includes(menuRef.current) &&
        triggerRef.current &&
        !path.includes(triggerRef.current)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Keyboard navigation: close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Render menu items recursively, with submenu support (CSS only)
  function renderMenuItems(items: OverlayMenuItem[], parentLevel = 0) {
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
        // No JS submenu state, all CSS
        >
          {item.icon && (
            <Icon icon={item.icon} size="xx-small" />
          )}
          <span>{item.label}</span>
          {hasChildren && (
            <span style={{ marginLeft: "auto", opacity: 0.6 }}>&#9654;</span>
          )}
          {hasChildren && (
            <div
              className="overlaymenu-submenu"
              css={styles.menuRoot}
              role="menu"
              style={{
                position: "absolute",
                left: "100%",
                top: 0,
                zIndex: 9 + parentLevel,
                minWidth: 180,
              }}
            >
              {renderMenuItems(item.children!, parentLevel + 1)}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      {trigger(() => setOpen(o => !o))}
      {open && (
        <div
          ref={menuRef}
          css={styles.menuRoot}
          role="menu"
        >
          {renderMenuItems(menuItems)}
        </div>
      )}
    </div>
  );
};
