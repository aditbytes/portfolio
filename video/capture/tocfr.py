# Convert a recorded frame dir to a CFR 30fps mp4 using effective (slowed) timestamps,
# and export the mouse path (video time, normalized coords) for cursor overlays.
import json, sys, subprocess, os
from PIL import Image
name = sys.argv[1]; fps = 30
d = f'rec/{name}'; meta = json.load(open(f'{d}/frames.json'))
rate, fr = meta['rate'], meta['frames']
t0 = fr[0]['t']; ts = [(f['t'] - t0) * rate for f in fr]
total = ts[-1]; n = int(total * fps)
lines = []; j = 0
for i in range(n):
    t = i / fps
    while j + 1 < len(ts) and ts[j + 1] <= t: j += 1
    lines.append(f"file '{os.path.basename(fr[j]['file'])}'\nduration {1/fps:.6f}")
open(f'{d}/list.txt', 'w').write('\n'.join(lines) + '\n')
OUT = '../remotion/public/clips'
os.makedirs(OUT, exist_ok=True)
fw, fh = Image.open(fr[0]['file']).size
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{d}/list.txt', '-r', str(fps), '-fps_mode', 'cfr',
                '-vf', 'scale=1920:1080:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p',
                f'{OUT}/{name}.mp4'], check=True)
W, H = meta['W'], meta['H']
mouse = [{'t': (m['t'] - t0) * rate, 'x': m['x'] / W, 'y': m['y'] / H, **({'click': True} if m.get('click') else {})} for m in meta.get('mouse', [])]
json.dump({'frames': n, 'mouse': mouse}, open(f'{OUT}/{name}.json', 'w'))
print(name, f'{n} frames, {total:.2f}s, src {fw}x{fh}, mouse pts {len(mouse)}')
