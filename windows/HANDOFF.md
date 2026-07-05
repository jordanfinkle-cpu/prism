# Prism for Windows — handoff for Claude Code (on Jordan's Windows PC)

You are **Claude Code running on Jordan's Windows PC**. Another Claude Code instance
is building Prism on a **Mac** and coordinates with you *through this repo*. Your job:
run the **Windows-only** build/test steps (which the Mac literally cannot do), and
**push your results back** so the Mac Claude can drive the next step.

## What Prism is
A **local, zero-token** call recorder → transcriber → AI-notes app. It records both
sides of a call (you + the other party), transcribes on-device, and writes meeting
notes with a local LLM — **no cloud, no API keys, no tokens**. Today it's a polished
macOS app; we're porting it to Windows and keeping it **100% local / zero-token**.

## Windows stack (already decided)
- **Audio capture:** WASAPI — mic + system *loopback* (Windows captures "what you hear"
  natively, no virtual cable). See `spike_record_transcribe.py`.
- **Transcription:** `faster-whisper` (CTranslate2; CPU, or NVIDIA GPU if present).
- **Local LLM (notes):** `Ollama` running `qwen2.5` (same family as the Mac).
- **Later:** `pywebview` + the real `ui.html`; package with **PyInstaller** + **Inno Setup**.

## Status
- ✅ **Step 1 — record + transcribe:** PROVEN on this PC (`spike_record_transcribe.py` worked).
- ⏳ **Step 2 — local notes:** prove now (`spike_notes.py` + Ollama).  ← YOUR TASK
- ⬜ **Step 3 — core app:** real `ui.html` in a window, wired record→transcribe→notes.
- ⬜ **Step 4 — package:** `Prism-Setup.exe` + installer, then a "Download for Windows" button.

## Your task right now (Step 2)
1. `py -m pip install -r requirements-win.txt`
2. Install Ollama if missing (https://ollama.com/download), then `ollama pull qwen2.5:3b`.
3. `py spike_notes.py`  (generates notes from a built-in sample transcript).
4. Optional end-to-end: `py spike_record_transcribe.py 15` (talk + play audio), then
   feed its transcript to `spike_notes.py`.
5. **Report back** (below).

## How to report back  ← important
Write a file `results/step2.md` in this repo and **commit + push** it, containing:
- the full console output of `spike_notes.py`,
- the model used, wall-clock time, and whether it ran on **GPU or CPU**,
- any errors + exactly how you fixed them,
- your judgment: do the notes read like real, accurate meeting notes?

If pushing isn't set up yet: `winget install GitHub.cli` → `gh auth login --web`
(Jordan approves in the browser) → then `git add`, `commit`, `push`. If you genuinely
can't push, print a clean summary for Jordan to paste back to the Mac Claude.

## Rules
- Keep everything **local / zero-token** — no cloud APIs, no keys, ever.
- Fix Windows-specific issues yourself (WASAPI format mismatch, CUDA, PyInstaller
  quirks), **note what you changed in `results/step2.md`, and commit the code fix**.
- Don't touch Jordan's files outside this repo. Don't install system-wide things
  beyond Python / the pip deps / Ollama without saying so in your report.
- Ask Jordan before anything outward-facing (publishing, new services, signing certs).

The Mac Claude reads `results/` and pushes the next step here. Go.
