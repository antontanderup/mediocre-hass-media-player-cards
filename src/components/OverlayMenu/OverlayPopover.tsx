import { css, keyframes } from "@emotion/react";
import { Fragment } from "preact";
import { forwardRef, useImperativeHandle } from "preact/compat";
import type { JSX, ButtonHTMLAttributes } from "preact";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { useWindowScroll } from "@uidotdev/usehooks";

export type OverlayPopoverProps = {
  renderTrigger: ({
    onClick,
    ref,
  }: Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "onMouseEnter" | "ref"
  >) => JSX.Element;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  children: JSX.Element;
};

export type OverlayPopoverHandle = {
  setOpen: (open: boolean) => void;
};

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const styles = {
  popoverWrap: css({
    position: "relative",
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
    border: "none",
    pointerEvents: "none",
  }),
  popoverRoot: css({
    pointerEvents: "auto",
    position: "absolute",
    zIndex: 100,
    opacity: 1,
    backgroundColor: "transparent",
    padding: 0,
    animation: `${fadeIn} 0.3s ease`,
    maxHeight: "100vh",
    overflowY: "auto",
    ":popover-open": {
      border: 0,
    },
  }),
};

const triggerPadding = 8;

export const OverlayPopover = forwardRef<
  OverlayPopoverHandle,
  OverlayPopoverProps
>(
  (
    {
      renderTrigger,
      side: sideInput = "bottom",
      align: alignInput = "start",
      children,
    },
    ref
  ) => {
    const [sideOverride, setSideOverride] = useState<
      OverlayPopoverProps["side"] | undefined
    >();
    const [alignOverride, setAlignOverride] = useState<
      OverlayPopoverProps["align"] | undefined
    >();
    const side = sideOverride ?? sideInput;
    const align = alignOverride ?? alignInput;

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({ setOpen }), [setOpen]);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [triggerPosition, setTriggerPosition] = useState<DOMRect | null>(
      null
    );
    const [popoverPosition, setPopoverPosition] = useState<DOMRect | null>(
      null
    );

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
          setAlignOverride(undefined);
          setSideOverride(undefined);
        }
      }
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }, [open]);

    const handleOpen = () => {
      setOpen(true);
      setTriggerPosition(triggerRef.current?.getBoundingClientRect() || null);
      // Timeout to allow for popover to render
      setTimeout(() => {
        setPopoverPosition(popoverRef.current?.getBoundingClientRect() || null);
      }, 0);
    };

    const handleOnClick = useCallback(() => {
      if (open) {
        setOpen(false);
        setAlignOverride(undefined);
        setSideOverride(undefined);
      } else {
        handleOpen();
      }
    }, [open]);

    const [scroll] = useWindowScroll();
    const getSidePosition = useCallback(
      (
        side: "left" | "right" | "top" | "bottom",
        trigger: DOMRect,
        popover: DOMRect
      ) => {
        switch (side) {
          case "top":
            return {
              top: Math.max(0, trigger.top - triggerPadding - popover.height),
            };
          case "bottom":
            return {
              top: Math.max(0, trigger.top + trigger.height + triggerPadding),
            };
          case "left":
            return {
              left: Math.max(0, trigger.left - popover.width - triggerPadding),
            };
          case "right":
            return {
              left: Math.max(0, trigger.left + trigger.width + triggerPadding),
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
                top: Math.max(0, trigger.top),
              };
            }
            return {
              left: trigger.left,
            };
          }
          case "center": {
            if (side === "right" || side === "left") {
              return {
                top: Math.max(
                  0,
                  trigger.top + trigger.height / 2 - popover.height / 2
                ),
              };
            }
            return {
              left: trigger.left - popover.width / 2 + trigger.width / 2,
            };
          }
          case "end": {
            if (side === "right" || side === "left") {
              return {
                top: Math.max(0, trigger.top - popover.height + trigger.height),
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
    }, [triggerPosition, popoverPosition, side, align]);

    // IntersectionObserver for popover and window
    useEffect(() => {
      const popover = popoverRef.current;
      if (!popover || !open) return;
      const observer = new window.IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio < 1) {
              // Popover is not fully visible
              if (
                entry.boundingClientRect.height !==
                entry.intersectionRect.height
              ) {
                const overflowingTop =
                  entry.boundingClientRect.top !== entry.intersectionRect.top;
                const overflowingBottom =
                  entry.intersectionRect.bottom !==
                  entry.boundingClientRect.bottom;
                if (overflowingBottom && overflowingTop) {
                  // Overflow handled by css
                } else {
                  if (overflowingBottom) {
                    if (sideInput === "bottom") {
                      setSideOverride("top");
                    }
                    if (sideInput === "right" || sideInput === "left") {
                      setAlignOverride("end");
                    }
                  }
                  if (overflowingTop) {
                    if (sideInput === "top") {
                      setSideOverride("bottom");
                    }
                    if (sideInput === "right" || sideInput === "left") {
                      setAlignOverride("start");
                    }
                  }
                }
              }
              if (
                entry.boundingClientRect.width !== entry.intersectionRect.width
              ) {
                const overflowingRight =
                  entry.boundingClientRect.right !==
                  entry.intersectionRect.right;
                const overflowingLeft =
                  entry.boundingClientRect.left !== entry.intersectionRect.left;
                if (overflowingLeft && overflowingRight) {
                  // Overflow handled by css
                } else {
                  if (overflowingRight) {
                    if (sideInput === "top" || sideInput === "bottom") {
                      setAlignOverride("end");
                    }
                    if (sideInput === "right") {
                      setSideOverride("left");
                    }
                  }
                  if (overflowingLeft) {
                    if (sideInput === "top" || sideInput === "bottom") {
                      setAlignOverride("start");
                    }
                    if (sideInput === "left") {
                      setSideOverride("right");
                    }
                  }
                }
              }
            }
          });
        },
        {
          root: null, // Observe with respect to viewport
          threshold: 0, // Adjust as needed
        }
      );

      observer.observe(popover);

      return () => {
        observer.disconnect();
      };
    }, [popoverRef.current, open, sideInput, alignInput]);

    const popoverId = useState(
      () => `overlay-popover-${Math.random().toString(36).substr(2, 9)}`
    )[0];

    return (
      <Fragment>
        {renderTrigger({
          onClick: handleOnClick,
          // @ts-expect-error this works, it's just TS being weird
          popoverTarget: popoverId,
          ref: triggerRef,
        })}
        {open && (
          <div
            style={{
              top: scroll?.y || 0,
              left: scroll?.x || 0,
            }}
            css={styles.popoverWrap}
            id={popoverId}
            popover="manual"
          >
            <button popoverTarget={popoverId}> </button>
            <div
              css={styles.popoverRoot}
              role="menu"
              style={popoverStyles}
              ref={popoverRef}
            >
              {children}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
);
