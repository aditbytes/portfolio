# my Aeluron Technologies — Candid Readiness Assessment

**Prepared:** 8 June 2026
**Scope:** (1) Is Aeluron / the PoC doing well? (2) How does it compare to Flux.ai? (3) Can it raise $1M on a $10M SAFE cap? (4) Can it become universal hardware-design software, PCB → semiconductor?
**Basis:** The uploaded Week 1–4 build guides, the `aeluron_llm.md` / `phys_llm.md` design specs, the `test.py` test suite, and the actual pipeline output for `LTE_GPS_Tracker` (`pipeline_log.json`, `simulation_results.json`, `spec.json`, the two report PNGs), plus current market data (cited inline in §3–§4).

> A note on tone: this is written as an internal, skeptical assessment — the kind a technical co-founder or a friendly-but-honest angel would give. It is deliberately hard on the weak points, because those are the things that will surface in due diligence whether or not this document names them. The strengths are real and stated plainly too.

---

## 0. Bottom line up front

| Question | Short answer |
|---|---|
| **Is the effort going well?** | **Yes on velocity and integration; no on depth.** A two-person team built a working end-to-end pipeline (prompt → spec → schematic → BOM → netlist → SPICE → DRC → thermal → scored report) in roughly four weeks. That is genuinely impressive. But the system only works *correctly* for a narrow, hardcoded family of LoRa-based ESP32 IoT sensor nodes. The moment a prompt leaves that family — as your own `LTE_GPS_Tracker` run did — the downstream stages silently fall back to templates and estimates that do not match the requested design. |
| **Is the PoC doing well?** | **It demos well, but the uploaded run contains three tells that the generation is partly canned** (LoRa nets inside an "LTE" design, a ₹0 / 0-parts-found BOM, and a flat 35.82 °C "thermal field"). See §2. These are fixable, but they are exactly what a technical DD reviewer will catch in ten minutes. |
| **Same or different from Flux.ai?** | **Same *category*, very different *maturity*.** Flux is the same idea ("prompt → manufacturable board") shipped to ~1.1M users on ~$49M of funding. Aeluron's *differentiator* (physics-informed simulation surrogates) is also a crowded, well-funded field (Quilter, PhysicsX, Luminary Cloud, NVIDIA). Aeluron is currently the least-proven entrant in both lanes. See §3. |
| **Can it raise $1M @ $10M cap?** | **Plausible but aggressive on the merits.** A $10M cap on a sub-$2.5M round is *structurally normal* by 2026 SAFE conventions — it is not an outlandish ask in the abstract. Whether *this* company clears it depends entirely on the demo and the founder story carrying a gap that the metrics do not yet close. Realistic outcomes: raise $1M from a thesis/India-focused believer at this cap, **or** de-risk the tech first, **or** accept a $5–8M cap. See §4. |
| **Universal PCB → semiconductor?** | **Right vision, very long ladder.** The agentic orchestration layer is genuinely domain-portable; the libraries, generators, and physics surrogates are *not* and must be rebuilt per domain. Semiconductor (custom silicon) is realistically a Series-B+/multi-year frontier and would start at the open-source sky130/OpenLane level, not advanced foundry nodes. See §5. |

---

## 1. What you have actually built — vs. what the decks describe

This is the most important framing in the whole document, because the rest depends on keeping the two apart.

**The built artifacts (real, runnable):**

- **A SWARM pipeline** that turns a natural-language prompt into a multi-stage hardware design package and a scored PDF/PNG report. The `LTE_GPS_Tracker` run completed 11 steps in ~19 s with zero pipeline errors. That orchestration is the hard, valuable part and it exists.
- **Phys-LLM v0.1** — in reality a small fully-connected coordinate-MLP PINN for the 2-D steady-state heat equation on a 100 × 80 mm board with up to three Gaussian chip sources. (Week 1 guide shows an 8-input net; `test.py` shows an 11-input net — minor version drift. Either way it is tens of thousands of parameters, trained on one consumer GPU against FEniCS data.)
- **Aeluron-LLM v0.1** — a QLoRA adapter (~8M trainable params) on Qwen2.5-1.5B, evaluated by **keyword matching** (you flag this yourself as a proxy metric).
- **A SWARM IDE shell** — Electron + FastAPI + Monaco + Three.js, four panes, WebSocket Blackboard.
- **A genuinely thorough test suite** (`test.py`) — many unit tests across netlist, DRC, battery model, schematic, validation.

**The design-spec documents (`phys_llm.md`, `aeluron_llm.md`) describe something far larger:** a 1B → 70B-parameter transformer-backbone Phys-LLM spanning thermal + EM + stress + fluid + timing + **GDSII-to-physics**, and an Aeluron-LLM that "replaces Claude, Gemini, GPT-4." These are roadmaps, and they are fine *as roadmaps*. The risk is that the spec docs present these as "v1.0" in the same tables that describe what exists, which blurs vision and reality. To your credit, `aeluron_llm.md` is candid in places ("v0.1 will NOT match Claude").

**Why this matters:** investors and especially their technical advisors will mentally subtract the roadmap from the artifacts. If your materials don't draw that line clearly, *they* will — and they'll trust you less for not having drawn it yourself.

---

## 2. PoC health check — grounded in the actual `LTE_GPS_Tracker` run

### 2.1 What genuinely works (don't underweight this)

- **End-to-end orchestration is real.** Eleven stages, 19 s, no crashes, coherent report artifacts. The "single prompt → full design dossier" experience is the demo, and it lands.
- **The verification LLM is appropriately critical.** A 6.6/10 "warning" verdict that flags ESP32-S3 for LTE, missing IP rating, and vague power budget is *honest* output, not a rubber stamp. That self-criticism is a good look.
- **The DRC math and battery model are reasonable first-pass engineering.** The IPC-2221-style trace-width check and the duty-cycle battery estimate are simplified but sane.
- **The test suite signals engineering discipline** unusual for a two-person pre-seed team.

### 2.2 What is broken or templated (the red flags a DD reviewer will find)

These all trace to one root cause, visible in `test.py`: **the engineering backend is built around a fixed ~16-part catalog** (`SYMBOL_MAP`, `POWER_MODELS`, `I2C_PINS`, `SPI_PINS`, `POWER_PINS`) consisting of ESP32-C3/S3 + a handful of I²C sensors + the **SX1276 (LoRa)** radio + a few power ICs. None of the `LTE_GPS_Tracker`'s actual parts (SIM7600, u-blox NEO-M8N, TPS62840, bare "ESP32-S3", LiFePO4) appear in any of those maps. Consequences in the uploaded run:

1. **LoRa nets inside an "LTE" design.** The DRC checks `LORA_TX`, `SPI_MOSI/MISO/SCK`, `I2C_SDA/SCL` — the canned net set for a LoRa-IoT sensor node. An LTE+GPS tracker would have UART links to the SIM7600 modem and the GPS, not a LoRa transmit net. This is the clearest evidence that the schematic/netlist/DRC stage emits a **template** rather than something derived from the parts the LLM "selected."
2. **A ₹0, zero-parts-found BOM.** `total_cost_inr: 0.0`, `parts_found: 0`, `parts_priced_live: 0`, all six parts in `parts_missing`. Pricing did not work because the selected parts aren't in the catalog.
3. **A physically meaningless thermal result.** The thermal stage reports `T_min = T_max = 35.82 °C` (and `T_mean` differing only at the sixth decimal). A real board with dissipating chips has hot spots and gradients; a spatially uniform field means **no actual temperature distribution was produced** for this design. Most likely cause: the GPS-tracker prompt yielded no real chip-placement/power-map, so the PINN was handed a degenerate, out-of-distribution input (positions padded to three identical points) and collapsed to a near-constant output. This is a known failure mode of vanilla coordinate-MLP PINNs — see §3.3 on why the frontier moved to neural operators. The report still labels this "✓ SAFE — within PCB limits," which is the wrong message to attach to a non-result.
4. **Internal inconsistencies in the power/battery numbers.** With 151.89 mA active, 0.7595 mA sleep, and a stated 1% duty cycle, the average current should be ≈ 2.27 mA, but the run reports 1.2633 mA → 1.6 months. The arithmetic doesn't close, which suggests the duty cycle used in the calc differs from the one displayed. Minor, but DD reviewers notice.
5. **The "tests" do not validate the science.** The PINN/benchmark tests in `test.py` assert against **hardcoded** MAE arrays (`[2.5, 3.5, 3.8, 4.2, 3.0]`) and synthetic speedups, not real model output. So the suite proves the *formulas* and *plumbing*, not the headline "2.8 °C MAE / 68×" claims. Those headline numbers in the Week 1/Week 4 guides are **targets**, not measured results — important to say out loud before a VC's advisor assumes otherwise.
6. **The live pipeline still depends on an external frontier LLM.** The spec/verification prose reads as external-model output (consistent with the Week 2 guide using an external model to generate training pairs), and Aeluron-LLM is explicitly Phase 0. That's fine and matches your own framing — just don't let the deck imply the proprietary LLM is already in the loop.

### 2.3 Honest verdict on the PoC

**It is an impressive integration scaffold wrapped around a narrow, partly-canned core.** The skeleton (orchestration, report generation, IDE) is the genuinely hard thing and it works. The flesh (true per-design generation, a real parts/physics backend) is thin and, outside the LoRa-IoT template, currently faked by fallback. This is a completely normal place for a four-week PoC to be — but it is **not** yet evidence of a general "hardware compiler," and the demo currently *looks* more general than it is. That gap is the central risk to manage.

---

## 3. Aeluron vs. Flux.ai — and the wider field

### 3.1 What Flux is, and how far ahead it is

Flux (Defy Gravity Inc., San Francisco, founded 2019 by Matthias Wagner, ex-Meta/Oculus PM) is a browser-native, cloud-collaborative EDA platform: schematic capture + PCB layout + BOM + built-in SPICE, with an 800k+ part library and live supply-chain pricing. Its **Copilot** is a custom LLM that already does conversational prompt → schematic, automatic wiring, BOM generation, component-alternative suggestions, "find issues," test-plan generation, and AI auto-routing/auto-layout. By its Spring 2026 release the agent is marketed as up to 10× faster and self-correcting, and Flux positions itself explicitly as "the first AI hardware engineer — prompt to manufactured board in one tab."

**Funding:** ~$49M total across rounds, including a $27M Series B led by 8VC (announced Feb 2026) plus a previously-unannounced $10M earlier round (Outsiders Fund, Bain Capital Ventures, Liquid 2 Ventures). Reported usage: ~1.1M builders, ~6.4M projects. *(Sources: FinSMEs, SiliconANGLE, Dealroom, Tracxn, Pulse2 founder interview, Flux blog — Feb–Apr 2026.)*

### 3.2 Direct comparison

| Dimension | **Aeluron SWARM (now)** | **Flux.ai (now)** |
|---|---|---|
| Core promise | Prompt → full design dossier + scored verification | Prompt → manufacturable board, end-to-end |
| Schematic generation | Template-based, ~16-part catalog | LLM co-designer over 800k+ parts, auto-wiring |
| PCB layout / routing | Not present in the uploaded pipeline | AI auto-layout + intent-aware routing |
| BOM / sourcing | Not working in the run (₹0, 0 parts found) | Live BOM with real-time pricing/availability |
| Simulation | ngspice power + a 2-D thermal PINN (collapsed on the test run) | Built-in SPICE; sourcing-aware checks |
| Differentiator | Physics-informed surrogate + multi-agent IDE + sovereign/India angle | Web-native, real-time collaborative, huge library, mature agent |
| Maturity | 4-week PoC, narrow, pre-revenue | 7 years, ~1.1M users, paying tiers (ACU credits) |
| Funding | Raising $1M pre-seed | ~$49M raised |
| Deployment | Desktop (Electron) | Browser/cloud |

**Read:** Flux is not a different idea from Aeluron — it is the *same* idea, several years and ~$49M ahead, with the one thing you don't have (a massive, sourced part library and a layout/routing engine that actually works on arbitrary designs). On the "natural-language PCB" axis, you are behind, not differentiated.

### 3.3 The differentiator is also crowded — and your architecture is a generation behind

Aeluron's claimed edge is **physics-informed simulation** ("Phys-LLM"). That thesis is correct and validated — but it is exactly where a lot of well-funded talent already is:

- **Quilter** ($25M Series B led by Index Ventures, Oct 2025; founder ex-SpaceX) is *"physics-driven AI for PCB"* almost verbatim — reinforcement learning trained on first-principles EM/thermal, doing fully autonomous placement/routing/verification, selling into Fortune-500 aerospace/defense, integrating with Altium/Cadence/Siemens, with a free tier for small teams. This is the most direct strategic threat to Aeluron's "physics" positioning *and* its small-team go-to-market.
- **Physics-AI simulation surrogates** as a category: **PhysicsX** (ex-F1 team, "Large Physics Models," integrates with Siemens Simcenter X + NVIDIA), **Luminary Cloud** ($72M Series B; Northrop Grumman, Blue Origin customers), and **NVIDIA PhysicsNeMo / Apollo** providing the open foundational stack — plus Neural Concept, Navier, BeyondMath. *(Sources: BusinessWire/HPCwire on Quilter; Built In SF on Luminary; NVIDIA blog; WindowsForum/CIMdata roundup — 2025–2026.)*
- **Technical gap:** the leaders use **neural operators** (Fourier Neural Operators, Transolver/transformer PDE solvers, GNNs over meshes) trained on large simulation corpora, precisely because these generalize across geometries. Aeluron's Phys-LLM as built is a **vanilla coordinate-MLP PINN** — the 2019-era approach, and the one most prone to the out-of-distribution collapse you saw on the GPS-tracker run. The roadmap doc's transformer/point-cloud/GNN vision is the right destination; the shipped artifact is not on that architecture yet.
- **Incumbents are adding AI on both ends:** Cadence (Allegro X AI, Cerebrus, JedAI), Synopsys (.ai/Copilot), Siemens EDA (agentic AI in Questa One for IC verification, Feb 2026), Altium. On the "PCB-as-code" flank: JITX (~$12M Series A), Celus, Atopile, SnapMagic.

**Net competitive read:** Both lanes Aeluron straddles — *LLM-driven design generation* and *physics-driven AI* — are occupied by companies with 6–7-year head starts and 10–70× the capital. That does **not** make Aeluron un-fundable, but it kills any pitch built on "no one else is doing this." The honest framing is "a contested, validated market where we have a specific wedge," not "a blue ocean."

### 3.4 Where a defensible wedge might actually exist

Pick one and commit; trying to out-feature Flux head-on is a losing trade.

- **India / sovereign EDA + IndiaAI alignment.** Data-residency and ITAR/DRDO-adjacent constraints are a *real* reason a domestic, on-prem/air-gappable stack can win deals the US incumbents structurally cannot. This is your strongest non-technical moat and you already gesture at it.
- **The integrated agentic *workflow*, not any single tool.** Flux is one tool; Quilter is layout-only; the surrogate startups are simulation-only. A single Blackboard orchestrating spec → generate → simulate → verify → iterate across vendors is a genuinely different product shape — *if* the agents are real and not templates.
- **One vertical, dominated.** Your template already does low-power IoT/LoRa sensor nodes. That is a legitimate beachhead market (makers, agritech, asset tracking, campus IoT). Be the best in the world at *that* narrow thing, prove the data flywheel, then expand. "Universal" is earned vertical-by-vertical, not declared.
- **Education / on-device + zero-API-cost.** A free, offline, India-priced teaching IDE for EE students at IITs/NITs is a credible top-of-funnel and data source.

---

## 4. Can Aeluron raise $1M on a $10M SAFE cap?

### 4.1 The market reality (so the number isn't judged in a vacuum)

- A **$10M post-money SAFE cap on a sub-$2.5M round is squarely in-band for 2026.** Carta/Kruze data put median caps around **$10M for sub-$1M rounds and ~$15M for $1M–$2.5M rounds**; US median pre-seed pre-money sits near **$7.7M**. So $10M is *normal-to-slightly-rich*, not crazy. **Hardware was the #2 sector by pre-seed cash raised in 2025**, and AI prices ~20% above the all-sector median. *(Sources: Carta State of Pre-Seed; Kruze 2025–26 guide; Zeni/PitchBook-NVCA — Feb–Mar 2026.)*
- **But India is more disciplined and lower-valued in absolute terms.** Indian seed funding fell ~44% YoY to ~$452M in 2025; investors are explicitly prioritizing *demonstrable traction — revenue, paying customers, unit economics.* Dollar valuations run below US comparables. *(Source: Seafund India early-stage breakdown, Jan 2026.)* So a $10M-cap number that reads as "market" in San Francisco reads as "premium" in Bengaluru.

**Conclusion on the number itself:** the *cap is defensible by convention.* The issue is never the number in isolation — it's whether the evidence supports it for *this* company.

### 4.2 The case **for** (what makes it fundable at this cap)

- **Velocity.** Four weeks, two people, a working end-to-end demo. Execution speed is the single most fundable pre-seed signal, and it's strong here.
- **A demo that *shows*, not tells.** "Type a prompt, get a scored design dossier in 19 seconds" is exactly the kind of screen-recordable moment the Week 4 plan is built around, and it photographs well.
- **The thesis is validated by the field.** That Flux, Quilter, Luminary, and PhysicsX exist and are funded *proves the market* to a generalist VC (even as it raises the bar).
- **Narrative tailwinds.** AI-for-physical-engineering is hot; IIT pedigree + IndiaAI/sovereign angle resonates with India deep-tech funds.
- **Right instrument.** Post-money SAFE with a cap is the 2026 default for this size; no friction there.

### 4.3 The case **against** (what a sharp investor / their technical advisor will push on)

- **The demo is more general than the engine.** A DD advisor who runs a *fresh* prompt outside the LoRa-IoT template will hit the §2.2 issues (LoRa nets, ₹0 BOM, flat thermal). Your own Week 4 doc says "every number you say must be reproducible on GitHub" — by that standard, the current pipeline output would *fail* an independent re-run on a novel prompt.
- **Headline metrics are targets, not measurements.** "70× / 2.8 °C MAE" are aspirations in the guide; the test suite uses hardcoded MAE. Presenting targets as results is the fastest way to lose a technical advisor's trust.
- **Crowded, far-better-capitalized competition** (§3) removes the "first/only" framing and invites "why won't Flux/Quilter/an incumbent crush you?" — a question your own deck (the Synopsys answer) only partially handles.
- **Team gap, self-admitted.** No hardware-engineering background; the "we validate against FEniCS" answer is good but the advisor-recruiting line is still a promise, not a person.
- **Eval rigor.** Keyword-match LLM eval is, by your own admission, a proxy. Fine for a demo; thin as a defensible metric.

### 4.4 Honest verdict

**Raising ~$1M is realistic. Holding the $10M cap is the hard part, and it will hinge on the founder + demo carrying a gap the metrics don't yet close.** Three plausible paths, roughly in order of likelihood:

1. **A thesis-driven / India-deep-tech believer funds it at ~$10M** on team + velocity + sovereign narrative, *treating current tech as Phase 0.* Most likely if your demo is clean on at least 2–3 *distinct, non-template* prompts and you've stopped presenting targets as results.
2. **You de-risk first** (fix §2.2, ship a reproducible GitHub benchmark on genuinely unseen designs, recruit the ex-Cadence/EDA advisor) and *then* the $10M cap is comfortably defensible.
3. **You accept a $5–8M cap now** to close fast with a strong angel/micro-VC, and re-rate at the seed once the flywheel shows.

The thing most likely to *kill* the $10M cap is not the valuation theory — it's a technical reviewer discovering that the impressive general-purpose demo is, under the hood, a single-template generator with a non-functional BOM and a collapsed thermal model. **Fix that perception (by fixing the reality) before you walk into diligence at this cap.**

---

## 5. Becoming "universal software for all hardware, PCB → semiconductor"

This is the right *ambition* and a coherent *story*, but it is a decade-scale ladder, and honesty about its length is itself a credibility signal to good investors.

### 5.1 What is genuinely portable vs. what must be rebuilt per domain

| Layer | Portable across PCB → semiconductor? | Why |
|---|---|---|
| **Agentic orchestration / Blackboard** (spec → generate → simulate → verify → iterate) | **Yes — this is the asset.** | The control loop is domain-agnostic. This is the part worth calling "the brain." |
| **Domain LLM reasoning** | Partly | Needs separate corpora/eval per domain (Verilog timing ≠ KiCad DRC ≠ DRC/LVS against a foundry PDK). |
| **Generators** (schematic, PCB layout, RTL synthesis, place-&-route) | **No** | Each is a distinct, hard, multi-year engine. PCB layout ≠ standard-cell P&R. |
| **Physics surrogates** | **No** | Board thermal ≠ on-chip IR-drop/electromigration/timing ≠ CFD ≠ EM/HFSS. Each needs its own model + training data. |
| **Ground-truth solvers (for training data)** | **No** | FEniCS/ngspice for boards; OpenLane/OpenROAD/Magic/ngspice for IC; Ansys/COMSOL for mechanical/EM. |
| **Component / cell libraries + design rules** | **No** | A 16-part catalog → 800k-part library → a foundry PDK are three different universes of effort and access. |

**Implication:** "universal" is not one model. It is **one orchestration brain + a growing zoo of domain plugins, each of which is itself a Flux- or Quilter-sized company to build well.** Frame it that way and it's credible; frame it as "one Phys-LLM does everything" and a technical investor stops believing you.

### 5.2 A realistic ladder (rungs, not leaps)

1. **Rung 0 — Nail one PCB class (now → 6 months).** Make the LoRa/IoT-sensor-node path *actually general within its class*: real parts DB + live pricing, schematic genuinely derived from selected parts, thermal model that produces real gradients (move from coordinate-PINN toward a neural operator or at least condition properly on geometry). This is the credibility foundation for everything above it.
2. **Rung 1 — Broaden PCB coverage (6–18 months).** More MCUs/radios/sensors/power topologies; mixed-signal; basic layout/routing or a clean hand-off to KiCad/Flux/Quilter. Now you genuinely compete with early Flux.
3. **Rung 2 — Modules & FPGA/RTL (Year 2–3).** Verilog generation + simulation you can actually verify; FPGA flows (Yosys/nextpnr) are open and tractable.
4. **Rung 3 — IC back-end on open PDKs (Year 3–5, Series-B-funded).** OpenLane/OpenROAD + **sky130/IHP open PDKs**, Magic/KLayout for DRC/LVS. This is where "semiconductor" first becomes real for you — and it starts open-source, not at TSMC.
5. **Rung 4 — Advanced-node / custom silicon (Year 5+, frontier).** Locked behind NDA'd foundry PDKs, $M/seat tool licenses, and physics (signal integrity at GHz, EM, thermal-aware P&R) that is categorically harder than boards. This is where Synopsys/Cadence/Siemens live, and where even Quilter has only just claimed a first "AI-designed computer." Plan for it; don't pitch it as near.

### 5.3 Why semiconductor specifically is a different beast (set expectations)

- **Scale:** dozens of components on a board vs. millions–billions of transistors on a die.
- **Physics:** board-level thermal vs. on-chip IR-drop, electromigration, parasitic extraction, timing closure, signal integrity.
- **Verification:** ERC/DRC on a board vs. DRC/LVS/DFM against a confidential foundry deck, plus formal verification and timing sign-off.
- **Access & capital:** PDKs and tools are gated by NDAs and seven-figure licenses; tapeout is expensive and unforgiving.
- **Incumbency:** Synopsys + Cadence + Siemens EDA are entrenched, already shipping AI (e.g., Siemens' agentic Questa One, Feb 2026), and sell to the exact customers you'd need.

The honest pitch is: **"We're building the agentic design brain. We prove it on PCB, dominate a vertical, build the data flywheel, then extend the *same orchestration layer* down toward silicon starting with open PDKs."** That is fundable and true. "We're building the universal model that designs everything from resistors to chips" is neither.

---

## 6. Prioritized recommendations

### Fix-the-PoC (do before any diligence at a $10M cap)
1. **Make generation real outside the template.** Either (a) expand the parts/symbol/pin/power maps and wire the schematic/netlist/DRC to the *actually selected* parts, or (b) explicitly gate the pipeline to supported device classes and *say so* — silent template fallback is the worst option because it looks like a bug/fraud in DD.
2. **Fix the BOM path** so it returns real parts and prices (even a static curated DB beats `0 parts found`).
3. **Fix or fence the thermal stage.** At minimum, don't emit a flat field and label it "SAFE." Better: feed a real power/placement map and move toward a geometry-conditioned model (neural operator) so it doesn't collapse OOD.
4. **Reconcile the power/battery arithmetic** (duty-cycle vs. reported average current).
5. **Replace hardcoded test MAEs with a real, reproducible benchmark** on genuinely unseen designs — exactly what your own Week 4 doc demands. Publish it.
6. **Stop presenting targets as results.** Relabel "70× / 2.8 °C" as goals until measured; nothing erodes a technical advisor's trust faster.

### Strategic
7. **Pick one wedge** (§3.4) — most likely *India/sovereign + one dominated vertical* — and drop "blue ocean" framing.
8. **Adopt the modern surrogate architecture** (neural operator / FNO / Transolver-style) on the roadmap; it directly answers "why won't a vanilla PINN just collapse?" and aligns you with PhysicsX/Luminary/NVIDIA's direction.
9. **Recruit the domain advisor for real** (ex-Cadence/EDA) before the raise, not as a promise in the deck.

### Fundraising
10. **Demo on 2–3 distinct, non-template prompts live** — that single change does more for the $10M cap than any slide.
11. **Draw the artifact-vs-roadmap line explicitly** in your materials; let the investor trust you *because* you drew it.
12. **Have a clean answer to "Flux/Quilter/Synopsys"** that leads with sovereign/data-residency + agentic-workflow + vertical focus, not feature parity.
13. **Be ready to take a $5–8M cap** to close fast if a strong India deep-tech angel/micro-VC bites; momentum at pre-seed beats an extra few points of cap.

---

## Appendix — evidence basis

**Internal (uploaded):** Week 1–4 build guides; `phys_llm.md`, `aeluron_llm.md` (design specs/roadmaps); `test.py` (catalog/SYMBOL_MAP/POWER_MODELS, hardcoded-MAE tests); `pipeline_log.json`, `simulation_results.json`, `LTE_GPS_Tracker_spec.json`, and the two report PNGs (the LoRa-net DRC, ₹0 BOM, flat 35.82 °C thermal field, 6.6/10 verification).

**External (web, 2025–2026):** Flux funding/scale — FinSMEs, SiliconANGLE, Dealroom, Tracxn, Pulse2 (Wagner interview), Flux blog. Quilter — BusinessWire, HPCwire, Pulse2 (Index Ventures $25M Series B). Physics-AI surrogates — NVIDIA blog (PhysicsNeMo/Apollo), Built In SF (Luminary $72M), WindowsForum/PhysicsX, CIMdata roundup (BeyondMath/Navier/Neural Concept). Pre-seed/SAFE benchmarks — Carta State of Pre-Seed, Kruze 2025–26 guide, Zeni/PitchBook-NVCA, ValueAdd VC. India early-stage — Seafund.

*This is an analytical assessment, not investment, legal, or financial advice; valuation outcomes depend on factors outside this document.*
