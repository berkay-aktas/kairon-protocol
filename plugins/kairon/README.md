# kairon plugin

Claude Code skill that routes sealed-ticket requests to the `kairon` CLI.

## Install

Project-scoped (the skill loads for this project only):

```bash
cp -r .claude-plugin/ <your-project>/
```

Global (the skill loads for every project):

```bash
cp -r .claude-plugin/ ~/.claude/
```

## Requires

The `kairon` CLI must be on `$PATH`. Install via npm once published:

```bash
pnpm install -g @kairon/cli
# or
npm install -g @kairon/cli
```

Or link a local checkout:

```bash
pnpm --filter @kairon/cli build
pnpm --filter @kairon/cli link --global
```

## Verify

From a directory with the skill installed:

```bash
claude --plugins .
> seal this: test
```

Claude should recognize the phrase, invoke the skill, and propose running `kairon open "test"`. If it doesn't, check that the skill frontmatter loaded — run `/plugins` inside Claude Code and look for `kairon` in the list.
