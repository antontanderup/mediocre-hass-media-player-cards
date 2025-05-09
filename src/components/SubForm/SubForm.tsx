import { useState } from "preact/hooks";
import { IconButton } from "@components";
import { JSX } from "preact";
import { css } from "@emotion/react";

const styles = {
  root: css({
    border: "1px solid var(--divider-color, #e0e0e0)",
    borderRadius: "8px",
    position: "relative",
    marginBottom: "16px",
    backgroundColor: "var(--card-background-color, #fff)",
  }),
  header: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "none",
  }),
  headerExpanded: css({
    borderBottom: "1px solid var(--divider-color, #e0e0e0)",
  }),
  title: css({
    margin: 0,
    fontSize: "16px",
    fontWeight: 500,
  }),
  content: css({
    padding: 16,
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
}: {
  title: string;
  children: JSX.Element | JSX.Element[];
  initiallyExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <div css={styles.root}>
      <div css={[styles.header, expanded && styles.headerExpanded]}>
        <h3 css={styles.title}>{title}</h3>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
          type="button"
          size={"small"}
        />
      </div>
      <div css={[styles.content, expanded && styles.contentExpanded]}>
        {children}
      </div>
    </div>
  );
};
