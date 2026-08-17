import { useState } from "react";
import { techLayers } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

/** System-architecture style stack with animated data flow. */
export function Technology() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="technology" className="relative z-10 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">07 — Technology</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display-lg mt-4 max-w-[22ch]">THE INTELLIGENCE BEHIND THE BOARD.</h2>
        </Reveal>

        <ol className="mt-16 grid gap-px bg-border">
          {techLayers.map((l, i) => (
            <Reveal key={l.title} delay={i * 70}>
              <li
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                className="group relative grid grid-cols-[3rem_1fr] items-center gap-4 bg-background px-4 py-6 transition-colors hover:bg-card md:grid-cols-[5rem_1fr_1fr] md:px-8"
              >
                <span className="label-mono">L{i + 1}</span>
                <h3 className="font-display text-xl tracking-tight uppercase md:text-2xl">
                  {l.title}
                </h3>
                <div className="col-span-2 flex items-center gap-4 md:col-span-1">
                  <p className="label-mono flex-1">{l.sub}</p>
                  <svg viewBox="0 0 120 8" className="h-2 w-24 shrink-0" aria-hidden="true">
                    <path d="M0 4 H120" stroke="var(--color-border)" strokeWidth="1" />
                    <circle
                      r="2"
                      fill="var(--color-primary)"
                      cx={active === i ? 110 : 8}
                      cy="4"
                      style={{ transition: "cx 900ms cubic-bezier(0.16,1,0.3,1)" }}
                    />
                  </svg>
                </div>
                {i < techLayers.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-8 h-px w-0 bg-primary transition-all duration-700 group-hover:w-24 md:left-20"
                  />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={120}>
          <p className="label-mono mt-8">
            Architecture direction under active development — not a description of shipped systems.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
