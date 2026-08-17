import { nav, site, socials } from "@/lib/site";

export function Footer() {
  const available = socials.filter((s) => s.url);
  return (
    <footer className="relative z-10 border-t border-border/70 px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-display text-sm tracking-[0.36em]">TOGGLE</div>
          <p className="label-mono mt-3">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="label-mono hover:text-foreground">
              {n.label}
            </a>
          ))}
          <a href="#join" className="label-mono hover:text-foreground">
            Contact
          </a>
        </nav>

        {available.length > 0 && (
          <div className="flex gap-6">
            {available.map((s) => (
              <a
                key={s.label}
                href={s.url as string}
                className="label-mono hover:text-foreground"
                rel="noreferrer noopener"
                target="_blank"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto mt-10 max-w-[1600px] border-t border-border/60 pt-6">
        <p className="label-mono">© 2026 Toggle. All rights reserved.</p>
      </div>
    </footer>
  );
}
