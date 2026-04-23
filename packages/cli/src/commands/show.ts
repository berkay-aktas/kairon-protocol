import { c } from "../io/colors.js";
import { loadTicket } from "../core/ticket.js";

export interface ShowOptions {
  id: string;
}

export async function showCommand(opts: ShowOptions): Promise<void> {
  const ticket = loadTicket(opts.id);
  const fm = ticket.frontmatter;

  console.log("");
  console.log(`  ${c.dim("ticket  ")} ${c.bold(fm.id)}`);
  console.log(`  ${c.dim("title   ")} ${fm.title}`);
  console.log(
    `  ${c.dim("status  ")} ${fm.status === "sealed" ? c.seal("sealed") : c.dim("open")}`,
  );
  console.log(`  ${c.dim("created ")} ${fm.created}`);
  if (fm.sealed) console.log(`  ${c.dim("sealed  ")} ${fm.sealed}`);
  if (fm.agent) console.log(`  ${c.dim("agent   ")} ${fm.agent}`);
  if (fm.commit) console.log(`  ${c.dim("commit  ")} ${fm.commit}`);
  if (fm.attestation_hash)
    console.log(`  ${c.dim("hash    ")} ${c.hash(fm.attestation_hash)}`);
  if (fm.onchain) console.log(`  ${c.dim("onchain ")} ${fm.onchain}`);
  console.log("");
  console.log(ticket.body.trim());
  console.log("");
}
