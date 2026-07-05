# Step 2 results — local notes via Ollama on Jordan's Windows PC

**Verdict: PROVEN.** `spike_notes.py` + Ollama (`qwen2.5:3b`) generates real,
accurate meeting notes fully locally on this PC. CPU-only, ~11.6 tok/s, ~20s
for a short call. Zero cloud, zero tokens.

- Date: 2026-07-04
- Machine: Windows 11 Pro (10.0.22631), no NVIDIA GPU (`nvidia-smi` absent → Ollama runs CPU)
- Python: conda env `eal_gpu` (Python 3.12.12) — same env that ran Step 1
- Ollama: **0.31.1** (installed this session via `winget install Ollama.Ollama`)
- Model: **qwen2.5:3b** (pulled this session)

## Console output of `spike_notes.py` (built-in sample)

```
Ollama  : 0.31.1 at http://localhost:11434
Model   : qwen2.5:3b
Input   : built-in sample (12 lines)

Generating notes locally (zero-token)…

=================== NOTES ===================
## Summary
The call was about finalizing the Q3 rollout plan for a new billing system, including data migration and customer communications. Key decisions were made regarding budget approval, phased cutover schedule, and ownership of reconciliation reports.

## Key points
- Finance approved an eighty thousand dollar budget, with contractor hours to be reduced.
- The data migration will involve a two-week mirroring phase starting July 21st, followed by a weekend read flip on August 2nd.
- Support needs an email for customer communications at least one week before the read cutover.
- Marketing is responsible for drafting the customer communication email based on a technical summary provided by the team by July 25th.

## Action items
- **Me** — Commit to having mirroring code in staging by July 14th. [Completed]
- **Caller** — Assign Priya to own the reconciliation report during the mirror phase. [Completed]
- **Marketing** — Draft an email for customer communications based on a technical summary provided by the team by July 25th. [Completed]
=============================================

Wall clock : 21.5s (load 0.2s + generate 19.2s, 11.6 tok/s)
Ran on     : CPU

If the notes above read like a real summary of the call — accurate summary, key points, and action items with owners — Step 2 is proven and we wire record → transcribe → notes into the real app.
```

## End-to-end: real Step 1 audio → transcript → notes

Jordan wasn't at the PC, so instead of a fresh recording I transcribed the WAVs
Step 1 recorded earlier today (`spike_out/me.wav` + `caller.wav`) with
`transcribe_only.py`, then fed that transcript to `spike_notes.py`:

```
================= TRANSCRIPT =================
[00:00] Caller: Hi Jordan, this is the caller on the other end of the line.
[00:03] Me: This is the me-side of the test.
[00:04] Caller: I am coming through the system audio.
[00:05] Me: I am pretending to be Jordan speaking into a microphone.
[00:06] Caller: 77 Benevolent Elephants.
[00:09] Me: One, two, three, four, five.
[00:09] Caller: She sells seashells by the seashore.
[00:11] Me: The rain in Spain stays mainly in the plane.
=============================================
```

Notes output (13.1s wall, 11.9 tok/s, CPU):

```
## Summary
The call was about a playful exchange of phrases and numbers between two individuals pretending to be different people. No substantive decisions or commitments were made during the call.

## Key points
- Caller mentioned "77 Benevolent Elephants."
- Me recited the phrase "One, two, three, four, five."
- Caller repeated "She sells seashells by the seashore."
- Me quoted "The rain in Spain stays mainly in the plane."

## Action items
None
```

This is the best signal of the whole spike: given a content-free test call, the
model **did not hallucinate** action items — it said "None". Full pipeline
record → transcribe → notes works on this PC with real audio.

## Errors hit + fixes (all committed)

1. **`spike_notes.py` did not exist on this PC.** The handoff references it, but
   the Windows folder arrived as a Google Drive zip (not a git clone) and only
   contained the Step 1 files. **Fix:** wrote `spike_notes.py` to the handoff's
   spec (built-in sample transcript, Ollama `/api/chat`, prints wall time and
   GPU/CPU via `/api/ps` `size_vram`, optional transcript-file argument in the
   Step 1 `[MM:SS] Who: text` format). It's in this commit — please review/merge
   with the Mac-side design.
2. **`UnicodeEncodeError` (cp1252) on first run.** Windows console default
   encoding can't print `→`/`—` in model output. **Fix:** in `spike_notes.py`,
   `sys.stdout.reconfigure(encoding="utf-8", errors="replace")` at startup.
   The real app should do the same anywhere it prints/logs model text.
3. **No `py` launcher on this PC.** The handoff's `py …` commands fail; Python
   lives in conda env `eal_gpu` (`C:\Anaconda3\envs\eal_gpu\python.exe`), which
   already had Step 1's deps. Used that. Future docs should not assume `py`.
4. **`winget` msstore source cert error** (`0x8a15005e`) when installing Ollama.
   **Fix:** pin the source: `winget install --id Ollama.Ollama --source winget`.

## Judgment: do the notes read like real meeting notes?

**Yes.** On the sample business call: the summary is accurate, every key point
traces to the transcript, all three action items are real commitments with the
right owners and dates, and nothing was invented. Two quirks, both minor and
fixable with prompt tweaks in the real app:

- The model appended a spurious `[Completed]` tag to each action item.
- Run-to-run it can wobble on ambiguous dates ("the 25th" — one earlier run at
  temperature 0.2 rendered it as August 25th instead of July 25th).

At 3B on CPU this quality is more than good enough for the app; latency (~20s
for a short call) is fine for post-call notes generation.

## What was installed on this PC (per the rules, disclosed)

- **Ollama 0.31.1** — user-level install via winget (`%LOCALAPPDATA%\Programs\Ollama`)
- **qwen2.5:3b** model (~2 GB) via `ollama pull`
- **GitHub CLI** — install attempted via winget for the push fallback, but the
  download stalled on this connection; it may or may not complete. Not needed:
  this PC had no stored GitHub credentials, so Jordan authorizes the push once
  via Git Credential Manager's browser prompt on a plain `git push`.
- No other system-wide changes. pip deps were already present from Step 1.

## Ready for Step 3

Record + transcribe (Step 1) and local notes (Step 2) are both proven on this
hardware. CPU-only figures for planning: faster-whisper `small` int8 for
transcription, qwen2.5:3b at ~11.6 tok/s for notes.
