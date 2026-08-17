import { capabilities } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

export function Why() {
  return (
    <section className="relative z-10 border-y border-border/70 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">06 — Why Toggle</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display-lg mt-4 max-w-[24ch]">FOUR THINGS WE ARE BUILDING AROUND.</h2>
        </Reveal>

        <dl className="mt-16 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((c, i) => (
            <Reveal
              key={c.index}
              delay={i * 90}
              className="group bg-background p-8 transition-colors hover:bg-card"
            >
              <span className="label-mono">{c.index}</span>
              <dt className="mt-6 font-display text-2xl tracking-tight uppercase">{c.title}</dt>
              <dd className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.body}</dd>
              <div className="mt-8 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full" />
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
