import { useScrollProgress } from "@/hooks/use-reveal";

/** Cinematic: one board becomes a device, becomes a system, becomes many. */
export function Future() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const grow = Math.min(1, progress / 0.35);
  const many = Math.min(1, Math.max(0, (progress - 0.4) / 0.35));
  const text = Math.min(1, Math.max(0, (progress - 0.55) / 0.3));

  return (
    <section ref={ref} className="relative z-10 min-h-[260svh]">
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => {
            const spread = many;
            const angle = (i / 9) * Math.PI * 2;
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 border border-primary/40"
                style={{
                  width: `${8 + grow * 12}vmin`,
                  height: `${6 + grow * 8}vmin`,
                  background: "oklch(0.24 0.05 158 / 0.5)",
                  transform: `translate(-50%, -50%) translate(${
                    Math.cos(angle) * spread * 38
                  }vmin, ${Math.sin(angle) * spread * 26}vmin) rotate(${
                    (i - 4) * spread * 8
                  }deg) scale(${i === 0 ? 1 : 0.4 + spread * 0.5})`,
                  opacity: i === 0 ? grow : spread * 0.8,
                  transition: "opacity 300ms linear",
                }}
              >
                <div className="tech-grid-fine h-full w-full opacity-60" />
              </div>
            );
          })}
          <div className="absolute inset-0 bg-background/55" />
        </div>

        <div
          className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10"
          style={{ opacity: 0.25 + text * 0.75 }}
        >
          <p className="label-mono">09 — The Future</p>
          <h2 className="display-lg mt-5 max-w-[22ch]">WHAT IF ANYONE COULD BUILD HARDWARE?</h2>
          <p className="mt-8 max-w-[52ch] text-muted-foreground">
            From students and makers to engineers and startups, Toggle&apos;s long-term vision is to
            make sophisticated hardware creation more accessible without removing the engineering
            behind it.
          </p>
          <p
            className="mt-12 font-display text-2xl tracking-tight text-primary md:text-4xl"
            style={{ opacity: text }}
          >
            THE NEXT GREAT DEVICE COULD START WITH A SENTENCE.
          </p>
        </div>
      </div>
    </section>
  );
}
