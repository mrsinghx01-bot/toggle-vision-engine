import { useScrollProgress } from "@/hooks/use-reveal";

/** Scroll-driven schematic → PCB transformation: the signature moment. */
export function Transform() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  // phases: symbols appear → nets connect → rearrange → compress → route → 3D
  const p = progress;
  const symbols = Math.min(1, p / 0.18);
  const nets = Math.min(1, Math.max(0, (p - 0.16) / 0.16));
  const morph = Math.min(1, Math.max(0, (p - 0.34) / 0.22));
  const routing = Math.min(1, Math.max(0, (p - 0.56) / 0.18));
  const rise = Math.min(1, Math.max(0, (p - 0.74) / 0.26));

  const parts = [
    { id: "U1", sx: 30, sy: 30, px: 46, py: 48, w: 22, h: 16 },
    { id: "U2", sx: 70, sy: 22, px: 74, py: 30, w: 14, h: 11 },
    { id: "U3", sx: 30, sy: 62, px: 24, py: 62, w: 15, h: 12 },
    { id: "J1", sx: 12, sy: 44, px: 10, py: 46, w: 9, h: 16 },
    { id: "C1", sx: 52, sy: 74, px: 60, py: 72, w: 6, h: 5 },
    { id: "R3", sx: 84, sy: 58, px: 84, py: 60, w: 6, h: 5 },
  ];

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return (
    <section ref={ref} className="relative z-10 min-h-[320svh]">
      <div className="sticky top-0 flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
          <p className="label-mono">04 — Transformation</p>
          <h2 className="display-lg mt-4">
            FROM LOGIC TO <span className="text-primary">LAYOUT.</span>
          </h2>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            {["Schematic", "Nets", "Placement", "Routing", "Board"].map((label, i) => (
              <span
                key={label}
                className="label-mono"
                style={{ color: p > i * 0.2 ? "var(--color-primary)" : undefined }}
              >
                {label}
              </span>
            ))}
          </div>

          <div
            className="relative mt-10 aspect-[16/9] w-full max-w-[1100px] border border-border"
            style={{
              perspective: "1200px",
            }}
          >
            <div
              className="tech-grid-fine absolute inset-0"
              style={{ opacity: 0.5 - morph * 0.25 }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0"
              style={{
                transform: `rotateX(${rise * 46}deg) rotateZ(${rise * -12}deg) scale(${
                  1 - rise * 0.08
                })`,
                transformStyle: "preserve-3d",
                transition: "transform 120ms linear",
              }}
            >
              {/* board substrate appears as we morph */}
              <div
                className="absolute inset-[6%] border border-primary/50"
                style={{
                  opacity: morph,
                  background: `oklch(0.24 0.05 158 / ${morph * 0.55})`,
                }}
              />

              <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {/* nets / traces */}
                {parts.slice(1).map((part, i) => {
                  const a = parts[0]!;
                  const ax = lerp(a.sx, a.px, morph);
                  const ay = lerp(a.sy, a.py, morph) * 0.56;
                  const bx = lerp(part.sx, part.px, morph);
                  const by = lerp(part.sy, part.py, morph) * 0.56;
                  const mid = ax + (bx - ax) * 0.5;
                  return (
                    <path
                      key={part.id}
                      d={`M${ax} ${ay} H${mid} V${by} H${bx}`}
                      fill="none"
                      stroke={routing > 0.2 ? "var(--color-copper)" : "var(--color-primary)"}
                      strokeWidth={routing > 0.2 ? 0.9 : 0.35}
                      opacity={Math.min(1, nets * 1.2) * (0.4 + routing * 0.6)}
                      strokeLinejoin="miter"
                      style={{ transition: "stroke 400ms" }}
                    />
                  );
                })}
              </svg>

              {/* components */}
              {parts.map((part, i) => {
                const x = lerp(part.sx, part.px, morph);
                const y = lerp(part.sy, part.py, morph);
                const appear = Math.min(1, Math.max(0, symbols * parts.length - i));
                return (
                  <div
                    key={part.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 border border-primary/70 bg-secondary/80"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${part.w}%`,
                      height: `${part.h}%`,
                      opacity: appear,
                      transform: `translate(-50%, -50%) translateZ(${rise * (part.w > 12 ? 34 : 16)}px)`,
                      boxShadow: rise > 0.2 ? "0 12px 24px -12px oklch(0 0 0 / 0.8)" : "none",
                    }}
                  >
                    <span className="label-mono absolute top-1 left-1.5 text-[0.55rem]">
                      {part.id}
                    </span>
                  </div>
                );
              })}
            </div>

            <span className="label-mono absolute right-3 bottom-2">
              {rise > 0.5
                ? "board · assembled"
                : routing > 0.3
                  ? "routing · top cu"
                  : morph > 0.4
                    ? "placement"
                    : "schematic"}
            </span>
          </div>

          <p className="mt-8 max-w-[52ch] text-sm text-muted-foreground">
            Symbols become nets. Nets become placement. Placement becomes copper. The same design,
            expressed at every level a hardware engineer actually works in.
          </p>
        </div>
      </div>
    </section>
  );
}
