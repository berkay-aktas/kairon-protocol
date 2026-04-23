import { c } from "../io/colors.js";
import { loadTicket, saveTicket } from "../core/ticket.js";
import { parseCriteria } from "../core/criteria.js";
import { runCriteria } from "../core/runner.js";
import { hashOutcome } from "../core/hash.js";
import { gitHeadShort, gitCommit } from "../core/git.js";
import { attestOnchain } from "../core/onchain.js";

export interface SealOptions {
  id: string;
  onchain: boolean;
  commit: boolean;
  agent?: string;
}

export async function sealCommand(opts: SealOptions): Promise<void> {
  const ticket = loadTicket(opts.id);
  const criteria = parseCriteria(ticket.body);

  console.log("");
  console.log(
    `  ${c.dim("ticket")}  ${c.bold(ticket.frontmatter.id)} — ${ticket.frontmatter.title}`,
  );

  if (criteria.length === 0) {
    console.log("");
    console.log(c.fail("  no criteria found — cannot seal"));
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
    if (!r.passed) allPassed = false;
  }

  if (!allPassed) {
    console.log("");
    console.log(`  ${c.fail("verify failed — not sealing")}`);
    process.exit(1);
  }

  const commitSha = gitHeadShort();
  const sealedAt = new Date().toISOString();
  const agent = opts.agent ?? ticket.frontmatter.agent ?? "claude-opus-4.7";

  const outcomeForHash = {
    id: ticket.frontmatter.id,
    title: ticket.frontmatter.title,
    agent,
    commit: commitSha ?? "",
    sealedAt,
    criteria: results.map((r) => ({
      shell: r.shell,
      expect_exit: r.expect_exit,
      actual_exit: r.actual_exit,
      passed: r.passed,
    })),
  };
  const attestationHash = hashOutcome(outcomeForHash);

  console.log("");
  console.log(`  ${c.dim("attestation")} ${c.hash(attestationHash)}`);

  let onchainTx: string | undefined;
  if (opts.onchain) {
    const result = await attestOnchain(attestationHash);
    if (result.success) {
      onchainTx = `monad://tx/${result.txHash}`;
      console.log(`  ${c.dim("tx         ")} ${c.hash(result.txHash)}`);
      console.log(`  ${c.dim("explorer   ")} ${c.dim(result.explorerUrl)}`);
    } else {
      console.log(
        `  ${c.dim("onchain    ")} pending ${c.dim(`(${result.reason})`)}`,
      );
    }
  }

  ticket.frontmatter.status = "sealed";
  ticket.frontmatter.sealed = sealedAt;
  ticket.frontmatter.agent = agent;
  if (commitSha) ticket.frontmatter.commit = commitSha;
  ticket.frontmatter.attestation_hash = attestationHash;
  if (onchainTx) ticket.frontmatter.onchain = onchainTx;

  const outcomeSection = `## Outcome
${results
  .map(
    (r) =>
      `- ${r.passed ? "pass" : "fail"}: ${r.shell} (exit ${r.actual_exit}, ${(r.duration_ms / 1000).toFixed(1)}s)`,
  )
  .join("\n")}

Attestation: ${attestationHash}${onchainTx ? `\nOnchain: ${onchainTx}` : ""}
`;

  if (/##\s+Outcome/.test(ticket.body)) {
    ticket.body = ticket.body.replace(/##\s+Outcome[\s\S]*$/, outcomeSection);
  } else {
    ticket.body = ticket.body.trimEnd() + "\n\n" + outcomeSection;
  }

  saveTicket(ticket);

  let committedSha: string | null = null;
  if (opts.commit) {
    committedSha = gitCommit(
      [ticket.path],
      `kairon: seal ticket #${ticket.frontmatter.id}`,
    );
  }

  console.log("");
  console.log(`  ${c.seal("[SEALED]")} ticket ${c.bold(ticket.frontmatter.id)}`);
  if (committedSha) {
    console.log(`  ${c.dim("commit    ")} ${committedSha}`);
  } else if (opts.commit) {
    console.log(c.dim("  commit     skipped (no git repo or hook failure)"));
  }
  console.log("");
}
