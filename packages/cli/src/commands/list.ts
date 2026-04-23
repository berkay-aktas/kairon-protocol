import { c } from "../io/colors.js";
import { listTickets } from "../core/ticket.js";

export interface ListOptions {
  status?: string;
}

export async function listCommand(opts: ListOptions): Promise<void> {
  let tickets = listTickets();
  if (opts.status) {
    tickets = tickets.filter((t) => t.frontmatter.status === opts.status);
  }

  if (tickets.length === 0) {
    console.log("");
    console.log(c.dim("  no tickets"));
    return;
  }

  const sealed = tickets.filter((t) => t.frontmatter.status === "sealed").length;
  const open = tickets.filter((t) => t.frontmatter.status === "open").length;

  console.log("");
  console.log(
    `  ${c.dim(`${tickets.length} tickets — ${sealed} sealed, ${open} open`)}`,
  );
  console.log("");
  const sorted = [...tickets].sort((a, b) =>
    a.frontmatter.id.localeCompare(b.frontmatter.id),
  );
  for (const t of sorted) {
    const label =
      t.frontmatter.status === "sealed" ? c.seal("sealed") : c.dim("open  ");
    console.log(`    ${label}  ${c.bold(t.frontmatter.id)}  ${t.frontmatter.title}`);
  }
  console.log("");
}
