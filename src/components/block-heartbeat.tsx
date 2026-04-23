"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { watchBlockNumber } from "@/lib/monad";

export function BlockHeartbeat() {
  const [block, setBlock] = useState(18_442_900);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    return watchBlockNumber((next) => {
      setBlock(Number(next));
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    });
  }, []);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 font-mono text-[11px] tracking-wide text-muted flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-paper/85 backdrop-blur-md border border-border-strong shadow-[0_2px_18px_-8px_rgba(26,23,19,0.15)]">
      <motion.span
        className="relative inline-flex w-1.5 h-1.5 rounded-full bg-seal"
        animate={{
          scale: pulse ? 1.8 : 1,
          opacity: pulse ? 1 : 0.55,
          boxShadow: pulse
            ? "0 0 10px rgba(138,110,62,0.9)"
            : "0 0 0 rgba(138,110,62,0)",
        }}
        transition={{ duration: 0.2 }}
      />
      <span className="text-ink-dim uppercase tracking-[0.22em]">monad</span>
      <span className="text-border-strong">·</span>
      <span className="uppercase tracking-[0.22em]">block</span>
      <div className="relative h-[14px] overflow-hidden min-w-[78px] flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={block}
            initial={{ opacity: 0, y: -8, color: "var(--color-seal)" }}
            animate={{ opacity: 1, y: 0, color: "var(--color-ink)" }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              color: { duration: 0.4, ease: "easeOut" },
            }}
            className="tabular-nums absolute"
          >
            {block.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
