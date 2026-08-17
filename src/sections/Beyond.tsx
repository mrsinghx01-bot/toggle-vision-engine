import { horizon } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

/** "Not just a PCB tool" — long-term horizon, clearly framed as ambition. */
export function Beyond() {
  return (
    <section className="relative z-10 border-y border-border/70 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">08 — Long Term</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display-lg mt-4 max-w-[20ch]">
            PCB DESIGN IS ONLY THE <span className="text-primary">BEGINNING.</span>
          </h2>
        </Reveal>
        <Reveal delay={110}>
          <p className="label-mono mt-6">Directional ambitions — not current capabilities.</p>
        </Reveal>

        <ol className="mt-16 grid gap-x-10 gap-y-px md:grid-cols-2">
          {horizon.map((h, i) => (
            <Reveal key={h.when} delay={i * 70}>
              <li className="group flex items-baseline gap-6 border-t border-border py-6">
                <span className="label-mono w-24 shrink-0 group-hover:text-primary">{h.when}</span>
                <span className="font-display text-lg tracking-tight md:text-2xl">{h.what}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
