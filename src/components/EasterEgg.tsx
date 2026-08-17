import { useEffect, useState } from "react";

/** Press T: a hidden trace sweeps the screen and the status indicator flips. */
export function EasterEgg() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /input|textarea/i.test(el.tagName)) return;
      if (e.key.toLowerCase() === "t") {
        setOn(true);
        window.setTimeout(() => setOn(false), 2600);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <span className="label-mono">
          SYSTEM: {on ? "TOGGLED" : "READY"} · press T
        </span>
      </div>
      {on && (
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M-5 80 H24 V40 H52 V72 H78 V20 H105"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="0.4"
            pathLength={1}
            className="trace-draw"
          />
        </svg>
      )}
    </>
  );
}
