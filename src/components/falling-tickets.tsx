"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type TicketSeed = {
  id: string;
  title: string;
  time: string;
  block: number;
};

const POOL: TicketSeed[] = [
  { id: "018", title: "rate limiter", time: "13:47", block: 18442819 },
  { id: "019", title: "checkout refactor", time: "13:51", block: 18442821 },
  { id: "023", title: "stripe webhook", time: "14:02", block: 18442841 },
  { id: "027", title: "session cleanup", time: "14:08", block: 18442863 },
  { id: "031", title: "queue retry policy", time: "14:12", block: 18442879 },
  { id: "035", title: "oauth callback fix", time: "14:15", block: 18442894 },
];

const DELAYS = [0, 2.5, 5, 7.5, 10, 12.5];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function FallingTickets() {
  const reduced = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [vh, setVh] = useState(900);

  useEffect(() => {
    setIsMounted(true);
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cards = useMemo(() => {
    return POOL.map((seed, i) => {
      const rotate = rand(-3, 3);
      const duration = rand(18, 32);
      const targetOpacity = rand(0.18, 0.32);
      const leftOffset = rand(-20, 20);
      return {
        seed,
        rotate,
        duration,
        targetOpacity,
        leftOffset,
        laneIndex: i,
        delay: DELAYS[i],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (reduced) return null;
  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {cards.map((c) => (
        <motion.div
          key={c.seed.id}
          initial={{ y: -160, opacity: 0 }}
          animate={{
            y: vh + 160,
            opacity: [0, c.targetOpacity, c.targetOpacity, 0],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.85, 1],
          }}
          style={{
            left: `calc(${c.laneIndex * 16.66}% + ${c.leftOffset}px)`,
            rotate: `${c.rotate}deg`,
            width: 240,
          }}
          className="absolute top-0 border border-border-strong bg-paper-2/60 p-3"
        >
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            <span>#{c.seed.id}</span>
            <span>{c.seed.time} UTC</span>
          </div>
          <div className="font-serif italic text-[15px] text-ink mt-1">
            {c.seed.title}
          </div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-seal mt-2">
            ✓ sealed · block {c.seed.block}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
