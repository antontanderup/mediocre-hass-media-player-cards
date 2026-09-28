import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { css } from "@emotion/react";
import { Label, SubForm } from "@components";
import { InputGroup } from "@components/FormElements";

type MaEntitiesFields = {
  ma_entity_id?: string | null;
  ma_favorite_button_entity_id?: string | null;
  ma_favorite_control?: {
    show_on_artwork?: boolean | null;
    favorite_button_size?: "small" | "medium" | "large";
    favorite_button_offset?: string | null;
    active_color?: string | null;
    inactive_color?: string | null;
  } | null;
};

const defaultValues: MaEntitiesFields = {
  ma_entity_id: null,
  ma_favorite_button_entity_id: null,
};

const styles = {
  helperText: css({
    display: "block",
    marginBottom: "12px",
    opacity: 0.8,
  }),
  sectionIntro: css({
    display: "block",
    marginBottom: "12px",
    opacity: 0.75,
    lineHeight: 1.4,
  }),
  sizeRow: css({
    maxWidth: "360px",
    marginBottom: "16px",
  }),
  offsetRow: css({
    marginBottom: "16px",
  }),
  toggleField: css({
    marginBottom: "12px",
  }),
  fieldGrid: css({
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    alignItems: "start",
    "@media (max-width: 720px)": {
      gridTemplateColumns: "1fr",
    },
  }),
  fieldLabel: css({
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
  }),
  select: css({
    width: "100%",
    minHeight: "56px",
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid rgba(0, 0, 0, 0.18)",
    backgroundColor: "var(--card-background-color, #fff)",
    color: "var(--primary-text-color)",
    font: "inherit",
    boxSizing: "border-box",
    outline: "none",
    ":focus": {
      borderColor: "var(--primary-color)",
      boxShadow: "0 0 0 1px var(--primary-color)",
    },
  }),
};

export const FieldGroupMaEntities = withFieldGroup({
  defaultValues,
  props: {
    artworkFavoriteHelperText: "" as string | undefined,
    showArtworkFavoriteControls: true,
  },
  render: function Render({
    artworkFavoriteHelperText,
    group,
    showArtworkFavoriteControls,
  }) {
    const showArtworkFields =
      group.state.values.ma_favorite_control?.show_on_artwork === true;

    return (
      <Fragment>
        <group.AppField
          name="ma_entity_id"
          children={field => (
            <field.EntityPicker
              label="Music Assistant Entity ID (Optional)"
              domains={["media_player"]}
            />
          )}
        />
        <group.AppField
          name="ma_favorite_button_entity_id"
          children={field => (
            <field.EntityPicker
              label="MA Favorite Button Entity ID (Optional)"
              domains={["button"]}
            />
          )}
        />
        {artworkFavoriteHelperText ? (
          <Label css={styles.helperText}>{artworkFavoriteHelperText}</Label>
        ) : null}
        {showArtworkFavoriteControls ? (
          <SubForm
            title="Favorite Button on Artwork (optional)"
            initiallyExpanded={showArtworkFields}
          >
            <Label css={styles.sectionIntro}>
              Adds a Music Assistant favorite toggle to the artwork overlay in
              the large or popup player view.
            </Label>
            <group.AppField
              name="ma_favorite_control.show_on_artwork"
              children={field => (
                <div css={styles.toggleField}>
                  <field.Toggle label="Show favorite button on artwork" />
                </div>
              )}
            />
            {showArtworkFields ? (
              <Fragment>
                <div css={styles.sizeRow}>
                  <group.Field name="ma_favorite_control.favorite_button_size">
                    {field => (
                      <InputGroup>
                        <Label css={styles.fieldLabel}>Button size</Label>
                        <select
                          css={styles.select}
                          onChange={event =>
                            field.handleChange(
                              (event.target as HTMLSelectElement).value as
                                | "small"
                                | "medium"
                                | "large"
                            )
                          }
                          value={field.state.value ?? "small"}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </InputGroup>
                    )}
                  </group.Field>
                </div>
                <div css={styles.offsetRow}>
                  <group.AppField
                    name="ma_favorite_control.favorite_button_offset"
                    children={field => (
                      <field.Text label="Offset (14px or 24px 14px)" />
                    )}
                  />
                </div>
                <div css={styles.fieldGrid}>
                  <group.AppField
                    name="ma_favorite_control.active_color"
                    children={field => (
                      <field.Text label="Active color (default: #f2c94c)" />
                    )}
                  />
                  <group.AppField
                    name="ma_favorite_control.inactive_color"
                    children={field => (
                      <field.Text label="Inactive color (default: #111111)" />
                    )}
                  />
                </div>
              </Fragment>
            ) : (
              <Fragment />
            )}
          </SubForm>
        ) : null}
      </Fragment>
    );
  },
});
