import { Icon } from "@components/Icon";

export type MediaSectionTitleProps = {
  children: string;
  onClick?: () => void;
};

export const MediaSectionTitle = ({
  children,
  onClick,
}: MediaSectionTitleProps) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        margin: "0 4px",
        padding: "0px var(--mmpc-search-padding, 0px)",
        "&:first-child": {
          marginTop: -12,
        },
      }}
      onClick={onClick}
    >
      <h3
        css={{
          fontSize: "16px",
          fontWeight: 500,
          color: "var(--primary-text-color)",
        }}
      >
        {children}
      </h3>
      <Icon icon="mdi:chevron-right" size={"small"} />
    </div>
  );
};
