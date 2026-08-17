import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoOn, setLogoOn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-border/70 bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10"
      >
        <a
          href="#top"
          onMouseEnter={() => setLogoOn(true)}
          onMouseLeave={() => setLogoOn(false)}
          className="group flex items-baseline gap-2 font-display text-sm font-medium tracking-[0.36em]"
        >
          TOGGLE
          <span className="font-mono text-[0.65rem] text-primary transition-transform duration-300 group-hover:translate-x-0.5">
            {logoOn ? "1" : "0"}
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="label-mono transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#join"
            className="hidden items-center gap-2 border border-border px-4 py-2 font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-all hover:border-primary/70 hover:text-primary md:inline-flex"
            style={{ boxShadow: "none" }}
          >
            Join the Journey <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-border md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col justify-between bg-background px-6 py-10 md:hidden">
          <ul className="flex flex-col gap-6">
            {nav.map((n, i) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 font-display text-3xl tracking-tight"
                >
                  <span className="label-mono">0{i + 1}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#join"
            onClick={() => setOpen(false)}
            className="mt-10 inline-flex items-center justify-center gap-2 border border-primary/60 px-5 py-4 font-mono text-xs tracking-[0.18em] text-primary uppercase"
          >
            Join the Journey <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </header>
  );
}
