import { Icon } from "@components/Icon";
import { theme } from "@constants";
import { css } from "@emotion/react";

export type OverlayMenuItem = {
  label: string;
  icon?: string; // mdi:icon string
  onClick?: () => void;
  children?: OverlayMenuItem[];
};

export type OverlayMenuProps = {
  renderTrigger: OverlayPopoverProps["renderTrigger"];
  menuItems: OverlayMenuItem[];
};

const styles = {
  menuRoot: css({
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
};

import { OverlayPopover, OverlayPopoverProps } from "./OverlayPopover";

export const OverlayMenu = ({ renderTrigger, menuItems }: OverlayMenuProps) => {

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
            // if (!item.children) setOpen(false);
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
              // style={{
              //   left: alignLeft ? undefined : "100%",
              //   right: alignLeft ? "100%" : undefined,
              //   zIndex: 9 + parentLevel,
              //   top: menuPosition.top !== undefined ? 0 : undefined,
              //   bottom: menuPosition.top === undefined ? 0 : undefined,
              // }}
            >
              {renderMenuItems(item.children!, parentLevel + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <OverlayPopover
      renderTrigger={renderTrigger}
    >
        <div
          css={styles.menuRoot}
          role="menu"
        >
          {renderMenuItems(menuItems)}
        </div>
      
    </OverlayPopover>
  );
};
