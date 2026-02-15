import { searchFilter } from "@types";
import { withFieldGroup } from "../hooks/useAppForm";
import { Fragment } from "preact/jsx-runtime";
import { SubForm } from "@components/SubForm";
import { Button, FormGroup } from "@components/FormElements";
import { useCallback } from "preact/hooks";
import { HaMediaItem } from "@components/HaSearch/types";
import { getHass } from "@utils";
import { css } from "@emotion/react";

// Type for a single SearchFilter item
export type SearchFilter = typeof searchFilter.infer;

type SearchFilterGroupFields = {
  filters: SearchFilter[];
};
const defaultValues: SearchFilterGroupFields = {
  filters: [],
};

const styles = {
  buttons: css({
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  }),
};

export const FieldGroupSearchFilters = withFieldGroup({
  defaultValues,
  props: {
    entity_id: "string",
  },
  render: function Render({ group, entity_id }) {
    const getFiltersFromMediaBrowser = useCallback(async () => {
      const hass = getHass();
      // Fetch media types from the media browser API
      const message = {
        type: "call_service",
        domain: "media_player",
        service: "browse_media",
        service_data: {
          entity_id: entity_id,
        },
        return_response: true,
      };

      try {
        const response = (await hass.connection.sendMessagePromise(
          message
        )) as {
          response: { [key: string]: { children: HaMediaItem[] } };
        };
        if (!response) return [];
        return (
          response.response[entity_id]?.children
            .filter(
              item =>
                !item.media_content_id ||
                (item.media_content_id &&
                  !item.media_content_id.startsWith("media-source"))
            )
            .map(item => {
              return {
                name: item.title,
                media_content_type: item.media_content_type,
                media_filter_class: item.children_media_class,
                icon: getItemMdiIcon(item),
              };
            }) || []
        );
      } catch (error) {
        return [];
      }
    }, [entity_id]);

    return (
      <group.Field name="filters" mode="array">
        {filtersField => (
          <Fragment>
            {Array.isArray(filtersField.state.value) &&
              filtersField.state.value.map((filter, index) => (
                <SubForm
                  title={
                    filter.name ||
                    ("media_content_type" in filter
                      ? filter.media_content_type
                      : undefined) ||
                    ("media_filter_class" in filter
                      ? filter.media_filter_class
                      : undefined) ||
                    `Filter ${index}`
                  }
                  buttons={[
                    {
                      icon: "mdi:delete",
                      onClick: () => filtersField.removeValue(index),
                    },
                    {
                      icon: "mdi:arrow-up",
                      onClick: () => filtersField.moveValue(index, index - 1),
                    },
                    {
                      icon: "mdi:arrow-down",
                      onClick: () => filtersField.moveValue(index, index + 1),
                    },
                  ]}
                  key={index}
                >
                  <FormGroup>
                    <group.AppField
                      name={`filters[${index}].name`}
                      children={field => <field.Text label={"Name"} />}
                    />
                    <group.AppField
                      name={`filters[${index}].icon`}
                      children={field => (
                        <field.Text isIconInput label={"Icon (mdi:...)"} />
                      )}
                    />
                    <group.AppField
                      name={`filters[${index}].media_content_type`}
                      children={field => (
                        <field.Text label={"Media Content Type"} />
                      )}
                    />
                    <group.AppField
                      name={`filters[${index}].media_filter_class`}
                      children={field => (
                        <field.Text label={"Media Filter Class"} />
                      )}
                    />
                  </FormGroup>
                </SubForm>
              ))}
            <div css={styles.buttons}>
              <Button
                variant="neutral"
                onClick={() => filtersField.pushValue({} as SearchFilter)}
              >
                Add filter
              </Button>
              <Button
                variant="neutral"
                onClick={async () => {
                  const filters = await getFiltersFromMediaBrowser();
                  if (filters.length === 0) return;
                  filters.forEach(filter => {
                    filtersField.pushValue(filter);
                  });
                }}
              >
                Generate
              </Button>
              <Button
                variant="danger"
                onClick={() => filtersField.setValue([])}
              >
                Clear
              </Button>
            </div>
          </Fragment>
        )}
      </group.Field>
    );
  },
});

const getItemMdiIcon = (item: HaMediaItem) => {
  if (item.thumbnail) return item.thumbnail;

  switch (item.media_class) {
    case "album":
      return "mdi:album";
    case "artist":
      return "mdi:account-music";
    case "track":
      return "mdi:music-note";
    case "playlist":
      return "mdi:playlist-music";
    default:
      return "mdi:folder-music";
  }
};
