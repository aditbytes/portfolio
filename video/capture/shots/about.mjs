export default async ({ page, start, stop, wait, scrollTo, yOf }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(800);
  const y = await yOf('#about', 0);
  await page.evaluate((y) => window.scrollTo({ top: y - 700, behavior: 'instant' }), y); await wait(800);
  await page.mouse.move(1700, 900);
  await start(); await wait(300); await scrollTo(y + 60, 2600); await wait(4200); await stop();
};
