import { useState } from "react";
import { pcbComponents } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

type View = "pcb" | "schematic";
type Layer = "top" | "bottom" | "silk";

/** Interactive PCB visualization: rotate, hover parts, toggle layers and views. */
export function PcbViewer() {
  const [view, setView] = useState<View>("pcb");
  const [layer, setLayer] = useState<Layer>("top");
  const [hover, setHover] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 14, y: -12 });

  const active = pcbComponents.find((c) => c.id === hover) ?? null;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: 14 - ((e.clientY - r.top) / r.height - 0.5) * 18,
      y: -12 + ((e.clientX - r.left) / r.width - 0.5) * 26,
    });
  };

  const traceColor =
    layer === "bottom" ? "var(--color-copper)" : layer === "silk" ? "var(--color-solder)" : "var(--color-primary)";

  return (
    <section className="relative z-10 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">05 — Visualization</p>
        </Reveal>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal delay={60}>
            <h2 className="display-lg max-w-[20ch]">INSPECT THE BOARD.</h2>
          </Reveal>
          <Reveal delay={120} className="flex flex-wrap gap-2">
            {(["pcb", "schematic"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`border px-4 py-2 font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors ${
                  view === v ? "border-primary/70 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {v === "pcb" ? "PCB view" : "Schematic view"}
              </button>
            ))}
            {(["top", "bottom", "silk"] as Layer[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayer(l)}
                aria-pressed={layer === l}
                disabled={view === "schematic"}
                className={`border px-4 py-2 font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors disabled:opacity-30 ${
                  layer === l && view === "pcb"
                    ? "border-primary/70 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {l} layer
              </button>
            ))}
          </Reveal>
        </div>

        <div className="mt-10 grid gap-px border border-border bg-border lg:grid-cols-[1.6fr_1fr]">
          <div
            className="relative bg-background p-4 md:p-8"
            style={{ perspective: "1400px" }}
            onPointerMove={onMove}
            onPointerLeave={() => setTilt({ x: 14, y: -12 })}
            data-cursor="cross"
          >
            <div
              className="relative aspect-[4/3] w-full"
              style={{
                transform:
                  view === "pcb"
                    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : "rotateX(0deg) rotateY(0deg)",
                transformStyle: "preserve-3d",
                transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div
                className="absolute inset-0 border"
                style={{
                  borderColor: "oklch(0.82 0.19 148 / 0.5)",
                  background:
                    view === "pcb"
                      ? "linear-gradient(140deg, oklch(0.25 0.05 158 / 0.9), oklch(0.18 0.03 160 / 0.9))"
                      : "transparent",
                }}
              />
              <div className="tech-grid-fine absolute inset-0 opacity-50" aria-hidden="true" />

              <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {pcbComponents.slice(1).map((c, i) => {
                  const a = pcbComponents[0]!;
                  const mid = a.x + (c.x - a.x) * (0.4 + (i % 3) * 0.12);
                  return (
                    <path
                      key={c.id}
                      d={`M${a.x} ${a.y * 0.75} H${mid} V${c.y * 0.75} H${c.x}`}
                      fill="none"
                      stroke={traceColor}
                      strokeWidth={hover === c.id ? 1.4 : view === "schematic" ? 0.35 : 0.8}
                      opacity={hover && hover !== c.id ? 0.2 : 0.75}
                      style={{ transition: "all 260ms" }}
                    />
                  );
                })}
                {view === "pcb" &&
                  Array.from({ length: 26 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={(i * 37) % 96 + 2}
                      cy={((i * 23) % 70) + 3}
                      r="0.6"
                      fill="var(--color-solder)"
                      opacity="0.5"
                    />
                  ))}
              </svg>

              {pcbComponents.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onPointerEnter={() => setHover(c.id)}
                  onFocus={() => setHover(c.id)}
                  onPointerLeave={() => setHover(null)}
                  onBlur={() => setHover(null)}
                  aria-label={`${c.id} — ${c.name}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 border transition-all duration-200"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    width: `${c.w}%`,
                    height: `${c.h}%`,
                    borderColor:
                      hover === c.id ? "var(--color-primary)" : "oklch(0.86 0.02 160 / 0.35)",
                    background:
                      view === "schematic"
                        ? "transparent"
                        : c.kind === "connector"
                          ? "oklch(0.5 0.008 160)"
                          : c.kind === "antenna"
                            ? "oklch(0.74 0.13 62 / 0.35)"
                            : "oklch(0.26 0.008 160)",
                    boxShadow:
                      hover === c.id
                        ? "var(--glow-primary)"
                        : view === "pcb"
                          ? "0 8px 18px -12px oklch(0 0 0 / 0.9)"
                          : "none",
                    transform: `translate(-50%, -50%) translateZ(${
                      view === "pcb" ? (c.kind === "ic" ? 18 : 8) : 0
                    }px)`,
                  }}
                >
                  <span className="label-mono absolute top-0.5 left-1 text-[0.5rem] tracking-[0.1em]">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="label-mono mt-4">
              {view === "pcb" ? `pcb · ${layer} layer` : "schematic · nets"} · move pointer to
              rotate · hover a component
            </p>
          </div>

          <aside className="bg-card p-6 md:p-8">
            <p className="label-mono">component</p>
            {active ? (
              <div className="mt-4">
                <h3 className="font-display text-3xl tracking-tight text-primary">{active.id}</h3>
                <p className="mt-1 text-sm">{active.name}</p>
                <ul className="mt-6 space-y-2">
                  {active.spec.map((s) => (
                    <li key={s} className="flex gap-3 font-mono text-xs text-muted-foreground">
                      <span className="h-px w-4 translate-y-2 bg-primary/70" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="font-display text-2xl tracking-tight">Environmental monitor</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A representative reference board used purely for visualization. Hover any
                  component to read its role in the design.
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-2">
                  {pcbComponents.map((c) => (
                    <li key={c.id} className="label-mono">
                      {c.id} · {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
