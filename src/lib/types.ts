export type TicketStatus = "open" | "verifying" | "sealed" | "failed";

export type OutcomeKind =
  | "head"
  | "pass"
  | "fail"
  | "meta"
  | "dim"
  | "final";

export type OutcomeLine = {
  t?: string;
  text: string;
  kind?: OutcomeKind;
};

export type CriteriaItem = {
  shell: string;
  expect_exit: number;
  timeout?: number;
  passed?: boolean;
  duration_ms?: number;
};

export type Ticket = {
  id: string;
  title: string;
  status: TicketStatus;
  agent: string;
  opened: string;
  sealed?: string;
  commit?: string;
  proofHash?: string;
  txHash?: string;
  blockNumber?: number;
  explorerUrl?: string;
  from?: string;
  to?: string;
  method?: string;
  gasUsed?: number;
  context?: string;
  criteria: CriteriaItem[];
  outcome?: {
    lines: OutcomeLine[];
  };
};

/** Raw ticket shape as written by backend to data/seed-tickets.json.
 *  We keep this loose because backend may extend it. */
export type TicketRaw = {
  id: string;
  title: string;
  agent: string;
  commit?: string;
  proof?: string;
  txHash?: string;
  block?: number | null;
  createdAt?: string;
  sealedAt?: string | null;
  status?: TicketStatus;
  explorerUrl?: string;
  from?: string;
  to?: string;
  method?: string;
  gasUsed?: number;
  context?: string;
  criteria?: CriteriaItem[];
  outcome?: { lines: OutcomeLine[] };
};
