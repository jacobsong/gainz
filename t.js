const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.roguefitness.com/rogue-calibrated-lb-steel-plates');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();