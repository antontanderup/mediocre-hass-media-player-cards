import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact";
import styled from "@emotion/styled";
import { Icon } from "../Icon";
import { CardContext, CardContextType } from "../../utils";

export type MediocreChipMediaPlayerGroupCardConfig = {
  entity_id: string;
  entities: string[];
};

export type Player = {
  entity_id: string;
  friendly_name: string;
};

export type GroupPlayer = Player & {
  isGrouped: boolean;
  isGrouping: boolean;
};

const Chips = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Chip = styled.div<{ $inactive: boolean; $loading: boolean }>`
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  line-height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  background-color: var(--card-background-color);
  color: var(--primary-text-color);
  margin-bottom: 5px;
  margin-right: 5px;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  cursor: pointer;
  opacity: ${props => (props.$loading ? 0.5 : props.$inactive ? 0.8 : 1)};
`;

export const MediocreChipMediaPlayerGroupCard = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreChipMediaPlayerGroupCardConfig>>(
      CardContext
    );

  const [playersLoading, setPlayersLoading] = useState<string[]>([]);

  const players = useMemo((): GroupPlayer[] => {
    const mainPlayer = hass.states[config.entity_id];
    // sorted alfabetically by friendly name
    // grouped players first regardless of friendly name
    return config.entities
      .filter(entity_id => entity_id !== mainPlayer.entity_id)
      .map(entity_id => {
        const player = hass.states[entity_id];
        return {
          entity_id: player.entity_id,
          friendly_name: player.attributes.friendly_name,
          isGrouped: mainPlayer.attributes.group_members.includes(
            player.entity_id
          ),
          isGrouping: playersLoading.includes(player.entity_id),
        };
      })
      .sort((a, b) => {
        // sort by friendly name
        if (a.friendly_name < b.friendly_name) return -1;
        if (a.friendly_name > b.friendly_name) return 1;
        return 0;
      })
      .sort((a, b) => {
        // sort by grouped status
        if (a.isGrouped && !b.isGrouped) return -1;
        if (!a.isGrouped && b.isGrouped) return 1;
        return 0;
      });
  }, [hass, config, playersLoading]);

  const joinPlayer = useCallback(
    async (player: GroupPlayer) => {
      if (player.isGrouping) return;
      setPlayersLoading([...playersLoading, player.entity_id]);
      try {
        await hass.callService("media_player", "turn_on", {
          entity_id: player.entity_id,
        });
        await hass.callService("media_player", "join", {
          entity_id: config.entity_id,
          group_members: [player.entity_id],
        });
      } catch (e) {
        console.error(e);
      }
      setPlayersLoading(playersLoading.filter(id => id !== player.entity_id));
    },
    [hass, config]
  );

  const unjoinPlayer = useCallback(
    async (player: GroupPlayer) => {
      if (player.isGrouping) return;
      setPlayersLoading([...playersLoading, player.entity_id]);
      try {
        await hass.callService("media_player", "unjoin", {
          entity_id: player.entity_id,
        });
        await hass.callService("media_player", "turn_off", {
          entity_id: player.entity_id,
        });
      } catch (e) {
        console.error(e);
      }
      setPlayersLoading(playersLoading.filter(id => id !== player.entity_id));
    },
    [hass, config]
  );

  return (
    <Fragment>
      <Chips className="chips">
        {players.map(player => (
          <Chip
            $inactive={!player.isGrouped}
            $loading={player.isGrouping}
            key={player.entity_id}
            onClick={() => {
              if (player.isGrouped) {
                unjoinPlayer(player);
              } else {
                joinPlayer(player);
              }
            }}
          >
            {player.friendly_name}
            {player.isGrouped && <Icon size="x-small" icon="mdi:close" />}
            {!player.isGrouped && <Icon size="x-small" icon="mdi:plus" />}
          </Chip>
        ))}
      </Chips>
    </Fragment>
  );
};
