import { chromium } from "playwright";
import * as fs from "node:fs";

const OUT = "/tmp/kairon-atomic";
const VIEWPORT = { width: 1440, height: 900 };

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

async function shot(name, url, { waitMs = 1500, prep } = {}) {
  await page.goto(url, { waitUntil: "networkidle" });
  if (prep) await prep();
  await page.waitForTimeout(waitMs);
  const path = `${OUT}/${name}`;
  await page.screenshot({ path });
  console.log("shot:", path);
}

await shot("1-landing-hero.png", "http://localhost:3000/");
await shot("2-r-042-default.png", "http://localhost:3000/r/042");
await shot("3-demo-dashboard.png", "http://localhost:3000/demo");

// /r/042 with onchain tab selected (if such a tab exists)
try {
  await shot("4-r-042-onchain.png", "http://localhost:3000/r/042", {
    prep: async () => {
      const tab = page
        .locator('button:has-text("onchain"), [role="tab"]:has-text("onchain")')
        .first();
      if (await tab.count()) {
        await tab.click({ timeout: 3000 });
      }
    },
  });
} catch (err) {
  console.log("onchain tab click failed:", err.message);
}

// /demo with Monad Ledger tab selected (if such a tab exists)
try {
  await shot("5-demo-ledger.png", "http://localhost:3000/demo", {
    prep: async () => {
      const tab = page
        .locator('button:has-text("ledger"), button:has-text("Ledger"), [role="tab"]:has-text("ledger")')
        .first();
      if (await tab.count()) {
        await tab.click({ timeout: 3000 });
      }
    },
  });
} catch (err) {
  console.log("ledger tab click failed:", err.message);
}

await browser.close();
console.log("\nall shots saved to", OUT);
