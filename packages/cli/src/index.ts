#!/usr/bin/env node
import { Command } from "commander";
import { loadEnv } from "./core/env.js";

loadEnv();

const program = new Command();

program
  .name("kairon")
  .description("Attestation protocol for AI agent work")
  .version("0.1.0");

program
  .command("open <title>")
  .description("Open a new ticket and suggest criteria")
  .option("--agent <name>", "agent identifier")
  .option("-y, --yes", "accept suggested criteria without prompt")
  .action(async (title: string, options: { agent?: string; yes?: boolean }) => {
    const { openCommand } = await import("./commands/open.js");
    await openCommand({ title, agent: options.agent, yes: !!options.yes });
  });

program
  .command("verify <id>")
  .description("Run the ticket's criteria and report pass/fail")
  .action(async (id: string) => {
    const { verifyCommand } = await import("./commands/verify.js");
    await verifyCommand({ id });
  });

program
  .command("seal <id>")
  .description("Verify, hash, commit, and optionally attest onchain")
  .option("--onchain", "attest hash onchain via KAIRON_CONTRACT_ADDRESS")
  .option("--no-commit", "skip git commit (demos and dry-runs)")
  .option("--agent <name>", "agent identifier")
  .action(
    async (
      id: string,
      options: { onchain?: boolean; commit?: boolean; agent?: string },
    ) => {
      const { sealCommand } = await import("./commands/seal.js");
      await sealCommand({
        id,
        onchain: !!options.onchain,
        commit: options.commit !== false,
        agent: options.agent,
      });
    },
  );

program
  .command("verify-onchain <id>")
  .description("Read the Sealed event from Monad and compare it to the ticket's local hash")
  .option("--rehash", "re-run criteria and recompute the hash before comparing")
  .action(async (id: string, options: { rehash?: boolean }) => {
    const { verifyOnchainCommand } = await import("./commands/verify-onchain.js");
    await verifyOnchainCommand({ id, rehash: !!options.rehash });
  });

program
  .command("replay <id>")
  .description("Re-run a sealed ticket's criteria and compare the hash")
  .action(async (id: string) => {
    const { replayCommand } = await import("./commands/replay.js");
    await replayCommand({ id });
  });

program
  .command("list")
  .description("List tickets in kairon/tickets/")
  .option("--status <state>", "filter by status: open | sealed")
  .action(async (options: { status?: string }) => {
    const { listCommand } = await import("./commands/list.js");
    await listCommand({ status: options.status });
  });

program
  .command("show <id>")
  .description("Show a ticket's frontmatter and body")
  .action(async (id: string) => {
    const { showCommand } = await import("./commands/show.js");
    await showCommand({ id });
  });

await program.parseAsync(process.argv);
