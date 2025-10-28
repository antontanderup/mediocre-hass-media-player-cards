import { useState } from "preact/hooks";
import { IconButton } from "@components";
import { JSX } from "preact";
import { css } from "@emotion/react";

const styles = {
  root: css({
    border: "1px solid var(--outline-color, #e0e0e0)",
    borderRadius: "6px",
    position: "relative",
    marginBottom: "16px",
  }),
  rootError: css({
    borderColor: "var(--error-color, #ff5252)",
  }),
  header: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    borderBottom: "none",
  }),
  headerButtons: css({
    display: "flex",
    gap: "8px",
    alignItems: "center",
  }),
  headerExpanded: css({
    borderBottom: "1px solid var(--outline-color, #e0e0e0)",
  }),
  title: css({
    margin: 0,
    fontSize: "14px",
    fontWeight: 500,
  }),
  content: css({
    padding: 12,
    display: "none",
  }),
  contentExpanded: css({
    display: "block",
  }),
};

export const SubForm = ({
  title,
  children,
  initiallyExpanded = false,
  buttons = [],
  error,
}: {
  title: string;
  children: JSX.Element | JSX.Element[];
  buttons?: { icon: string; onClick: () => void }[];
  initiallyExpanded?: boolean;
  error?: string | boolean;
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <div css={[styles.root, !!error && styles.rootError]}>
      <div css={[styles.header, expanded && styles.headerExpanded]}>
        <div css={styles.title}>{title}</div>
        <div css={styles.headerButtons}>
          {buttons.map((button, index) => (
            <IconButton
              key={index + button.icon}
              icon={button.icon}
              onClick={button.onClick}
              type="button"
              size={"small"}
            />
          ))}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            type="button"
            size={"small"}
          />
        </div>
      </div>
      <div css={[styles.content, expanded && styles.contentExpanded]}>
        {children}
      </div>
    </div>
  );
};
