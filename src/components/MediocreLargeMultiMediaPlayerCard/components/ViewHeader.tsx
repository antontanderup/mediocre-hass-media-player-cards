import { theme } from "@constants";
import { css } from "@emotion/react";
import { JSX } from "preact/jsx-runtime";

type ViewHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  renderAction?: () => JSX.Element;
};

const styles = {
  root: css({}),
  titleRow: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  }),
  title: css({
    fontSize: 20,
    color: theme.colors.onCard,
  }),
  subtitle: css({
    fontSize: 14,
    color: theme.colors.onCardMuted,
  }),
};

export const ViewHeader = ({
  title,
  subtitle,
  className,
  renderAction,
}: ViewHeaderProps) => {
  return (
    <div css={styles.root} className={className}>
      <div css={styles.titleRow}>
        <span css={styles.title}>{title}</span>
        {!!renderAction && renderAction()}
      </div>
      {!!subtitle && <span css={styles.subtitle}>{subtitle}</span>}
    </div>
  );
};
