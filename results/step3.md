# Step 3 results — core Windows app (record → transcribe → notes in a window)

**Verdict: DONE and verified on this PC.** `windows/app/` contains a working
pywebview app: WWASAPI recording, on-device transcription, local-LLM notes, and
a notes library — matching the site's product model (MY NOTES untouched on
top, ✦ PRISM NOTES generated below).

Date: 2026-07-05 · Machine: same Windows 11 PC as Steps 1–2 (CPU-only)

## What's in `windows/app/`

| File | Role |
| --- | --- |
| `prism_app.py` | Entry point; pywebview (EdgeWebView2) window + JS bridge; `--recorder`/`--selftest`/`--smoke` modes |
| `recorder.py` | Recording subprocess: default mic ("Me") + WASAPI loopback of default speakers ("Caller") → WAVs, stop via stdin |
| `engine.py` | faster-whisper transcription (GPU if NVIDIA driver present, else CPU `small` int8) + notes via Ollama `qwen2.5:3b` |
| `store.py` | Sessions under `%LOCALAPPDATA%\Prism\sessions\<id>\` (audio, transcript, my_notes.md, prism_notes.md, meta) |
| `ui.html` | The window UI, built to the landing page's design language; also boots with mock data in a plain browser for UI dev |
| `make_icon.py` / `prism.ico` | App icon (site's rounded-square + triangle mark) |

## Architecture note the Mac side should know

The Step 1 finding still rules everything: **ctranslate2 access-violates if it
ever shares a process with PortAudio on this PC.** So the app records in a
subprocess of itself (`Prism.exe --recorder <dir>`, stopped by writing a line
to its stdin) and only touches faster-whisper in the main process after the
recorder has exited. A crashed recorder also can't take the app down mid-call.

Other Windows specifics baked in:
- Whisper models download to `%LOCALAPPDATA%\Prism\models` on first use.
- If Ollama isn't running or the model isn't pulled, the UI shows a setup
  banner with the exact commands instead of failing.
- The user's own notes are context for generation but the prompt forbids
  rewriting them — same "never rewrites you" promise as the Mac app.

## How it was verified (all passed)

1. **Headless backend smoke:** session built from Step 1's real WAVs →
   transcribed both speakers → generated correct notes ("Action items: None"
   on the content-free test call — no hallucination).
2. **Window self-test:** `prism_app.py --selftest` opens the real window for
   6 s and exits 0.
3. **UI review:** ui.html rendered in a browser with mock data — sidebar,
   note view, MY NOTES / ✦ PRISM NOTES cards, Ollama banner all render
   on-brand.
4. Same three checks repeated against the **frozen** build (see step4.md).

## Caveat for Jordan to sanity-check by hand

Nobody was on a real call during this session, so the full live loop (talk +
play audio → stop → watch notes appear) has only been proven piecewise: real
recording in the frozen recorder subprocess (mic captured; loopback silent
because nothing was playing), and transcription + notes on Step 1's real
recordings. First real call should be treated as the acceptance test.
