import { useMemo, useEffect, useState } from "preact/hooks";
import { Icon, ProgressBar, usePlayer } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import { getHass, getSourceIcon } from "@utils";

const styles = {
  root: css({
    paddingLeft: "var(--mmpc-extra-horizontal-padding, 0px)",
    paddingRight: "var(--mmpc-extra-horizontal-padding, 0px)",
  }),
  timeWrap: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "4px",
    color: theme.colors.onDialogMuted,
    height: "20px",
    marginBottom: "-4px",
  }),
  timeWrapNoSource: css({
    marginBottom: "-20px",
  }),
  sourceSelect: css({
    background: "none",
    border: "none",
    color: theme.colors.onDialogMuted,
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    padding: 0,
    display: "flex",
    gap: "4px",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  }),
};

export const Track = () => {
  const player = usePlayer();
  const [tick, setTick] = useState(0);
  const isPlaying = player.state === "playing";

  // Set up tick that updates once per second, but only when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const position = useMemo(() => {
    const mediaPosition = player.attributes?.media_position ?? null;
    const mediaPositionUpdatedAt =
      player.attributes?.media_position_updated_at ?? null;
    const mediaDuration = player.attributes?.media_duration ?? null;
    if (
      mediaPosition === null ||
      mediaPosition < 0 ||
      mediaDuration === null ||
      mediaPositionUpdatedAt === null
    ) {
      return null;
    }

    const now = new Date();
    const lastUpdate = new Date(mediaPositionUpdatedAt);
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();
    const currentPosition = timeSinceLastUpdate / 1000 + mediaPosition;
    const getPrettyPrinted = (pos: number) => {
      const minutes = Math.floor(pos / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.round(pos - Number(minutes) * 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    return {
      currentPosition,
      mediaDuration,
      prettyNow: getPrettyPrinted(currentPosition),
      prettyEnd: getPrettyPrinted(mediaDuration),
    };
  }, [player, tick]); // Added tick to the dependency array to update when tick changes

  const sourceSelectMenuItems: OverlayMenuItem[] = useMemo(() => {
    return (player.attributes.source_list ?? []).map(source => ({
      label: source,
      onClick: () => {
        getHass().callService("media_player", "select_source", {
          entity_id: player.entity_id,
          source,
        });
      },
    }));
  }, [player.attributes.source_list, player.attributes.source]);

  return (
    <div css={styles.root}>
      {position && (
        <ProgressBar
          value={position.currentPosition}
          min={0}
          max={position.mediaDuration}
        />
      )}
      <div
        css={[
          styles.timeWrap,
          !player.attributes.source && styles.timeWrapNoSource,
        ]}
      >
        {position && <span>{position.prettyNow}</span>}
        {sourceSelectMenuItems.length > 0 && player.attributes.source && (
          <OverlayMenu
            align="center"
            menuItems={sourceSelectMenuItems}
            renderTrigger={triggerProps => (
              <button {...triggerProps} css={styles.sourceSelect}>
                <Icon
                  size="xx-small"
                  icon={getSourceIcon({
                    source: player.attributes.source ?? "",
                  })}
                />
                {player.attributes.source}
                <Icon size="xx-small" icon="mdi:chevron-down" />
              </button>
            )}
          />
        )}
        {position && <span>{position.prettyEnd}</span>}
      </div>
    </div>
  );
};
