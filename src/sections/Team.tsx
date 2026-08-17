import { useState } from "react";
import { team } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

/** Team as nodes on a board: people → ideas → systems. */
export function Team() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="about" className="relative z-10 border-t border-border/70 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">11 — About</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display-lg mt-4 max-w-[20ch]">BUILT BY PEOPLE WHO WANT TO BUILD.</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-[54ch] text-lg text-muted-foreground">
            We started with a simple question: why is turning an idea into hardware still so
            complicated? Toggle grew out of prototyping evenings, half-finished boards, and the
            feeling that the hard part should be the idea — not the paperwork around it.
          </p>
        </Reveal>

        {/* trace network connecting the people */}
        <div className="relative mt-16">
          <svg
            viewBox="0 0 100 20"
            className="absolute inset-x-0 -top-8 h-16 w-full"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            {team.map((_, i) => {
              const x = (100 / team.length) * (i + 0.5);
              return (
                <path
                  key={i}
                  d={`M50 0 V8 H${x} V20`}
                  fill="none"
                  stroke={active === i ? "var(--color-primary)" : "var(--color-border)"}
                  strokeWidth={active === i ? 0.6 : 0.35}
                  style={{ transition: "all 300ms" }}
                />
              );
            })}
          </svg>

          <ul className="grid gap-px bg-border md:grid-cols-3">
            {team.map((m, i) => (
              <li
                key={`${m.name}-${i}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                className="group relative bg-background p-8 transition-colors hover:bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="label-mono">node 0{i + 1}</span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active === i ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>
                <h3 className="mt-8 font-display text-2xl tracking-tight">{m.name}</h3>
                <p className="label-mono mt-2">{m.role}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                <div className="mt-6 flex gap-5">
                  {m.github && (
                    <a href={m.github} className="label-mono hover:text-primary">
                      GitHub
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} className="label-mono hover:text-primary">
                      LinkedIn
                    </a>
                  )}
                </div>
                <div className="mt-8 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full" />
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={100}>
          <p className="label-mono mt-8">People → Ideas → Systems</p>
        </Reveal>
      </div>
    </section>
  );
}
