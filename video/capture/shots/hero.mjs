export default async ({ page, start, stop, wait, glide }) => {
  await page.goto('about:blank'); await start(); await wait(300);
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await wait(2500);
  await glide(1500, 900, 1180, 640, 1600);
  await glide(1180, 640, 900, 560, 1400);
  await wait(1200); await stop();
};
