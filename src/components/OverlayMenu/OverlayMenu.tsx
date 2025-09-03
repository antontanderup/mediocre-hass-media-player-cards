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
    gap: 4,
    display: "flex",
    flexDirection: "column",
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
    border: "none",
    "&:hover, &[data-highlighted]": {
      background: theme.colors.onCardDivider,
    },
    "&[data-disabled]": {
      color: theme.colors.onCardMuted,
      cursor: "not-allowed",
    },
  }),
};

import { OverlayPopover, OverlayPopoverProps } from "./OverlayPopover";
import { ButtonHTMLAttributes } from "preact/compat";

export const OverlayMenu = ({ renderTrigger, menuItems }: OverlayMenuProps) => {
  const renderMenuItem = (
    item: OverlayMenuItem,
    buttonProps: Partial<ButtonHTMLAttributes>,
    hasChildren: boolean,
    index: number
  ) => {
    return (
      <button
        key={item.label + index}
        css={styles.item}
        onClick={item.onClick}
        role="menuitem"
        {...buttonProps}
      >
        {item.icon && <Icon icon={item.icon} size="x-small" />}
        <span>{item.label}</span>
        {hasChildren && <Icon icon={"mdi:chevron-down"} size="x-small" />}
      </button>
    );
  };

  const renderMenuItems = (items: OverlayMenuItem[], parentLevel = 0) => {
    return items.map((item, index) => {
      const hasChildren = !!(item.children && item.children.length > 0);
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
    <OverlayPopover renderTrigger={renderTrigger}>
      <div css={styles.menuRoot} role="menu">
        {renderMenuItems(menuItems)}
      </div>
    </OverlayPopover>
  );
};
