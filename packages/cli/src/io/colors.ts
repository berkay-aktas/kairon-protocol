import pc from "picocolors";

export const c = {
  seal: (s: string) => pc.bold(pc.yellow(s)),
  pass: (s: string) => pc.green(s),
  fail: (s: string) => pc.red(s),
  dim: (s: string) => pc.dim(s),
  bold: (s: string) => pc.bold(s),
  hash: (s: string) => pc.cyan(s),
};
