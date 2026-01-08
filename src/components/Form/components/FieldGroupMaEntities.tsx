import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";

type MaEntitiesFields = {
  ma_entity_id?: string | null;
  ma_favorite_button_entity_id?: string | null;
};

const defaultValues: MaEntitiesFields = {
  ma_entity_id: null,
  ma_favorite_button_entity_id: null,
};

export const FieldGroupMaEntities = withFieldGroup({
  defaultValues,
  props: {},
  render: function Render({ group }) {
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
      </Fragment>
    );
  },
});
