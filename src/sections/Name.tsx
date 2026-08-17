import { useEffect, useState } from "react";
import { usePrefersReducedMotion, useReveal } from "@/hooks/use-reveal";

const STATES = ["0", "1", "OFF", "ON", "LOW", "HIGH", "FALSE", "TRUE"];

/** Logic states collapsing into the wordmark. */
export function Name() {
  const { ref, inView } = useReveal(0.4);
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCollapsed(true);
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      if (n >= STATES.length) {
        window.clearInterval(id);
        setCollapsed(true);
        return;
      }
      setI(n);
    }, 320);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[90svh] flex-col items-center justify-center px-5 text-center"
    >
      <div className="relative flex h-[22vh] items-center justify-center">
        {!collapsed ? (
          <span key={i} className="display-xl text-primary/90">
            {STATES[i]}
          </span>
        ) : (
          <h2 className="display-xl text-glow">TOGGLE</h2>
        )}
      </div>
      <div
        className={`max-w-[46ch] transition-all duration-1000 ${
          collapsed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <p className="font-display text-xl md:text-2xl">
          Every intelligent system begins with a decision.
        </p>
        <p className="mt-4 text-sm text-muted-foreground md:text-base">
          We&apos;re building the tools to make those decisions easier to turn into hardware.
        </p>
      </div>
    </section>
  );
}
