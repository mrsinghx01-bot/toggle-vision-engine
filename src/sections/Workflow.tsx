import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { workflowSteps } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { usePrefersReducedMotion, useReveal } from "@/hooks/use-reveal";

const PROMPT =
  "Build me a compact environmental monitoring device with temperature and humidity sensing, Wi-Fi connectivity, USB-C power and a rechargeable battery.";

/** Simulated AI design run — a conceptual prototype of the Toggle workflow. */
export function Workflow() {
  const { ref, inView } = useReveal(0.25);
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(-1);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduced) {
      setTyped(PROMPT);
      setStep(workflowSteps.length - 1);
      return;
    }
    let i = 0;
    const type = window.setInterval(() => {
      i += 2;
      setTyped(PROMPT.slice(0, i));
      if (i >= PROMPT.length) {
        window.clearInterval(type);
        setStep(0);
      }
    }, 22);
    return () => window.clearInterval(type);
  }, [inView, reduced]);

  useEffect(() => {
    if (step < 0 || step >= workflowSteps.length - 1 || reduced) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 1500);
    return () => window.clearTimeout(t);
  }, [step, reduced]);

  const active = step >= 0 ? workflowSteps[Math.min(step, workflowSteps.length - 1)]! : null;

  return (
    <section id="how-it-works" ref={ref} className="relative z-10 py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-mono">03 — The Demonstration</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display-lg mt-5 max-w-[22ch]">TELL TOGGLE WHAT YOU WANT TO BUILD.</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="label-mono mt-5">
            Conceptual prototype · illustrative sequence, not a live design engine
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-[1.1fr_1fr]">
          {/* Prompt + step list */}
          <div className="bg-card p-6 md:p-10">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary signal-blink" />
              <span className="label-mono">toggle · design session</span>
            </div>
            <p className="mt-6 border-l border-primary/60 pl-5 font-mono text-sm leading-relaxed md:text-base">
              {typed}
              {typed.length < PROMPT.length && (
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary" />
              )}
            </p>

            <ol className="mt-10 space-y-3">
              {workflowSteps.map((s, i) => {
                const state = step > i ? "done" : step === i ? "active" : "idle";
                return (
                  <li
                    key={s.id}
                    className={`flex items-center gap-4 border border-transparent px-3 py-3 transition-all duration-500 ${
                      state === "active"
                        ? "border-primary/50 bg-primary/5"
                        : state === "done"
                          ? "opacity-70"
                          : "opacity-35"
                    }`}
                  >
                    <span className="label-mono w-6">0{s.id}</span>
                    <span className="flex-1 font-mono text-xs tracking-[0.14em] uppercase">
                      {s.title}
                    </span>
                    {state === "done" && <Check className="h-3.5 w-3.5 text-primary" />}
                    {state === "active" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary signal-blink" />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Live output panel */}
          <div className="relative min-h-[420px] overflow-hidden bg-background p-6 md:p-10">
            <div className="tech-grid-fine absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative">
              <p className="label-mono">output</p>
              <h3 className="mt-4 font-display text-2xl tracking-tight md:text-3xl">
                {active ? active.title.toUpperCase() : "AWAITING INPUT"}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {active ? active.detail : "Describe a device to begin the run."}
              </p>

              <ul className="mt-8 space-y-2">
                {(active?.items ?? []).map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-mono text-xs text-foreground/85"
                    style={{
                      animation: reduced ? undefined : `signal-pulse 0.001ms`,
                      opacity: 1,
                      transitionDelay: `${i * 60}ms`,
                    }}
                  >
                    {step === 5 ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    ) : (
                      <span className="h-1 w-4 bg-primary/70" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>

              {step >= workflowSteps.length - 1 && (
                <p className="mt-10 font-display text-xl text-primary">
                  A design a human engineer can review, edit and own.
                </p>
              )}

              {/* schematic/pcb-ish visual state */}
              <svg
                viewBox="0 0 300 160"
                className="mt-10 w-full max-w-md opacity-90"
                aria-hidden="true"
              >
                <rect
                  x="10"
                  y="10"
                  width="280"
                  height="140"
                  fill="none"
                  stroke="var(--color-border)"
                />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={i} opacity={step >= 1 + i * 0.6 ? 1 : 0.12} style={{ transition: "opacity 600ms" }}>
                    <rect
                      x={34 + i * 42}
                      y={40 + (i % 2) * 52}
                      width="26"
                      height="18"
                      fill="var(--color-secondary)"
                      stroke="var(--color-primary)"
                      strokeWidth="0.6"
                    />
                    <path
                      d={`M${60 + i * 42} ${49 + (i % 2) * 52} H${76 + i * 42} V${
                        (i % 2) === 0 ? 101 : 49
                      } H${76 + i * 42}`}
                      fill="none"
                      stroke={step >= 4 ? "var(--color-copper)" : "var(--color-primary)"}
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
