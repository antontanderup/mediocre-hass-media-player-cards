import {
  Button,
  ErrorMessage,
  Label,
  TextInput,
} from "@components/FormElements";
import { HomeAssistant, SearchMediaType } from "@types";
import { FC, Fragment, useCallback, useState } from "preact/compat";
import { HaMediaItem } from "./types";
import { SubForm } from "@components/SubForm";
import { css } from "@emotion/react";

export type HaSearchMediaTypesEditorProps = {
  hass: HomeAssistant;
  entityId: string;
  mediaTypes: SearchMediaType[];
  onChange: (mediaTypes: SearchMediaType[]) => void;
};

const styles = {
  buttons: css({
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  }),
};

export const HaSearchMediaTypesEditor: FC<HaSearchMediaTypesEditorProps> = ({
  hass,
  entityId,
  mediaTypes,
  onChange,
}) => {
  const [getMediaTypesError, setGetMediaTypesError] = useState<string | null>(
    null
  );
  const getMediaTypesFromMediaBrowser = useCallback(async () => {
    // Fetch media types from the media browser API
    const message = {
      type: "call_service",
      domain: "media_player",
      service: "browse_media",
      service_data: {
        entity_id: entityId,
      },
      return_response: true,
    };

    try {
      const response = (await hass.connection.sendMessagePromise(message)) as {
        response: { [key: string]: { children: HaMediaItem[] } };
      };
      if (!response) return [];
      return (
        response.response[entityId]?.children
          .filter(
            item =>
              !item.media_content_id ||
              (item.media_content_id &&
                !item.media_content_id.startsWith("media-source"))
          )
          .map(item => {
            return {
              name: item.title,
              media_type: item.media_content_type,
              icon: getItemMdiIcon(item),
            };
          }) || []
      );
    } catch (error) {
      setGetMediaTypesError(
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }, [entityId]);

  return (
    <SubForm title="Media Types (optional)">
      <Fragment>
        <Label>
          Use custom media types. If none added sensible defaults will be used.
          Be aware that not all media types are necessarily searchable.
        </Label>
        {mediaTypes.map((type, index) => (
          <SubForm
            title={type.name ?? type.media_type}
            error={!type.media_type}
            buttons={[
              {
                icon: "mdi:arrow-up",
                onClick: () => {
                  if (index === 0) return;
                  const newTypes = [...mediaTypes];
                  const temp = newTypes[index - 1];
                  newTypes[index - 1] = newTypes[index];
                  newTypes[index] = temp;
                  onChange(newTypes);
                },
              },
              {
                icon: "mdi:arrow-down",
                onClick: () => {
                  if (index === mediaTypes.length - 1) return;
                  const newTypes = [...mediaTypes];
                  const temp = newTypes[index + 1];
                  newTypes[index + 1] = newTypes[index];
                  newTypes[index] = temp;
                  onChange(newTypes);
                },
              },
              {
                icon: "mdi:delete",
                onClick: () => {
                  const newTypes = [...mediaTypes];
                  newTypes.splice(index, 1);
                  onChange(newTypes);
                },
              },
            ]}
            key={index + type.media_type}
          >
            <TextInput
              hass={hass}
              value={type.name || ""}
              label="Name"
              onChange={value => {
                if (!value) return;
                const newTypes = [...mediaTypes];
                newTypes[index] = { ...newTypes[index], name: value };
                onChange(newTypes);
              }}
            />
            <TextInput
              hass={hass}
              value={type.icon ?? ""}
              isIconInput
              label="Icon"
              onChange={value => {
                if (!value) return;
                const newTypes = [...mediaTypes];
                newTypes[index] = { ...newTypes[index], icon: value };
                onChange(newTypes);
              }}
            />
            <TextInput
              hass={hass}
              value={type.media_type || ""}
              label="Media Type"
              onChange={value => {
                if (!value) return;
                const newTypes = [...mediaTypes];
                newTypes[index] = { ...newTypes[index], media_type: value };
                onChange(newTypes);
              }}
            />
          </SubForm>
        ))}
        <div css={styles.buttons}>
          <Button
            type="button"
            onClick={() =>
              onChange([...mediaTypes, { name: "", media_type: "" }])
            }
          >
            Add
          </Button>
          <Button
            type="button"
            onClick={async () => {
              const mediaTypes = await getMediaTypesFromMediaBrowser();
              if (mediaTypes.length === 0) return;
              onChange(mediaTypes);
            }}
          >
            Generate
          </Button>
          <Button type="button" onClick={() => onChange([])}>
            Clear
          </Button>
        </div>
        {getMediaTypesError && (
          <ErrorMessage>{getMediaTypesError}</ErrorMessage>
        )}
      </Fragment>
    </SubForm>
  );
};

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
