import type { Metadata } from "next";
import { DemoDashboard } from "@/components/demo-dashboard";
import { SEED_TICKETS, LANDING_TICKET_042 } from "@/lib/tickets";

export const metadata: Metadata = {
  title: "Kairon — demo · dashboard",
  description: "Four panels. One protocol. Live sessions, ticket inbox, Monad ledger, shareable reports.",
};

export default function DemoPage() {
  return (
    <DemoDashboard
      tickets={SEED_TICKETS}
      reportTicket={LANDING_TICKET_042}
    />
  );
}
