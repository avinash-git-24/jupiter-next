import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Starting Playwright automated demo recording...');
  const outputDir = path.resolve('public/demo-raw');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log('Navigating to live terminal...');
  await page.goto('https://jupiter-next-amber.vercel.app/', { waitUntil: 'networkidle' });
  await sleep(3000);

  // 1. Trending Ticker interaction
  console.log('Interacting with Trending Ticker...');
  try {
    const jupPill = page.locator('button:has-text("JUP")').first();
    if (await jupPill.isVisible()) {
      await jupPill.hover();
      await sleep(500);
      await jupPill.click();
      await sleep(2000);
    }

    const wifPill = page.locator('button:has-text("WIF")').first();
    if (await wifPill.isVisible()) {
      await wifPill.hover();
      await sleep(500);
      await wifPill.click();
      await sleep(2000);
    }

    const solPill = page.locator('button:has-text("SOL")').first();
    if (await solPill.isVisible()) {
      await solPill.hover();
      await sleep(500);
      await solPill.click();
      await sleep(2000);
    }
  } catch (e) {
    console.log('Ticker error ignored:', e.message);
  }

  // 2. Chart timeframes
  console.log('Switching Chart Timeframes...');
  try {
    const btn1h = page.locator('button:has-text("1h")').first();
    if (await btn1h.isVisible()) {
      await btn1h.click();
      await sleep(1500);
    }
    const btn15m = page.locator('button:has-text("15m")').first();
    if (await btn15m.isVisible()) {
      await btn15m.click();
      await sleep(1500);
    }
  } catch (e) {
    console.log('Chart timeframe error ignored:', e.message);
  }

  // 3. Swap preset chips
  console.log('Testing Swap preset chips...');
  try {
    const chip50 = page.locator('button:has-text("50%")').first();
    if (await chip50.isVisible()) {
      await chip50.click();
      await sleep(1500);
    }
    const chipMax = page.locator('button:has-text("Max")').first();
    if (await chipMax.isVisible()) {
      await chipMax.click();
      await sleep(1500);
    }
  } catch (e) {
    console.log('Chip error ignored:', e.message);
  }

  // 4. Open Route Visualizer Drawer
  console.log('Opening Route Visualizer Drawer...');
  try {
    const routeBtn = page.locator('button:has-text("Route: 3 hops")').first();
    if (await routeBtn.isVisible()) {
      await routeBtn.hover();
      await sleep(500);
      await routeBtn.click();
      await sleep(3000);

      await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'smooth' }));
      await sleep(2500);
      await page.evaluate(() => window.scrollBy({ top: -220, behavior: 'smooth' }));
      await sleep(1500);
    }
  } catch (e) {
    console.log('Route drawer error ignored:', e.message);
  }

  // 5. Order Book Click to Fill Limit Order
  console.log('Clicking Order Book Price...');
  try {
    const bidRow = page.locator('span.text-emerald-400.font-semibold').first();
    if (await bidRow.isVisible()) {
      await bidRow.hover();
      await sleep(500);
      await bidRow.click();
      await sleep(2500);
    }

    const offsetChip = page.locator('button:has-text("-5%")').first();
    if (await offsetChip.isVisible()) {
      await offsetChip.click();
      await sleep(1500);
    }
  } catch (e) {
    console.log('Order book error ignored:', e.message);
  }

  // 6. Test DCA View
  console.log('Navigating to DCA View...');
  try {
    const dcaBtn = page.locator('button:has-text("DCA")').first();
    if (await dcaBtn.isVisible()) {
      await dcaBtn.click();
      await sleep(2000);
      const everyDay = page.locator('button:has-text("Every Day")').first();
      if (await everyDay.isVisible()) {
        await everyDay.click();
        await sleep(1500);
      }
    }
  } catch (e) {
    console.log('DCA error ignored:', e.message);
  }

  // 7. Open Token Selector Modal
  console.log('Opening Token Selector Modal...');
  try {
    await page.keyboard.press('/');
    await sleep(1500);

    const searchInput = page.locator('input[placeholder*="Search by name"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.type('BONK', { delay: 120 });
      await sleep(2000);
      await page.keyboard.press('Escape');
      await sleep(1500);
    }
  } catch (e) {
    console.log('Token modal error ignored:', e.message);
  }

  // 8. Open UX Case Study Deck
  console.log('Opening UX Case Study Deck...');
  try {
    const deckBtn = page.locator('button:has-text("UX Case Study Deck")').first();
    if (await deckBtn.isVisible()) {
      await deckBtn.click();
      await sleep(3000);

      const tab2 = page.locator('button:has-text("2. Before vs After")').first();
      if (await tab2.isVisible()) {
        await tab2.click();
        await sleep(3000);
      }

      const tab3 = page.locator('button:has-text("3. Judging Rubric")').first();
      if (await tab3.isVisible()) {
        await tab3.click();
        await sleep(3000);
      }

      const tab4 = page.locator('button:has-text("4. Prototype")').first();
      if (await tab4.isVisible()) {
        await tab4.click();
        await sleep(3000);
      }

      await page.keyboard.press('Escape');
      await sleep(1500);
    }
  } catch (e) {
    console.log('Case study error ignored:', e.message);
  }

  // 9. Switch to Mobile Viewport
  console.log('Testing Mobile iPhone Frame mode...');
  try {
    const mobBtn = page.locator('button:has-text("Mob")').first();
    if (await mobBtn.isVisible()) {
      await mobBtn.click();
      await sleep(3000);

      const deskBtn = page.locator('button:has-text("Desk")').first();
      if (await deskBtn.isVisible()) {
        await deskBtn.click();
        await sleep(2500);
      }
    }
  } catch (e) {
    console.log('Mobile frame error ignored:', e.message);
  }

  console.log('Demo walkthrough completed. Finalizing video recording...');
  await sleep(2000);

  await context.close();
  await browser.close();

  // Find and move recorded video
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm'));
  if (files.length > 0) {
    const rawPath = path.join(outputDir, files[0]);
    const finalPath = path.resolve('public/jupiter-next-demo.webm');
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    fs.renameSync(rawPath, finalPath);
    fs.rmSync(outputDir, { recursive: true, force: true });
    const stat = fs.statSync(finalPath);
    console.log(`SUCCESS: Video saved to public/jupiter-next-demo.webm (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.error('No video file found in output directory.');
  }
}

run().catch((err) => {
  console.error('Fatal error during recording:', err);
  process.exit(1);
});
