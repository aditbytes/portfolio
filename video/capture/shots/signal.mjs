export default async ({ page, start, stop, wait, scrollTo, yOf, glide }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(1500);
  await page.mouse.move(1500, 700);
  await start(); await wait(600);
  const y1 = await yOf('.signal', 60);
  await scrollTo(y1, 2200); await wait(3200);
  const y2 = await yOf('.signal .keyword', 140);
  await scrollTo(y2, 2400); await wait(600);
  await glide(1500, 700, 700, 230, 900); await glide(700, 230, 700, 560, 1800); await wait(1200);
  await stop();
};
