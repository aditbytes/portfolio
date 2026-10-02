// Generic CDP screencast recorder. Usage: node rec.mjs <name> <script.mjs> [dpr]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
const [name, scriptPath, dprArg, wArg, hArg, rateArg] = process.argv.slice(2);
const RATE = Number(rateArg || 0.25);
const dpr = Number(dprArg || 1), W = Number(wArg || 1920), H = Number(hArg || 1080);
const dir = `rec/${name}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ args: ['--disable-gpu-vsync', '--hide-scrollbars'] });
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr });
await ctx.addInitScript((RATE) => {
  const pn = performance.now.bind(performance), t0 = pn();
  performance.now = () => t0 + (pn() - t0) * RATE;
  const dn = Date.now, d0 = dn(); Date.now = () => d0 + (dn() - d0) * RATE;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((t) => cb(t0 + (t - t0) * RATE));
  const st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
  window.setTimeout = (f, ms, ...a) => st(f, (ms || 0) / RATE, ...a);
  window.setInterval = (f, ms, ...a) => si(f, (ms || 0) / RATE, ...a);
}, RATE);
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: RATE });
page.on('load', () => cdp.send('Animation.setPlaybackRate', { playbackRate: RATE }).catch(()=>{}));
const frames = []; const mouseLog = []; let recT0 = null;
let recording = false, n = 0;
cdp.on('Page.screencastFrame', async (f) => {
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  if (!recording) return;
  const file = `${dir}/f${String(n++).padStart(5, '0')}.jpg`;
  fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
  frames.push({ file, t: f.metadata.timestamp });
});
const api = {
  page, cdp,
  async start() { recT0 = Date.now(); await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W * dpr, maxHeight: H * dpr, everyNthFrame: 1 }); recording = true; },
  async stop() { recording = false; await cdp.send('Page.stopScreencast'); },
  wait: (ms) => sleep(ms / RATE), RATE,
  // eased smooth scroll driven by rAF inside the page
  async scrollTo(y, ms) { await page.evaluate(([y, ms]) => new Promise(r => { const y0 = scrollY, t0 = performance.now(); const e = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; const step = () => { const now = performance.now(); const k = Math.min(1, (now - t0) / ms); window.scrollTo({ top: y0 + (y - y0) * e(k), behavior: 'instant' }); k < 1 ? requestAnimationFrame(step) : r(); }; requestAnimationFrame(step); }), [y, ms]); },
  async click(x, y) { if (recT0) mouseLog.push({ t: Date.now() / 1000, x, y, click: true }); await page.mouse.click(x, y); },
  async yOf(sel, offset = 0) { return page.evaluate(([sel, offset]) => { const e = document.querySelector(sel); return Math.round(e.getBoundingClientRect().top + scrollY - offset); }, [sel, offset]); },
  async boxOf(sel) { return page.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, sel); },
  // eased mouse glide
  async glide(x0, y0, x1, y1, ms, steps) { steps = steps || Math.round(ms / 16); for (let i = 1; i <= steps; i++) { const t = i / steps, e = t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; const mx = x0 + (x1 - x0) * e, my = y0 + (y1 - y0) * e; await page.mouse.move(mx, my); if (recT0) mouseLog.push({ t: Date.now() / 1000, x: mx, y: my }); await sleep(ms / steps / RATE); } },
};
const mod = await import(new URL(scriptPath, import.meta.url));
await mod.default(api);
fs.writeFileSync(`${dir}/frames.json`, JSON.stringify({ rate: RATE, frames, mouse: mouseLog, W, H, dpr }));
const dur = frames.length ? frames.at(-1).t - frames[0].t : 0;
console.log(name, 'frames', frames.length, 'videoDur', (dur*RATE).toFixed(2), 'effFps', (frames.length / dur / RATE).toFixed(1));
await b.close();
