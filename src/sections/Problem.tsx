import { problemChain } from "@/lib/site";
import { useScrollProgress } from "@/hooks/use-reveal";
import { Reveal } from "@/components/Reveal";

/** The traditional hardware process, growing into a tangled network as you scroll. */
export function Problem() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const visible = Math.round(progress * (problemChain.length + 2));

  const nodes = problemChain.map((label, i) => {
    const angle = (i / problemChain.length) * Math.PI * 2;
    const radius = 34 + (i % 3) * 5;
    return {
      label,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.72,
    };
  });

  return (
    <section id="problem" ref={ref} className="relative z-10 min-h-[240svh]">
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 md:grid-cols-2 md:items-center md:px-10">
          <div>
            <p className="label-mono">01 — The Problem</p>
            <h2 className="display-lg mt-5 max-w-[18ch]">
              HARDWARE IS STILL TOO HARD TO BUILD.
            </h2>
            <p className="mt-6 max-w-[42ch] text-muted-foreground">
              Every board still travels the same long road: fragmented tools, specialist
              knowledge, and dozens of repetitive engineering decisions between an idea and a
              working prototype.
            </p>
            <div
              className={`mt-10 transition-all duration-700 ${
                progress > 0.82 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <p className="font-display text-2xl text-primary md:text-4xl">
                WHAT IF IT DIDN&apos;T HAVE TO BE?
              </p>
            </div>
          </div>

          <div className="relative aspect-square w-full">
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
              {nodes.map((n, i) =>
                nodes.slice(i + 1).map((m, j) => {
                  const idx = i + j;
                  const on = idx < visible * 1.4;
                  const near = Math.abs(i - (i + j + 1)) <= 2;
                  if (!near && (i + j) % 3 !== 0) return null;
                  return (
                    <path
                      key={`${i}-${j}`}
                      d={`M${n.x} ${n.y} L${n.x} ${m.y} L${m.x} ${m.y}`}
                      fill="none"
                      stroke={near ? "var(--color-primary)" : "var(--color-copper)"}
                      strokeWidth="0.28"
                      opacity={on ? (near ? 0.65 : 0.28) : 0}
                      style={{ transition: "opacity 700ms ease" }}
                    />
                  );
                }),
              )}
              {nodes.map((n, i) => (
                <g
                  key={n.label}
                  opacity={i < visible ? 1 : 0.12}
                  style={{ transition: "opacity 600ms ease" }}
                >
                  <circle cx={n.x} cy={n.y} r="1.5" fill="var(--color-primary)" />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="3.4"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="0.2"
                    opacity="0.4"
                  />
                </g>
              ))}
            </svg>
            <ul className="pointer-events-none absolute inset-0">
              {nodes.map((n, i) => (
                <li
                  key={n.label}
                  className="label-mono absolute -translate-x-1/2 whitespace-nowrap"
                  style={{
                    left: `${n.x}%`,
                    top: `${n.y + 5}%`,
                    opacity: i < visible ? 0.85 : 0.15,
                    transition: "opacity 600ms ease",
                  }}
                >
                  {n.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Reveal className="sr-only">
        <p>
          Traditional flow: {problemChain.join(" → ")}. Toggle is exploring a shorter path.
        </p>
      </Reveal>
    </section>
  );
}
