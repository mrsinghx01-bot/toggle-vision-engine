/** Low-opacity technical backdrop: grid, coordinate markers, faint traces. */
export function TechBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="tech-grid absolute inset-0 opacity-70" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.14]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bg-trace" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-50 120 H320 V300 H700 V180 H1200"
          fill="none"
          stroke="url(#bg-trace)"
          strokeWidth="1"
        />
        <path
          d="M-50 640 H240 V520 H620 V700 H1400"
          fill="none"
          stroke="url(#bg-trace)"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="label-mono absolute bottom-4 left-4 hidden md:block">x: 0.000 / y: 0.000</div>
      <div className="label-mono absolute right-4 bottom-4 hidden md:block">layer · top cu</div>
    </div>
  );
}
