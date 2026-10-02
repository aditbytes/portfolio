export default async ({ page, start, stop, wait, scrollTo }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(800);
  const ys = await page.evaluate(() => [...document.querySelectorAll('#work article')].map(e => e.getBoundingClientRect().top + scrollY - 140));
  await page.evaluate((y) => window.scrollTo({ top: y - 300, behavior: 'instant' }), ys[4]); await wait(800);
  await page.mouse.move(1750, 1000);
  await start(); await wait(200);
  for (const k of [4, 5, 6, 7]) { await scrollTo(ys[k], 1400); await wait(1700); }
  await stop();
};
