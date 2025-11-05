import { Icon } from "@components/Icon";
import { OverlayMenu } from "@components/OverlayMenu/OverlayMenu";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { CSSProperties } from "preact";
import { useMemo } from "preact/hooks";

export type SelectItem = {
  label: string;
  value: string;
  icon?: string;
};

interface SelectProps {
  options: SelectItem[];
  value?: string;
  placeholder?: string;
  onChange: (value: SelectItem) => void;
  hideSelectedCopy?: boolean;
  disabled?: boolean;
  type?: string;
  label?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
}

const styles = {
  root: css({
    display: "flex",
    position: "relative",
    flexShrink: 0,
  }),
  label: css({
    display: "block",
    marginBottom: "8px",
    color: theme.colors.onCard,
    fontSize: "14px",
    fontWeight: 500,
  }),
  trigger: css({
    "--input-text-color": "var(--primary-text-color)",
    "--input-bg-color": "var(--secondary-background-color)",
    "--input-border-color": "var(--divider-color)",
    "--input-focus-border-color": "var(--secondary-text-color)",
    "--input-disabled-bg-color": "var(--disabled-color)",
    "--input-disabled-text-color": "var(--disabled-text-color)",
    width: "100%",
    padding: "8px 12px",
    color: "var(--input-text-color)",
    backgroundColor: "var(--input-bg-color)",
    border: "none",
    boxShadow: "0 0 1px 1px var(--input-border-color)",
    borderRadius: "6px",
    fontSize: "14px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 1px 1px var(--input-focus-border-color)",
    },
    "&:disabled": {
      backgroundColor: "var(--input-disabled-bg-color)",
      color: "var(--input-disabled-text-color)",
      cursor: "not-allowed",
    },
  }),
};

export const Select = ({
  value = "",
  options = [],
  placeholder,
  hideSelectedCopy = false,
  onChange,
  disabled,
  label,
  className,
  style,
}: SelectProps) => {
  const selectedItem: SelectItem = useMemo(() => {
    return (
      options.find(item => item.value === value) || {
        label: placeholder ?? "Please choose..",
        value: "",
      }
    );
  }, [value, options]);

  return (
    <div css={styles.root} className={className} style={style}>
      {label && <label css={styles.label}>{label}</label>}
      <OverlayMenu
        menuItems={
          disabled
            ? []
            : options.map(option => ({
                label: option.label,
                icon: option.icon,
                selected: option.value === value,
                onClick: () => {
                  if (onChange) onChange(option);
                },
              }))
        }
        renderTrigger={triggerProps => (
          <button css={styles.trigger} disabled={disabled} {...triggerProps}>
            {selectedItem.icon && (
              <Icon icon={selectedItem.icon} size={"x-small"} />
            )}
            {!hideSelectedCopy && selectedItem.label}
          </button>
        )}
      />
    </div>
  );
};
