"""Level-shape the score, mix in the SFX and master to -15 LUFS (true peak stays below -1.5 dBFS after AAC). Writes mix.wav."""
import re, subprocess
import numpy as np
from scipy.io import wavfile

sr, x = wavfile.read('music.wav'); x = x.astype(float) / 32768
t = np.arange(len(x)) / sr
# lift the intro/build and breakdown so the groove isn't an 11 dB jump
db = np.interp(t, [0, 9, 10, 32, 33, 44, 46, 119, 121, 137, 138, 152], [7, 7, 6, 6, 5, 4, 0, 0, 4.5, 4.5, 4, 4])
y = np.tanh(x * (10 ** (db / 20))[:, None] * 1.05) / 1.05
y /= np.abs(y).max() / 0.89
wavfile.write('music_shaped.wav', sr, (y * 32767).astype(np.int16))

ff = lambda *a: subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)
ff('-i', 'music_shaped.wav', '-i', 'sfx.wav', '-filter_complex',
   '[0:a]volume=0.85[m];[1:a]volume=0.7[s];[m][s]amix=inputs=2:normalize=0,atrim=0:150,afade=t=out:st=147:d=3',
   '-ar', '48000', '-c:a', 'pcm_f32le', 'premix.wav')
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'premix.wav', '-af', 'ebur128=framelog=quiet', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1])
TARGET = -15.0
ff('-i', 'premix.wav', '-af', f'volume={TARGET - I:.2f}dB,alimiter=limit=0.79:attack=5:release=80:level=disabled', '-ar', '48000', '-c:a', 'pcm_s16le', 'mix.wav')
print(f'premix {I} LUFS → gain {TARGET - I:.2f} dB → mix.wav')
