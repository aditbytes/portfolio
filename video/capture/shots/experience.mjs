export default async ({ page, start, stop, wait, scrollTo, yOf }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(800);
  const y = await yOf('#experience', 40);
  await page.evaluate((y) => window.scrollTo({ top: y - 300, behavior: 'instant' }), y); await wait(800);
  await page.mouse.move(1750, 1000);
  await start(); await wait(200); await scrollTo(y, 1600); await wait(1200);
  const y2 = await yOf('.timeline__item:nth-of-type(3)', 200);
  await scrollTo(y2, 4200); await wait(1800); await stop();
};
