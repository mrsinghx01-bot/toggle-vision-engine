import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reveal";

/** Short premium boot sequence: trace draws, 0 → 1, wordmark, done (~1.4s). */
export function Loader() {
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setGone(true);
      return;
    }
    const timers = [
      window.setTimeout(() => setStage(1), 420),
      window.setTimeout(() => setStage(2), 820),
      window.setTimeout(() => setStage(3), 1350),
      window.setTimeout(() => setGone(true), 1750),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        stage >= 3 ? "opacity-0" : "opacity-100"
      }`}
    >
      <svg viewBox="0 0 400 40" className="w-[70vw] max-w-md">
        <path
          d="M0 30 H120 V12 H250 V30 H400"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          pathLength={1}
          className="trace-draw"
          style={{ animationDuration: "900ms" }}
        />
      </svg>
      <div className="mt-6 font-mono text-3xl text-primary">
        {stage === 0 ? "0" : "1"}
      </div>
      <div
        className={`mt-4 font-display text-sm tracking-[0.5em] transition-opacity duration-500 ${
          stage >= 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        TOGGLE
      </div>
    </div>
  );
}
