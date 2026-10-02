export default async ({ page, start, stop, wait, scrollTo, yOf, glide }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(800);
  const y = await yOf('.stack__grid', 220);
  await page.evaluate((y) => window.scrollTo({ top: y - 500, behavior: 'instant' }), y); await wait(800);
  await page.mouse.move(1750, 950);
  await start(); await wait(300); await scrollTo(y, 2200); await wait(500);
  await glide(1750, 950, 1150, 300, 1200); await glide(1150, 300, 800, 650, 1500); await wait(1500); await stop();
};
