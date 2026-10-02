export default async ({ page, start, stop, wait, scrollTo, yOf }) => {
  await page.goto('about:blank'); await page.mouse.move(1750, 1000); await start(); await wait(200);
  await page.goto('http://localhost:4173/work/market-regime-detection', { waitUntil: 'domcontentloaded' }); await wait(2600);
  const y = await yOf('main [class*=vframe], main figure, main [class*=visual]', 120);
  await scrollTo(y, 2400); await wait(5200); await stop();
};
