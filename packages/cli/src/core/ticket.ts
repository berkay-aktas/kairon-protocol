import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";

export interface TicketFrontmatter {
  id: string;
  title: string;
  status: "open" | "sealed";
  created: string;
  sealed?: string;
  agent?: string;
  commit?: string;
  attestation_hash?: string;
  onchain?: string;
}

export interface Ticket {
  frontmatter: TicketFrontmatter;
  body: string;
  path: string;
}

export function getTicketsDir(cwd: string = process.cwd()): string {
  return path.join(cwd, "kairon", "tickets");
}

export function getTicketPath(id: string, cwd: string = process.cwd()): string {
  return path.join(getTicketsDir(cwd), `${id}.md`);
}

function asString(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return String(v ?? "");
}

function asOptionalString(v: unknown): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export function loadTicket(id: string, cwd: string = process.cwd()): Ticket {
  const p = getTicketPath(id, cwd);
  if (!fs.existsSync(p)) {
    throw new Error(`ticket not found: ${id} (${p})`);
  }
  const raw = fs.readFileSync(p, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const frontmatter: TicketFrontmatter = {
    id: asString(data.id),
    title: asString(data.title),
    status: (data.status as "open" | "sealed") ?? "open",
    created: asString(data.created),
    sealed: asOptionalString(data.sealed),
    agent: asOptionalString(data.agent),
    commit: asOptionalString(data.commit),
    attestation_hash: asOptionalString(data.attestation_hash),
    onchain: asOptionalString(data.onchain),
  };
  return { frontmatter, body: parsed.content, path: p };
}

export function saveTicket(ticket: Ticket): void {
  const fm = { ...ticket.frontmatter } as Record<string, unknown>;
  for (const k of Object.keys(fm)) {
    if (fm[k] === undefined) delete fm[k];
  }
  const out = matter.stringify(ticket.body, fm);
  fs.writeFileSync(ticket.path, out);
}

export function listTickets(cwd: string = process.cwd()): Ticket[] {
  const dir = getTicketsDir(cwd);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => loadTicket(f.slice(0, -3), cwd));
}

export function nextTicketId(cwd: string = process.cwd()): string {
  const tickets = listTickets(cwd);
  const ids = tickets
    .map((t) => parseInt(t.frontmatter.id, 10))
    .filter((n) => !isNaN(n));
  const max = ids.length > 0 ? Math.max(...ids) : 0;
  return String(max + 1).padStart(3, "0");
}

export function createTicket(params: {
  id: string;
  title: string;
  context?: string;
  criteria: Array<{ shell: string; expect_exit: number }>;
  agent?: string;
  cwd?: string;
}): Ticket {
  const cwd = params.cwd ?? process.cwd();
  fs.mkdirSync(getTicketsDir(cwd), { recursive: true });

  const frontmatter: TicketFrontmatter = {
    id: params.id,
    title: params.title,
    status: "open",
    created: new Date().toISOString(),
    agent: params.agent ?? "claude-opus-4.7",
  };

  const criteriaLines =
    params.criteria.length > 0
      ? params.criteria
          .map((c) => `- shell: ${c.shell}\n  expect_exit: ${c.expect_exit}`)
          .join("\n")
      : "(add criteria here)";

  const body = `
## Context
${params.context ?? "(add context here)"}

## Criteria
${criteriaLines}
`;

  const ticket: Ticket = {
    frontmatter,
    body,
    path: getTicketPath(params.id, cwd),
  };
  saveTicket(ticket);
  return ticket;
}
