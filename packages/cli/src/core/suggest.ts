import * as fs from "node:fs";
import * as path from "node:path";

export interface Suggestion {
  shell: string;
  expect_exit: number;
}

export function suggestCriteria(cwd: string = process.cwd()): Suggestion[] {
  const out: Suggestion[] = [];

  const pkgPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
        scripts?: Record<string, string>;
      };
      if (pkg.scripts?.test) out.push({ shell: "npm test", expect_exit: 0 });
      if (pkg.scripts?.build) out.push({ shell: "npm run build", expect_exit: 0 });
    } catch {
      /* malformed package.json — skip */
    }
  }

  if (fs.existsSync(path.join(cwd, "Cargo.toml"))) {
    out.push({ shell: "cargo test", expect_exit: 0 });
  }
  if (fs.existsSync(path.join(cwd, "go.mod"))) {
    out.push({ shell: "go test ./...", expect_exit: 0 });
  }
  if (fs.existsSync(path.join(cwd, "pyproject.toml"))) {
    out.push({ shell: "pytest", expect_exit: 0 });
  }

  return out;
}
