import { useEffect, useState } from "react";
import { PcbCanvas } from "@/components/PcbCanvas";
import { usePrefersReducedMotion } from "@/hooks/use-reveal";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = [
      window.setTimeout(() => setPhase(1), 300),
      window.setTimeout(() => setPhase(2), 900),
      window.setTimeout(() => setPhase(3), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  return (
    <section id="top" className="relative z-10 min-h-[100svh] overflow-hidden pt-16">
      {/* Procedural PCB, forms behind the type */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ${
          phase >= 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-x-0 top-[6%] mx-auto h-[62svh] w-full max-w-[1050px]">
          <PcbCanvas seed={11} spin={0.1} />
        </div>
        <div className="absolute inset-0 bg-background/45" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
        <div
          className={`flex items-center gap-3 transition-all duration-1000 ${
            phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary signal-blink" />
          <span className="label-mono">System: Ready · Early-stage · Building in public</span>
        </div>

        <h1
          className={`display-xl mt-6 max-w-[16ch] transition-all duration-1000 ${
            phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          TURN IDEAS
          <br />
          INTO <span className="text-primary text-glow">HARDWARE.</span>
        </h1>

        <div
          className={`mt-8 grid gap-10 transition-all duration-1000 md:grid-cols-[minmax(0,46ch)_auto] md:items-end md:justify-between ${
            phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Toggle is building an AI-powered way to turn ideas into electronic designs — from
            concept and requirements to circuits, schematics, and PCB layouts.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#vision"
              className="group inline-flex items-center gap-3 border border-primary/60 px-6 py-4 font-mono text-xs tracking-[0.18em] text-primary uppercase transition-all hover:bg-primary/10 hover:shadow-[var(--glow-primary)]"
            >
              Explore the Vision
              <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                ↓
              </span>
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-3 border border-border px-6 py-4 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-foreground/60"
            >
              Meet Toggle
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
