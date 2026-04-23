"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "00 · intro" },
  { id: "problem", label: "01 · what’s broken" },
  { id: "ticket", label: "02 · ticket-042" },
  { id: "architecture", label: "03 · architecture" },
  { id: "spec", label: "04 · spec" },
];

export function SectionDots() {
  const pathname = usePathname();
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (pathname !== "/") return;
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <nav
      aria-label="sections"
      className="fixed left-4 md:left-7 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-5"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            aria-label={s.label}
            className="group block p-1.5 -m-1.5"
          >
            <span
              className={cn(
                "relative block w-[9px] h-[9px] rounded-full border transition-all duration-500 ease-out",
                isActive
                  ? "border-seal bg-seal scale-110"
                  : "border-border-strong bg-transparent group-hover:border-ink"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-seal animate-ping opacity-40" />
              )}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
