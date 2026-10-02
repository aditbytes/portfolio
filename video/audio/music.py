"""Original minimal-electronic score for the showreel. 96 BPM -> 1 bar = 2.5 s.
Sections follow the edit: intro 0-10, build 10-32.5, pulse 32.5-45, groove 45-120,
breakdown 120-137.5, resolve 137.5-150."""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 152.0
N = int(SR * DUR)
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

def lp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], 'band'); return signal.lfilter(b, a, x)

def env_points(points, n=N):
    """Piecewise-linear automation from (time, value) pairs."""
    ts, vs = zip(*points); return np.interp(np.arange(n) / SR, ts, vs)

# Progression: Dm9 | Bbmaj7 | Fmaj7/A | C(add9)/G  (2 bars each, 20 s cycle)
CHORDS = [
    [50, 57, 60, 64, 65, 69],   # D3 A3 C4 E4 F4 A4  (Dm9-ish)
    [46, 53, 57, 62, 65, 69],   # Bb2 F3 A3 D4 F4 A4 (Bbmaj7)
    [45, 53, 57, 60, 64, 67],   # A2 F3 A3 C4 E4 G4  (Fmaj7/A + 9)
    [43, 50, 55, 60, 62, 67],   # G2 D3 G3 C4 D4 G4  (C(add9)/G)
]
ROOTS = [38, 34, 33, 31]        # bass roots (D2, Bb1, A1, G1)
CHORD_LEN = 2 * BAR

def chord_at(t):
    return int(t // CHORD_LEN) % 4

# ---------------- Pad ----------------
pad = np.zeros((N, 2))
for ci in range(int(DUR // CHORD_LEN) + 1):
    t0 = ci * CHORD_LEN
    if t0 >= DUR: break
    notes = CHORDS[ci % 4]
    if t0 >= 137.5: notes = CHORDS[0]                      # resolve on Dm9
    length = CHORD_LEN + 1.6                               # overlap tails
    if t0 >= 137.5: length = DUR - t0
    n = int(length * SR); s0 = int(t0 * SR); s1 = min(N, s0 + n); n = s1 - s0
    tt = np.arange(n) / SR
    att, rel = 1.4, 1.6
    e = np.minimum(1, tt / att) * np.clip((length - tt) / rel, 0, 1)
    for k, m in enumerate(notes[1:]):
        for side, det in ((0, -0.07), (1, 0.07)):
            for d in (-1, 0, 1):
                f = midi(m + det + d * 0.05)
                ph = (f * tt + rng.random()) % 1.0
                pad[s0:s1, side] += (2 * ph - 1) * e * 0.018
pad_cut = env_points([(0, 700), (10, 1100), (45, 1900), (115, 2300), (122, 900), (137, 1300), (150, 600)])
# time-varying low-pass by processing in blocks
def dyn_lp(x, cut, block=4800):
    y = np.zeros_like(x); zi = None
    for i in range(0, len(x), block):
        fc = cut[i]
        b, a = signal.butter(2, fc / (SR / 2), 'low')
        if zi is None: zi = signal.lfilter_zi(b, a) * 0
        y[i:i + block], zi = signal.lfilter(b, a, x[i:i + block], zi=zi)
    return y
for c in range(2): pad[:, c] = dyn_lp(pad[:, c], pad_cut)
pad *= env_points([(0, 0), (3, 0.8), (10, 1.0), (150, 1.0)])[:, None]

# ---------------- Pluck arpeggio (16ths) ----------------
arp = np.zeros((N, 2))
step = BEAT / 4
pattern = [0, 2, 3, 4, 3, 2, 4, 5, 3, 2, 3, 4, 2, 3, 4, 1]
arp_level = env_points([(0, 0), (9.5, 0), (10, 0.55), (32, 0.75), (45, 0.9), (118, 0.9), (122, 0.6), (137, 0.5), (139, 0), (152, 0)])
for i in range(int(DUR / step)):
    t0 = i * step
    lvl = arp_level[min(N - 1, int(t0 * SR))]
    if lvl <= 0.01: continue
    notes = CHORDS[chord_at(t0)]
    m = notes[pattern[i % 16]] + 12
    if i % 16 in (7, 15) and rng.random() < 0.5: continue    # breathing room
    n = int(0.5 * SR); s0 = int(t0 * SR); s1 = min(N, s0 + n); n = s1 - s0
    tt = np.arange(n) / SR
    f = midi(m)
    x = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) + 0.12 * np.sin(2 * np.pi * 3 * f * tt)) * np.exp(-tt * 9)
    x *= np.minimum(1, tt / 0.003)
    vel = 0.7 + 0.3 * (i % 4 == 0)
    pan = 0.5 + 0.25 * np.sin(i * 0.7)
    arp[s0:s1, 0] += x * lvl * vel * 0.05 * (1 - pan) * 2
    arp[s0:s1, 1] += x * lvl * vel * 0.05 * pan * 2
for c in range(2): arp[:, c] = lp(arp[:, c], 3800)
# ping-pong delay (dotted 8th)
d = int(BEAT * 0.75 * SR)
dl = np.zeros_like(arp)
fb = 0.38
for k in range(1, 6):
    g = fb ** k
    src = arp[:, (k + 1) % 2] if k % 2 else arp[:, k % 2]
    dl[k * d:, k % 2] += src[:N - k * d] * g
arp = arp + lp(dl.T, 2500).T * 0.8

# ---------------- Drums ----------------
kick = np.zeros(N); hats = np.zeros(N); duck = np.ones(N)
kick_on = lambda t: (32.5 <= t < 120) or (122.5 <= t < 0)  # kick from 32.5, out at breakdown
for i in range(int(DUR / BEAT)):
    t0 = i * BEAT
    if not kick_on(t0): continue
    if t0 < 45 and i % 2: continue                          # half-time pulse before the groove
    n = int(0.45 * SR); s0 = int(t0 * SR); s1 = min(N, s0 + n); n = s1 - s0
    tt = np.arange(n) / SR
    fenv = 45 + 75 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(fenv) / SR
    x = np.sin(ph) * np.exp(-tt * 7.5) + 0.15 * rng.standard_normal(n) * np.exp(-tt * 120)
    kick[s0:s1] += x * 0.42
    dk = 1 - 0.35 * np.exp(-tt * 8)
    duck[s0:s1] = np.minimum(duck[s0:s1], dk)
for i in range(int(DUR / (BEAT / 2))):
    t0 = i * BEAT / 2
    if not (45 <= t0 < 120): continue
    t0 += 0.018 if i % 2 else 0                             # slight swing
    n = int(0.08 * SR); s0 = int(t0 * SR); s1 = min(N, s0 + n); n = s1 - s0
    tt = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-tt * (55 if i % 2 else 80))
    hats[s0:s1] += x * (0.05 if i % 2 else 0.032)
hats = hp(hats, 7000)
# soft clap/rim on 2 & 4 in the groove
rim = np.zeros(N)
for i in range(int(DUR / BEAT)):
    t0 = i * BEAT
    if not (65 <= t0 < 118) or i % 2 == 0: continue
    n = int(0.2 * SR); s0 = int(t0 * SR); s1 = min(N, s0 + n); n = s1 - s0
    tt = np.arange(n) / SR
    rim[s0:s1] += bp(rng.standard_normal(n), 900, 2600) * np.exp(-tt * 22) * 0.06
# ---------------- Bass ----------------
bass = np.zeros(N)
for i in range(int(DUR / (BEAT / 2))):
    t0 = i * BEAT / 2
    if not (32.5 <= t0 < 120): continue
    if t0 < 45 and i % 4: continue
    n = int(BEAT / 2 * 0.95 * SR); s0 = int(t0 * SR); s1 = min(N, s0 + n); n = s1 - s0
    tt = np.arange(n) / SR
    f = midi(ROOTS[chord_at(t0)] + (12 if i % 4 == 3 else 0))
    x = np.tanh(1.6 * np.sin(2 * np.pi * f * tt)) * np.minimum(1, tt / 0.01) * np.exp(-tt * 3)
    bass[s0:s1] += x * 0.11
bass = lp(bass, 600)
# low sustained sub in breakdown + resolve
sub = np.zeros(N)
for t0, root, length in [(120, 38, 10), (130, 34, 7.5), (137.5, 38, 14.5)]:
    s0 = int(t0 * SR); n = int(length * SR); s1 = min(N, s0 + n); n = s1 - s0; tt = np.arange(n) / SR
    sub[s0:s1] += np.sin(2 * np.pi * midi(root) * tt) * np.minimum(1, tt / 1.5) * np.clip((length - tt) / 2, 0, 1) * 0.06

# ---------------- Texture: airy noise bed + resolve bell ----------------
air = bp(rng.standard_normal(N), 3000, 9000) * 0.006 * env_points([(0, 0.5), (10, 1), (120, 1.2), (137, 0.6), (150, 0)])
bell = np.zeros(N)
for t0, m in [(137.5, 81), (138.75, 76), (140.0, 77), (141.25, 72)]:
    s0 = int(t0 * SR); n = int(6 * SR); s1 = min(N, s0 + n); n = s1 - s0; tt = np.arange(n) / SR
    f = midi(m)
    x = np.sin(2 * np.pi * f * tt + 1.2 * np.exp(-tt * 3) * np.sin(2 * np.pi * f * 3.5 * tt)) * np.exp(-tt * 1.1)
    bell[s0:s1] += x * 0.05

# ---------------- Mix ----------------
mix = np.zeros((N, 2))
mix += pad * duck[:, None]
mix += arp * duck[:, None]
for c in range(2):
    mix[:, c] += kick + hats * (0.8 if c else 1.0) + rim + bass * duck + sub + air + bell
# reverb (stereo noise IR, 2.8 s)
irn = int(2.8 * SR); ti = np.arange(irn) / SR
ir = rng.standard_normal((irn, 2)) * np.exp(-ti * 2.4)[:, None]
ir = np.stack([lp(ir[:, c], 5000) for c in range(2)], 1); ir /= np.abs(ir).sum(0) ** 0.5 * 30
send = (pad * 0.6 + arp * 0.9) + np.stack([bell, bell], 1) * 0.8
wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:N] for c in range(2)], 1)
mix += wet * 0.55
for c in range(2): mix[:, c] = hp(mix[:, c], 28)
# master fade in / out
mix *= env_points([(0, 0), (0.6, 1), (147.5, 1), (151.5, 0)])[:, None]
mix = np.tanh(mix * 1.2) / 1.2
mix /= np.abs(mix).max() / 0.89
wavfile.write('music.wav', SR, (mix * 32767).astype(np.int16))
print('ok', mix.shape)
