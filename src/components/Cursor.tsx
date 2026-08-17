import { useEffect, useState } from "react";
import { useIsDesktop } from "@/hooks/use-reveal";

/** Elegant desktop-only cursor: dot, expanded ring on interactives, crosshair on PCB parts. */
export function Cursor() {
  const desktop = useIsDesktop();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<"dot" | "ring" | "cross">("dot");

  useEffect(() => {
    if (!desktop) return;
    const move = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement | null;
      if (el?.closest("[data-cursor='cross']")) setMode("cross");
      else if (el?.closest("a, button, [role='button']")) setMode("ring");
      else setMode("dot");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [desktop]);

  if (!desktop) return null;

  const size = mode === "dot" ? 8 : mode === "ring" ? 38 : 26;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[100] transition-[width,height,border-radius,opacity] duration-200"
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
      }}
    >
      {mode === "cross" ? (
        <svg viewBox="0 0 26 26" className="h-full w-full text-primary">
          <path d="M13 0v26M0 13h26" stroke="currentColor" strokeWidth="1" />
          <circle cx="13" cy="13" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      ) : (
        <div
          className={
            mode === "ring"
              ? "h-full w-full rounded-full border border-primary/70 bg-primary/5"
              : "h-full w-full rounded-full bg-primary"
          }
        />
      )}
    </div>
  );
}
