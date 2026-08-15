import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * `scripts/validate-data.mjs` is the gate on every content pull request, and it
 * reads TypeScript source with regular expressions — exactly the kind of code
 * that stops matching when someone reformats a data file and fails open. These
 * run the real script against fixture catalogs and read its exit code.
 */

const root = fileURLToPath(new URL("..", import.meta.url));
const script = "scripts/validate-data.mjs";

function validate(dir: string): { code: number; output: string } {
  try {
    const output = execFileSync("node", [script, `--dir=${dir}`], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, output };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { code: failure.status, output: `${failure.stdout}${failure.stderr}` };
  }
}

describe("validate-data", () => {
  it("passes a well-formed catalog", () => {
    const { code, output } = validate("tests/fixtures/valid-catalog");
    expect(output).toContain("no problems");
    expect(code).toBe(0);
  });

  it("passes the catalog this site actually ships", () => {
    const { code } = validate("src/data/departments");
    expect(code).toBe(0);
  });

  it("finds every planted mistake and exits non-zero", () => {
    const { code, output } = validate("tests/fixtures/broken-catalog");

    expect(code).toBe(1);
    expect(output).toContain('type "notes" is not valid');
    expect(output).toContain("a note has an empty title");
    expect(output).toContain("must start with http:// or https://");
    expect(output).toContain("points at Google Drive's home page");
    expect(output).toContain("not imported in index.ts");
    expect(output).toContain("year 9 is out of range");
    expect(output).toContain("semester 12340 is out of range");
  });

  it("reports the file each problem is in", () => {
    const { output } = validate("tests/fixtures/broken-catalog");
    expect(output).toContain("tests/fixtures/broken-catalog/broken.ts");
    expect(output).toContain("tests/fixtures/broken-catalog/unregistered.ts");
  });
});
