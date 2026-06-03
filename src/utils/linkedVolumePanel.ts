import type {
  LinkedVolumePanel,
  LinkedVolumePanelEntity,
  MediocreMultiMediaPlayer,
} from "@types";

type MediaPlayerStateMap = Record<
  string,
  {
    attributes?: unknown;
  } | undefined
>;

const getMainEntityId = (player: MediocreMultiMediaPlayer) =>
  player.speaker_group_entity_id ?? player.entity_id;

const getGroupMembers = (
  player: MediocreMultiMediaPlayer,
  states: MediaPlayerStateMap
) => {
  const groupMembers = (
    states[getMainEntityId(player)]?.attributes as
      | { group_members?: unknown }
      | undefined
  )?.group_members;
  return Array.isArray(groupMembers)
    ? groupMembers.filter((member): member is string => typeof member === "string")
    : [];
};

export const getCleanLinkedVolumePanel = (
  linkedVolumePanel?: LinkedVolumePanel | null
): LinkedVolumePanel | undefined => {
  if (!linkedVolumePanel) return undefined;

  const entities = linkedVolumePanel.entities
    .map(entity => {
      const entityId = entity.entity_id?.trim();
      if (!entityId) return null;

      const name = entity.name?.trim();
      const icon = entity.icon?.trim();

      return {
        entity_id: entityId,
        ...(name ? { name } : {}),
        ...(icon ? { icon } : {}),
        ...(entity.show_power ? { show_power: true } : {}),
      };
    })
    .filter(Boolean) as LinkedVolumePanelEntity[];

  const launchFrom =
    linkedVolumePanel.launch_from === "trailing_volume_bar_button"
      ? "trailing_volume_bar_button"
      : "disabled";
  const includeGroupedPlayers =
    linkedVolumePanel.include_grouped_players === true;

  if (
    entities.length === 0 &&
    !includeGroupedPlayers &&
    launchFrom === "disabled"
  ) {
    return undefined;
  }

  return {
    ...(launchFrom === "trailing_volume_bar_button"
      ? { launch_from: "trailing_volume_bar_button" as const }
      : {}),
    ...(includeGroupedPlayers ? { include_grouped_players: true } : {}),
    entities,
  };
};

export const getConfiguredLinkedVolumePanelEntities = (
  player: MediocreMultiMediaPlayer
) => {
  const configuredEntities = player.linked_volume_panel?.entities ?? [];
  const seen = new Set<string>();

  return configuredEntities.filter(entity => {
    if (seen.has(entity.entity_id)) return false;
    seen.add(entity.entity_id);
    return true;
  });
};

const getPlayerTitle = (player: MediocreMultiMediaPlayer) => player.entity_id;

const getSectionEntities = (
  player: MediocreMultiMediaPlayer,
  includeSelfByDefault: boolean
) => {
  const configuredEntities = getConfiguredLinkedVolumePanelEntities(player);

  if (!includeSelfByDefault) {
    return configuredEntities;
  }

  const seen = new Set<string>();
  const entities: LinkedVolumePanelEntity[] = [];
  const pushEntity = (entity: LinkedVolumePanelEntity) => {
    if (seen.has(entity.entity_id)) return;
    seen.add(entity.entity_id);
    entities.push(entity);
  };

  const configuredSelfEntity = configuredEntities.find(
    entity => entity.entity_id === player.entity_id
  );

  pushEntity(
    configuredSelfEntity ?? {
      entity_id: player.entity_id,
    }
  );

  configuredEntities.forEach(pushEntity);

  return entities;
};

export const getLinkedVolumePanelSections = (
  selectedPlayer: MediocreMultiMediaPlayer,
  mediaPlayers: MediocreMultiMediaPlayer[],
  states: MediaPlayerStateMap
) => {
  const sections: {
    key: string;
    title: string;
    entities: LinkedVolumePanelEntity[];
  }[] = [];

  const selectedEntities = getSectionEntities(selectedPlayer, false);
  if (selectedEntities.length > 0) {
    sections.push({
      key: selectedPlayer.entity_id,
      title: getPlayerTitle(selectedPlayer),
      entities: selectedEntities,
    });
  }

  if (selectedPlayer.linked_volume_panel?.include_grouped_players !== true) {
    return sections;
  }

  const selectedMainEntityId = getMainEntityId(selectedPlayer);
  const playersByRuntimeId = new Map<string, MediocreMultiMediaPlayer>();

  mediaPlayers.forEach(player => {
    playersByRuntimeId.set(getMainEntityId(player), player);
  });
  playersByRuntimeId.set(selectedMainEntityId, selectedPlayer);

  getGroupMembers(selectedPlayer, states)
    .filter(entityId => entityId !== selectedMainEntityId)
    .map(entityId => playersByRuntimeId.get(entityId))
    .filter(Boolean)
    .forEach(player => {
      const groupedPlayer = player!;
      const entities = getSectionEntities(groupedPlayer, true);
      if (entities.length === 0) return;

      sections.push({
        key: groupedPlayer.entity_id,
        title: getPlayerTitle(groupedPlayer),
        entities,
      });
    });

  return sections;
};

export const getCanOpenLinkedVolumePanel = (
  player: MediocreMultiMediaPlayer,
  mediaPlayers: MediocreMultiMediaPlayer[],
  states: MediaPlayerStateMap
) => {
  if (player.linked_volume_panel?.launch_from !== "trailing_volume_bar_button") {
    return false;
  }

  return getLinkedVolumePanelSections(player, mediaPlayers, states).length > 0;
};
