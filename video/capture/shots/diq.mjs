export default async ({ page, start, stop, wait, glide, click }) => {
  await page.goto('http://localhost:8501/', { waitUntil: 'networkidle' }); await wait(1500);
  await page.waitForSelector('text=Risk Level Distribution', { timeout: 60000 }); await wait(800);
  await page.mouse.move(1300, 760);
  await start(); await wait(1600);
  const r = await page.getByText('SKU Analysis', { exact: true }).boundingBox();
  const tx = r.x + 30, ty = r.y + r.height / 2;
  await glide(1300, 760, tx, ty, 1500); await wait(250); await click(tx, ty);
  await page.waitForSelector('text=Reorder Recommendation', { timeout: 60000 }); await wait(1500);
  await glide(tx, ty, 1040, 640, 1500); await glide(1040, 640, 1078, 700, 700); await wait(1500);
  const b = await page.getByRole('button', { name: /Order .* Units/ }).boundingBox();
  await glide(1078, 700, b.x + b.width / 2, b.y + b.height / 2, 1300); await wait(1500);
  await stop();
};
