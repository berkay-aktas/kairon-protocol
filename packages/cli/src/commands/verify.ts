import { c } from "../io/colors.js";
import { loadTicket } from "../core/ticket.js";
import { parseCriteria } from "../core/criteria.js";
import { runCriteria } from "../core/runner.js";

export interface VerifyOptions {
  id: string;
}

export async function verifyCommand(opts: VerifyOptions): Promise<void> {
  const ticket = loadTicket(opts.id);
  const criteria = parseCriteria(ticket.body);

  console.log("");
  console.log(
    `  ${c.dim("ticket")}  ${c.bold(ticket.frontmatter.id)} — ${ticket.frontmatter.title}`,
  );

  if (criteria.length === 0) {
    console.log("");
    console.log(c.fail("  no criteria found — add a ## Criteria section"));
    process.exit(1);
  }

  console.log(`  ${c.dim("running")} ${criteria.length} criteria...`);
  console.log("");

  const results = runCriteria(criteria);
  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? c.pass("✓") : c.fail("✗");
    const time = c.dim(`${(r.duration_ms / 1000).toFixed(1)}s`);
    console.log(
      `    ${icon} ${r.shell} ${c.dim(`— exit ${r.actual_exit},`)} ${time}`,
    );
    if (!r.passed && r.stdout_tail) {
      for (const l of r.stdout_tail.split("\n")) {
        console.log(c.dim(`      ${l}`));
      }
    }
    if (!r.passed) allPassed = false;
  }

  console.log("");
  if (allPassed) {
    console.log(`  ${c.pass("all criteria passed")}`);
  } else {
    console.log(`  ${c.fail("verify failed")}`);
    process.exit(1);
  }
}
