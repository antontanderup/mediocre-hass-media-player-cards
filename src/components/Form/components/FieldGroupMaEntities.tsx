import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { useIntl } from "@components/i18n";

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
    const { t } = useIntl();
    return (
      <Fragment>
        <group.AppField
          name="ma_entity_id"
          children={field => (
            <field.EntityPicker
              label={t({ id: "Editor.ma_entities.ma_entity_id" })}
              domains={["media_player"]}
            />
          )}
        />
        <group.AppField
          name="ma_favorite_button_entity_id"
          children={field => (
            <field.EntityPicker
              label={t({ id: "Editor.ma_entities.ma_favorite_button" })}
              domains={["button"]}
            />
          )}
        />
      </Fragment>
    );
  },
});
