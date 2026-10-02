export default async ({ page, start, stop, wait, scrollTo, glide }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(800);
  const y = await page.evaluate(() => { const e = [...document.querySelectorAll('#work article')][3]; return e.getBoundingClientRect().top + scrollY - 90; });
  await page.evaluate((y) => window.scrollTo({ top: y - 450, behavior: 'instant' }), y); await wait(800);
  await page.mouse.move(1750, 950);
  await start(); await wait(300); await scrollTo(y, 2000); await wait(1800); await scrollTo(y + 300, 1800); await wait(4500); await stop();
};
