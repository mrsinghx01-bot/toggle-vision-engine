import { PcbCanvas } from "@/components/PcbCanvas";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function FinalCta() {
  const hasJoin = !site.joinUrl.startsWith("[");
  const hasEmail = !site.contactEmail.startsWith("[");

  return (
    <section id="join" className="relative z-10 flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 opacity-60">
          <PcbCanvas seed={23} spin={0.05} />
        </div>
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <h2 className="display-xl">HAVE AN IDEA?</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="display-xl text-primary text-glow">LET&apos;S BUILD IT.</p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-10 max-w-[46ch] text-muted-foreground">
            Toggle is building a new interface between human ideas and physical hardware.
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-10 flex flex-wrap gap-3">
          <a
            href={hasJoin ? site.joinUrl : "#top"}
            className="group inline-flex items-center gap-3 border border-primary/60 px-6 py-4 font-mono text-xs tracking-[0.18em] text-primary uppercase transition-all hover:bg-primary/10 hover:shadow-[var(--glow-primary)]"
          >
            Join the Journey
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
          <a
            href={hasEmail ? `mailto:${site.contactEmail}` : "#about"}
            className="inline-flex items-center gap-3 border border-border px-6 py-4 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-foreground/60"
          >
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
}
