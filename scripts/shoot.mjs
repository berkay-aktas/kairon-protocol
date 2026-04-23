import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const out = "/tmp/kairon-shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});
const page = await ctx.newPage();

const url = "http://localhost:3000";
console.log("→", url);
await page.goto(url, { waitUntil: "networkidle" });

// 1) hero after animations settle
await page.waitForTimeout(3500);
await page.screenshot({ path: `${out}/01-hero.png` });
console.log("✓ 01-hero");

// 2) hero — AFTER tab
await page.locator('button[role="tab"]:has-text("with kairon")').click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/02-hero-after.png` });
console.log("✓ 02-hero-after");

// 2b) problem section
await page.evaluate(() => document.querySelector("#problem")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/02b-problem-top.png` });
await page.evaluate(() => document.querySelector("#problem")?.scrollIntoView({ behavior: "instant", block: "end" }));
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/02c-problem-bottom.png` });
console.log("✓ 02b/c problem");

// 3) ticket tab (default)
await page.evaluate(() => document.querySelector("#ticket")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${out}/03-ticket-md.png` });
console.log("✓ 03-ticket-md");

// 4) outcome.log tab
await page.locator('button:has-text("outcome.log")').click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/04-outcome.png` });
console.log("✓ 04-outcome");

// 5) proof.sha256 — hash painting
await page.locator('button:has-text("proof.sha256")').click();
await page.waitForTimeout(2400); // let hash paint finish
await page.screenshot({ path: `${out}/05-proof.png` });
console.log("✓ 05-proof");

// 6) onchain.tx — SEALED stamp
await page.locator('button:has-text("onchain.tx")').click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/06-onchain.png` });
console.log("✓ 06-onchain");

// 6b) architecture — top
await page.evaluate(() => document.querySelector("#architecture")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/06b-arch-top.png` });
await page.evaluate(() => document.querySelector("#architecture")?.scrollIntoView({ behavior: "instant", block: "end" }));
await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/06c-arch-bottom.png` });
console.log("✓ 06b/c arch");

// 7) spec footer
await page.evaluate(() => document.querySelector("#spec")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/07-spec.png` });
console.log("✓ 07-spec");

// 7) full page
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/00-fullpage.png`, fullPage: true });
console.log("✓ 00-fullpage");

await browser.close();
console.log("done");
