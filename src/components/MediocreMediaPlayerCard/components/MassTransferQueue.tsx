import { useContext, useMemo } from "preact/hooks";
import type { MediaPlayerEntity, MediocreMediaPlayerCardConfig } from "@types";
import {
    CardContext,
    CardContextType,
    useHass,
    Chip,
} from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getAllMassPlayers, getIsMassPlayer, transferMaQueue } from "@utils";

const styles = {
    speakerGroupContainer: css({
        display: "flex",
        flexDirection: "column",
        paddingTop: "12px",
        paddingBottom: "16px",
        borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
        gap: "12px",
    }),
    groupTitle: css({
        fontSize: "16px",
        fontWeight: 500,
        color: theme.colors.onCard,
        margin: "0px 16px",
    }),
    syncContainer: css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
        gap: "4px",
        marginRight: "19px",
    }),
    syncText: css({
        fontSize: "12px",
        color: theme.colors.onCardMuted,
    }),
    groupedSpeakers: css({
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginLeft: "16px",
        marginRight: "16px",
    }),
    titleRow: css({
        display: "flex",
        alignItems: "center",
    }),
};

export const MassTransferQueue = () => {
    const hass = useHass();
    const { config } =
        useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

    const { entity_id, ma_entity_id } = config;

    // Use the specified entity_id for the group or fall back to the main entity_id
    const maEntity = hass.states[ma_entity_id ?? entity_id];
    const isMainEntityMassPlayer = getIsMassPlayer(maEntity as MediaPlayerEntity);

    const massPlayers = useMemo(() => {
        if (!isMainEntityMassPlayer) return [];
        return getAllMassPlayers().filter(
            (player) => player.entity_id !== (ma_entity_id ?? entity_id) && getIsMassPlayer(player) && player.state !== "unavailable"
        );
    }, [hass.states, maEntity, isMainEntityMassPlayer, ma_entity_id, entity_id]);

    if (massPlayers.length === 0) return null;

    return (
        <div css={styles.speakerGroupContainer}>
            <h3 css={styles.groupTitle}>Transfer queue to speaker</h3>
            {massPlayers.map((player) => (
                <Chip
                    key={player.entity_id}
                    onClick={() => transferMaQueue(maEntity.entity_id, player.entity_id)}
                >{player.attributes.friendly_name || player.entity_id}</Chip>
            ))}
        </div>
    );
};
