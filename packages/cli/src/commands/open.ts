import { c } from "../io/colors.js";
import { confirm } from "../io/prompt.js";
import { suggestCriteria } from "../core/suggest.js";
import { createTicket, nextTicketId } from "../core/ticket.js";

export interface OpenOptions {
  title: string;
  agent?: string;
  yes?: boolean;
}

export async function openCommand(opts: OpenOptions): Promise<void> {
  const id = nextTicketId();
  const suggestions = suggestCriteria();

  console.log("");
  console.log(`  ${c.dim("ticket")}  ${c.bold(id)}`);
  console.log(`  ${c.dim("title")}   ${opts.title}`);
  console.log("");

  if (suggestions.length === 0) {
    console.log(c.dim("  No criteria fingerprints detected in this directory."));
    const ticket = createTicket({
      id,
      title: opts.title,
      criteria: [],
      agent: opts.agent,
    });
    console.log(`  ${c.pass("opened")} ${c.dim(ticket.path)}`);
    console.log(c.dim("  Edit the ticket's ## Criteria section before running verify."));
    return;
  }

  console.log(c.dim("  suggested criteria:"));
  for (const s of suggestions) {
    console.log(`    ${c.dim("-")} ${s.shell}`);
  }
  console.log("");

  const accept = opts.yes || (await confirm("  Accept these criteria?"));
  if (!accept) {
    console.log(c.dim("  Aborted. No ticket created."));
    return;
  }

  const ticket = createTicket({
    id,
    title: opts.title,
    criteria: suggestions,
    agent: opts.agent,
  });

  console.log("");
  console.log(`  ${c.pass("opened")} ticket ${c.bold(id)} ${c.dim(ticket.path)}`);
}
