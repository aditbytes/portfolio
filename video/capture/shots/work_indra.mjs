export default async ({ page, start, stop, wait, scrollTo, yOf, glide }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(800);
  const yw = await yOf('#work', 40);
  await page.evaluate((y) => window.scrollTo({ top: y - 400, behavior: 'instant' }), yw); await wait(800);
  await page.mouse.move(1750, 950);
  await start(); await wait(300); await scrollTo(yw, 1800); await wait(1200);
  const yi = await yOf('#work article', 90);
  await scrollTo(yi, 2200); await wait(800);
  const yv = await yOf('#work article .vframe, #work article [class*=visual], #work article figure', 80);
  await scrollTo(yv, 2000); await wait(7000); await stop();
};
