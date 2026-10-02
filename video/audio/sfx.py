"""Synthesised UI sound design, timed to the edit (seconds)."""
import numpy as np
from scipy import signal
from scipy.io import wavfile
SR = 48000; DUR = 152.0; N = int(SR * DUR)
rng = np.random.default_rng(3)
out = np.zeros((N, 2))
def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
def lp(x, fc):
    b, a = signal.butter(2, fc / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def place(t, x, gain=1.0, pan=0.0):
    s = int(t * SR); e = min(N, s + len(x)); x = x[:e - s]
    out[s:e, 0] += x * gain * (1 - max(0, pan)); out[s:e, 1] += x * gain * (1 + min(0, pan))
def tick(f=2600):
    n = int(0.05 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 140) * 0.5 + bp(rng.standard_normal(n), 3000, 9000) * np.exp(-t * 400) * 0.4
def key():
    n = int(0.04 * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 1800, 7000) * np.exp(-t * 260) * 0.7 + np.sin(2 * np.pi * 420 * t) * np.exp(-t * 180) * 0.25
def whoosh(d=0.75, lo=250, hi=3200):
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); y = np.zeros(n); blk = 1200
    for i in range(0, n, blk):
        k = i / n; fc = lo * (hi / lo) ** (np.sin(np.pi * k) ** 1.5)
        y[i:i + blk] = bp(x[i:i + blk], fc * 0.6, min(fc * 1.6, 20000))
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return y * env * 0.9
def thump():
    n = int(0.7 * SR); t = np.arange(n) / SR
    fe = 48 + 70 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(fe) / SR
    return np.sin(ph) * np.exp(-t * 6.5) + lp(rng.standard_normal(n), 900) * np.exp(-t * 60) * 0.3
def swipe():
    n = int(0.22 * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 2000, 6000) * np.sin(np.pi * t / t[-1]) ** 2 * 0.35
def shimmer():
    n = int(1.8 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, f in enumerate([1760, 2637, 3520, 4186]):
        x += np.sin(2 * np.pi * f * t) * np.exp(-t * (2.2 + k)) * np.clip((t - k * 0.04) * 50, 0, 1)
    return x * 0.12

W = lambda t, g=0.22, **k: place(t - 0.42, whoosh(**k), g, pan=0.0)
# --- opening
place(0.05, whoosh(1.6, 150, 1800), 0.16)
place(5.93, thump(), 0.55); place(5.95, shimmer(), 0.7)
for i, t in enumerate([6.67, 6.97, 7.27]): place(t, tick(2200 + i * 300), 0.16, pan=-0.2)
# --- section changes
for t in [10.0, 17.5, 25.0, 32.5, 65.0, 85.0, 101.0, 112.5, 120.0, 130.0]: W(t)
W(45.0, 0.3, d=0.9, lo=180, hi=4200); place(45.12, thump(), 0.32)
place(47.6, thump(), 0.32)
place(137.6, whoosh(1.1, 200, 2500), 0.2)
# --- who
place(13.2, tick(), 0.18); place(14.6, tick(1900), 0.14); place(15.35, swipe(), 0.5)
for i in range(4): place(17.97 + i * 0.27, tick(2000 + i * 200), 0.12, pan=-0.3)
for i in range(4): place(19.83 + i * 1.133, swipe(), 0.55)
for i in range(3): place(26.0 + i * 0.47, tick(2400), 0.1)
# --- stack
place(33.83, whoosh(0.9, 400, 2600), 0.12)
for i in range(6): place(42.37 + i * 0.233, tick(1800 + i * 160), 0.13)
for i in range(4): place(45.73 + i * 0.2, tick(2600), 0.1)
# --- INDRA
place(52.77, tick(1800), 0.2); place(55.23, tick(2100), 0.2)
place(56.0, whoosh(0.6, 500, 3000), 0.1)
for i in range(3): place(58.5 + i * 0.2, tick(2300 + i * 200), 0.16)
place(59.24, swipe(), 0.5)
for i in range(4): place(61.17 + i * 0.2, tick(1500), 0.16)
# --- Regime
place(71.2, tick(1800), 0.2)
for i, t in enumerate([73.13, 73.73, 74.27]): place(t, tick(2000 + i * 250), 0.14)
for i in range(3): place(75.0 + i * 0.27, tick(2500), 0.12)
place(76.83, swipe(), 0.5)
place(79.33, thump(), 0.4)
place(79.8, whoosh(0.5, 600, 2500), 0.08); place(80.4, whoosh(0.5, 600, 2500), 0.08)
place(82.07, swipe(), 0.5)
# --- DemandIQ (click from the recording)
place(87.82, key() * 1.4, 0.35)
place(91.13, tick(1800), 0.2)
place(96.0, swipe(), 0.55)
for i in range(6): place(97.4 + i * 0.2, tick(2000 + i * 120), 0.1)
# --- IndiEye
place(107.53, swipe(), 0.5); place(108.13, swipe(), 0.5)
for i in range(5): place(108.4 + i * 0.2, tick(2400), 0.1)
# --- More
for i in range(4): place(112.7 + i * 0.233, tick(2000 + i * 200), 0.14)
# --- whoami: palette open + keystrokes measured from the capture
off = 130 - 8 / 30
place(off + 0.75, key(), 0.3)
for t in [1.72, 1.88, 2.02, 2.16, 2.30, 2.43]: place(off + t, key(), 0.34)
place(off + 2.97, key() * 1.3, 0.38)
# --- end
place(138.33, swipe(), 0.6)
place(141.0, thump(), 0.45); place(141.0, shimmer(), 0.6)
for i in range(4): place(141.13 + i * 0.267, tick(2100 + i * 150), 0.12)
out = np.tanh(out * 1.1)
wavfile.write('sfx.wav', SR, (out / max(1, np.abs(out).max()) * 0.9 * 32767).astype(np.int16))
print('sfx ok', np.abs(out).max())
