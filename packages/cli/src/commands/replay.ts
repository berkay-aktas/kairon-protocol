import { c } from "../io/colors.js";
import { loadTicket } from "../core/ticket.js";
import { parseCriteria } from "../core/criteria.js";
import { runCriteria } from "../core/runner.js";
import { hashOutcome } from "../core/hash.js";

export interface ReplayOptions {
  id: string;
}

export async function replayCommand(opts: ReplayOptions): Promise<void> {
  const ticket = loadTicket(opts.id);
  if (ticket.frontmatter.status !== "sealed") {
    console.log("");
    console.log(
      `  ${c.fail(`ticket ${ticket.frontmatter.id} is not sealed — nothing to replay`)}`,
    );
    process.exit(1);
  }

  const criteria = parseCriteria(ticket.body);

  console.log("");
  console.log(
    `  ${c.dim("replay")}  ${c.bold(ticket.frontmatter.id)} — ${ticket.frontmatter.title}`,
  );
  console.log(`  ${c.dim("running")} ${criteria.length} criteria...`);
  console.log("");

  const results = runCriteria(criteria);
  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? c.pass("✓") : c.fail("✗");
    console.log(`    ${icon} ${r.shell} ${c.dim(`— exit ${r.actual_exit}`)}`);
    if (!r.passed) allPassed = false;
  }

  const outcome = {
    id: ticket.frontmatter.id,
    title: ticket.frontmatter.title,
    agent: ticket.frontmatter.agent ?? "",
    commit: ticket.frontmatter.commit ?? "",
    sealedAt: ticket.frontmatter.sealed ?? "",
    criteria: results.map((r) => ({
      shell: r.shell,
      expect_exit: r.expect_exit,
      actual_exit: r.actual_exit,
      passed: r.passed,
    })),
  };
  const currentHash = hashOutcome(outcome);
  const sealedHash = ticket.frontmatter.attestation_hash ?? "";

  console.log("");
  console.log(`  ${c.dim("sealed hash")}  ${c.hash(sealedHash || "(missing)")}`);
  console.log(`  ${c.dim("replay hash")}  ${c.hash(currentHash)}`);
  console.log("");

  if (allPassed && sealedHash === currentHash) {
    console.log(`  ${c.pass("replay matches sealed attestation")}`);
  } else if (allPassed) {
    console.log(`  ${c.fail("replay passed but hash differs from sealed attestation")}`);
    console.log(
      c.dim("  (criteria pass/exit values diverged since seal — inspect the diff)"),
    );
    process.exit(1);
  } else {
    console.log(`  ${c.fail("replay criteria failed")}`);
    process.exit(1);
  }
}
