
import { MediaPlayerEntity } from "../types/mediaPlayerEntity";

/**
 * Returns the title and subtitle for a given MediaPlayerEntity.
 * @param player MediaPlayerEntity
 * @returns { title: string, subtitle?: string }
 */
export function getMediaPlayerTitleAndSubtitle(player: MediaPlayerEntity): { title: string; subtitle?: string } {

  if (!player) {
    return {
      title: "Unavailable",
      subtitle: `unknown unavailable`,
    };
  }


  const {
    attributes: {
      media_title: mediaTitle,
      media_artist: artist,
      media_album_name: albumName,
      source,
      friendly_name: friendlyName,
    } = {},
    state,
    entity_id: entityId,
  } = player as MediaPlayerEntity & { entity_id: string };

  if (state === "off") {
    return {
      title: friendlyName ?? entityId,
      subtitle: undefined,
    };
  }

  if (state === "unavailable") {
    return {
      title: "Unavailable",
      subtitle: `${entityId} unavailable`,
    };
  }

  let title: string = mediaTitle ?? "";
  if (!title || title === "") {
    if (
      source &&
      typeof source === "string" &&
      !source.startsWith("media_player.")
    ) {
      title = source;
    } else {
      title = friendlyName ?? entityId;
    }
  }

  let subtitle: string | undefined = undefined;
  if (!!albumName || !!artist) {
    subtitle = `${!!albumName && albumName !== title ? `${albumName} - ` : ""}${artist ?? ""}`;
  }

  return { title: title as string, subtitle };
}
