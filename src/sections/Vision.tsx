import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/use-reveal";

export function Vision() {
  const { ref, inView } = useReveal(0.3);

  return (
    <section
      id="vision"
      ref={ref}
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden py-32"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 600"
        className="absolute inset-0 h-full w-full opacity-25"
        preserveAspectRatio="xMidYMid slice"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M-40 ${60 + i * 96} H${180 + i * 90} V${140 + i * 70} H${520 + i * 100} V${
              40 + i * 96
            } H1240`}
            fill="none"
            stroke={i % 2 ? "var(--color-copper)" : "var(--color-primary)"}
            strokeWidth="1"
            pathLength={1}
            className={inView ? "trace-draw" : undefined}
            style={{ animationDelay: `${i * 180}ms`, animationDuration: "2600ms" }}
          />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">02 — The Vision</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display-lg mt-6 max-w-[26ch]">
            WE BELIEVE HARDWARE SHOULD BE AS EASY TO CREATE AS{" "}
            <span className="text-primary">SOFTWARE.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-16">
          <Reveal delay={160}>
            <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
              The tools used to build modern software have become dramatically more intelligent.
              Hardware creation still depends on fragmented workflows, specialized knowledge, and
              repetitive engineering tasks.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="max-w-[46ch] font-display text-2xl leading-snug md:text-3xl">
              Toggle is exploring a different future.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
