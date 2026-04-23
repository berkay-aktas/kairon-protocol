"use client";

import { motion } from "motion/react";

export function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-14 py-5 flex items-center justify-between bg-paper/70 backdrop-blur-md border-b border-border/70"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
        <span className="relative inline-flex items-center justify-center w-5 h-5 border border-seal text-seal font-serif italic text-sm leading-none">
          k
        </span>
        <span className="text-ink">kairon</span>
        <span className="text-muted">· attestation protocol</span>
      </div>
      <div className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        <a href="/#ticket" className="hover:text-ink transition-colors">ticket</a>
        <a href="/#spec" className="hover:text-ink transition-colors">spec</a>
        <a
          href="https://github.com/kairon-protocol/core"
          target="_blank"
          rel="noreferrer"
          className="text-ink hover:text-seal transition-colors flex items-center gap-2 border-b border-ink hover:border-seal pb-0.5"
        >
          github
          <span>↗</span>
        </a>
      </div>
    </motion.nav>
  );
}
