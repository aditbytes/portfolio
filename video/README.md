# Portfolio Reel

Source for the 2:30 portfolio showreel. Storyboard, sources, captions and QC are in [`PRODUCTION_NOTES.md`](./PRODUCTION_NOTES.md).

The site build doesn't use anything here (`tsc -b` and Vite only look at the root project). The rendered MP4, the screen captures and the audio WAVs are not committed; the scripts below regenerate them.

```
video/
├── capture/            # screen recording (Playwright + CDP screencast, slowed 4× then re-timed to 30 fps CFR)
│   ├── serve.mjs       #   serves ../../dist like Vercel (clean URLs, SPA fallback)
│   ├── rec.mjs         #   recorder: node rec.mjs <name> ./shots/<name>.mjs [dpr] [w] [h] [rate]
│   ├── tocfr.py        #   frames → remotion/public/clips/<name>.mp4 + cursor path JSON
│   ├── st_start.sh     #   starts the DemandIQ Streamlit dashboard (clone Demand_IQ next to it)
│   └── shots/*.mjs     #   one script per shot (scrolls, mouse glides, clicks, typing)
├── remotion/           # the edit (React → video with Remotion)
│   └── src/            #   theme, components, scenes1/2, Main (timeline + HUD)
└── audio/
    ├── music.py        # original 96 BPM score → music.wav
    └── sfx.py          # synthesised UI sound design → sfx.wav
```

## Rebuild

Requires Node 20+, Python 3.10+ (`numpy scipy pillow streamlit plotly pandas`), ffmpeg, Chromium (Playwright).

```bash
# 1. capture
npm run build                                   # at repo root → dist/
cd video/capture && npm i playwright
node serve.mjs &                                # http://localhost:4173
git clone https://github.com/aditbytes/Demand_IQ && ./st_start.sh   # http://localhost:8501
for s in hero signal about work_indra indieye more experience palette regime; do
  node rec.mjs $s ./shots/$s.mjs 1 1920 1080 0.25 && python3 tocfr.py $s
done
node rec.mjs diq ./shots/diq.mjs 1.2 1600 900 0.25 && python3 tocfr.py diq

# 2. edit
cd ../remotion && npm i
npx remotion studio src/index.ts                # preview
npm run render                                  # → out/reel_silent.mp4

# 3. audio + mux
cd ../audio && python3 music.py && python3 sfx.py
python3 master.py                               # level-shape + mix + master → mix.wav (−15 LUFS)
ffmpeg -i ../remotion/out/reel_silent.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart aditya_portfolio_reel_1080p.mp4
```

`CLIP_FRAMES` in `remotion/src/theme.ts` must match the frame counts that `tocfr.py` prints. If you re-capture, update them, along with any camera keyframes and callout boxes that reference clip pixel positions.
