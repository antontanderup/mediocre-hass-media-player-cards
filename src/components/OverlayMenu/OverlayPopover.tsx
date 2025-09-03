import { css, keyframes } from "@emotion/react";
import { Fragment, JSX } from "preact";
import { ButtonHTMLAttributes } from "preact/compat";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";

export type OverlayPopoverProps = {
  renderTrigger: ({
    onClick,
    ref,
  }: Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "ref"
  >) => JSX.Element;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  children: JSX.Element;
};

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const styles = {
  popoverRoot: css({
    position: "fixed",
    zIndex: 9,
    opacity: 1,
    animation: `${fadeIn} 0.3s ease`,
  }),
};

const triggerPadding = 8;

export const OverlayPopover = ({
  renderTrigger,
  side = "bottom",
  align = "start",
  children,
}: OverlayPopoverProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<DOMRect | null>(null);

  // Keyboard navigation: close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Close on outside click (a little involved due to shadow dom)
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const path = e.composedPath ? e.composedPath() : [];
      const target = e.target as Node;
      const popover = popoverRef.current;
      const trigger = triggerRef.current;
      const clickedPopover =
        popover && (path.includes(popover) || popover.contains(target));
      const clickedTrigger =
        trigger && (path.includes(trigger) || trigger.contains(target));
      if (!clickedPopover && !clickedTrigger) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  const handleOnClick = useCallback(() => {
    setOpen(open => !open);
    if (!open) {
      setTriggerPosition(triggerRef.current?.getBoundingClientRect() || null);
      // Timeout to allow for popover to render
      setTimeout(() => {
        setPopoverPosition(popoverRef.current?.getBoundingClientRect() || null);
      }, 0);
    }
  }, [open]);

  const getSidePosition = useCallback(
    (
      side: "left" | "right" | "top" | "bottom",
      trigger: DOMRect,
      popover: DOMRect
    ) => {
      switch (side) {
        case "top":
          return {
            top: trigger.top - triggerPadding - popover.height,
          };
        case "bottom":
          return {
            top: trigger.top + trigger.height + triggerPadding,
          };
        case "left":
          return {
            left: trigger.left - popover.width - triggerPadding,
          };
        case "right":
          return {
            left: trigger.left + trigger.width + triggerPadding,
          };
      }
    },
    []
  );

  const getAlignPosition = useCallback(
    (
      align: "start" | "center" | "end",
      side: "left" | "right" | "top" | "bottom",
      trigger: DOMRect,
      popover: DOMRect
    ) => {
      switch (align) {
        case "start": {
          if (side === "right" || side === "left") {
            return {
              top: trigger.top,
            };
          }
          return {
            left: trigger.left,
          };
        }
        case "center": {
          if (side === "right" || side === "left") {
            return {
              top: trigger.top + trigger.height / 2 - popover.height / 2,
            };
          }
          return {
            left: trigger.left - popover.width / 2 + trigger.width / 2,
          };
        }
        case "end": {
          if (side === "right" || side === "left") {
            return {
              top: trigger.top - popover.height + trigger.height,
            };
          }
          return {
            left: trigger.left - popover.width + trigger.width,
          };
        }
      }
    },
    []
  );

  const popoverStyles = useMemo(() => {
    if (!triggerPosition || !popoverPosition) return {};
    const sidePosition = getSidePosition(
      side,
      triggerPosition,
      popoverPosition
    );
    const alignPosition = getAlignPosition(
      align,
      side,
      triggerPosition,
      popoverPosition
    );
    return {
      ...sidePosition,
      ...alignPosition,
    };
  }, [triggerPosition, popoverPosition, side]);

  return (
    <Fragment>
      {renderTrigger({ onClick: handleOnClick, ref: triggerRef })}
      {open && (
        <div
          css={styles.popoverRoot}
          role="menu"
          style={popoverStyles}
          ref={popoverRef}
        >
          {children}
        </div>
      )}
    </Fragment>
  );
};
