export default async ({ page, start, stop, wait, glide }) => {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await wait(2500);
  await page.mouse.move(1500, 860);
  await start(); await wait(700);
  await page.keyboard.press('Control+k'); await wait(1000);
  for (const c of 'whoami') { await page.keyboard.type(c); await wait(140); }
  await wait(400); await page.keyboard.press('Enter'); await wait(3200); await stop();
};
