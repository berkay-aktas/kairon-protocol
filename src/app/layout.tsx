import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { BlockHeartbeat } from "@/components/block-heartbeat";
import { SectionDots } from "@/components/section-dots";
import { ScrollReveal } from "@/components/scroll-reveal";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kairon — attestation protocol for AI agent work",
  description:
    "When the agent's word becomes attestation. Cryptographic seal. Onchain on Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSerif.variable}`}>
      <body className="grain antialiased bg-paper text-ink">
        <SmoothScroll>{children}</SmoothScroll>
        <SectionDots />
        <BlockHeartbeat />
        <ScrollReveal />
      </body>
    </html>
  );
}
