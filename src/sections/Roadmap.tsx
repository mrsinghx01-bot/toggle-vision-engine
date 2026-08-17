import { useState } from "react";
import { roadmap } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

export function Roadmap() {
  const [open, setOpen] = useState(0);

  return (
    <section id="roadmap" className="relative z-10 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">10 — Roadmap</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display-lg mt-4 max-w-[18ch]">PHASES, NOT PROMISES.</h2>
        </Reveal>

        <div className="mt-14 grid gap-px bg-border lg:grid-cols-4">
          {roadmap.map((r, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={r.phase} delay={i * 80} className="bg-background">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  className="w-full p-8 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-primary" : "bg-border"}`}
                    />
                    <span className="label-mono">{r.phase}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl tracking-tight uppercase md:text-3xl">
                    {r.title}
                  </h3>
                  <ul
                    className={`mt-6 space-y-2 overflow-hidden transition-all duration-700 ${
                      isOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0 lg:max-h-56 lg:opacity-40"
                    }`}
                  >
                    {r.items.map((it) => (
                      <li key={it} className="flex gap-3 font-mono text-xs text-muted-foreground">
                        <span className="h-px w-4 translate-y-2 bg-primary/60" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
