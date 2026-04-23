"use client";

import { cn } from "@/lib/utils";

type CTA = {
  label: string;
  href: string;
  hint: string;
  primary?: boolean;
  external?: boolean;
};

const ctas: CTA[] = [
  {
    label: "see the live demo",
    hint: "/demo",
    href: "/demo",
    primary: true,
  },
  {
    label: "view a sealed ticket",
    hint: "/r/042",
    href: "/r/042",
  },
  {
    label: "read the source",
    hint: "github.com/kairon-protocol/core",
    href: "https://github.com/kairon-protocol/core",
    external: true,
  },
];

export function CTABlock() {
  return (
    <section className="relative px-6 md:px-14 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="reveal-on-scroll mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-4">
          <span>try it</span>
          <span className="flex-1 h-px bg-border" />
          <span className="text-muted">three doors, one protocol</span>
        </div>

        <div className="stagger border-y border-border">
          {ctas.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              className={cn(
                "reveal-child group flex items-center gap-6 md:gap-8 py-7 md:py-8",
                "border-b border-border last:border-b-0",
                "focus:outline-none focus-visible:bg-paper-2/40"
              )}
            >
              <span
                className={cn(
                  "font-serif leading-tight transition-colors",
                  c.primary
                    ? "text-3xl md:text-4xl text-ink group-hover:text-seal"
                    : "text-2xl md:text-[1.85rem] text-ink-dim group-hover:text-ink"
                )}
              >
                {c.label}
              </span>
              <span className="flex-1 relative h-px" aria-hidden>
                <span className="absolute inset-0 bg-border" />
                <span className="absolute inset-0 bg-seal origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-[320ms] ease-out motion-reduce:transition-none" />
              </span>
              <span className="hidden md:inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-muted whitespace-nowrap">
                {c.hint}
              </span>
              <span
                className={cn(
                  "font-mono text-lg leading-none shrink-0 transition-all",
                  c.primary
                    ? "text-seal group-hover:translate-x-1"
                    : "text-muted group-hover:text-ink group-hover:translate-x-0.5"
                )}
              >
                {c.external ? "↗" : "→"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
