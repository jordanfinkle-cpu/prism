#!/usr/bin/env python3
"""Prism for Windows — feasibility spike Step 2 (local LLM meeting notes).

This proves the last zero-token piece on Windows: turning a two-speaker call
transcript into real meeting notes with a LOCAL model via Ollama. No cloud,
no API key, no tokens.

Prereqs (once):
    winget install Ollama.Ollama
    ollama pull qwen2.5:3b

Usage:
    python spike_notes.py                # uses the built-in sample transcript
    python spike_notes.py transcript.txt # or feed a real one (Step 1 format:
                                         #   [MM:SS] Me: ... / [MM:SS] Caller: ...)

Prints the generated notes, wall-clock time, and whether Ollama ran the model
on GPU or CPU.
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error

# Windows consoles often default to cp1252, which can't print the arrows/dashes
# the model (or we) emit — reconfigure to UTF-8 instead of crashing mid-print.
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

OLLAMA = os.environ.get("PRISM_OLLAMA_URL", "http://localhost:11434")
MODEL = os.environ.get("PRISM_NOTES_MODEL", "qwen2.5:3b")

# Same shape spike_record_transcribe.py prints, so its output can be piped in.
SAMPLE_TRANSCRIPT = """\
[00:02] Me: Hey Dana, thanks for making time. I wanted to walk through the Q3 rollout plan for the new billing system.
[00:09] Caller: Of course. Before we start — did finance sign off on the migration budget?
[00:14] Me: They approved eighty thousand, which is ten under what we asked. We'll need to trim the contractor hours.
[00:23] Caller: Okay. My main worry is the data migration window. Last time we took the system down for six hours and support got buried.
[00:33] Me: Agreed. The plan this time is a phased cutover — we mirror writes to the new system for two weeks starting July 21st, then flip reads over the weekend of August 2nd.
[00:47] Caller: That works for us. Can your team have the mirroring code in staging by July 14th so QA gets a full week?
[00:55] Me: Yes, I'll commit to July 14th. One ask: I need someone from your side to own the reconciliation report during the mirror phase.
[01:04] Caller: I'll assign Priya. She did the reconciliation on the last migration.
[01:09] Me: Perfect. Last thing — customer comms. Support wants an email to go out at least a week before the read cutover.
[01:17] Caller: Marketing can draft it. Send them the technical summary by the 25th and they'll handle the rest.
[01:24] Me: Done. So: I get mirroring to staging by the 14th, you assign Priya to reconciliation, tech summary to marketing by the 25th, cutover weekend of August 2nd.
[01:35] Caller: That's my understanding. Let's check in weekly on Mondays until the cutover.
"""

PROMPT = """You are a precise note-taker. Below is a transcript of a phone call \
between "Me" (the user) and "Caller" (the other party). Write meeting notes in \
exactly this markdown format:

## Summary
(2-3 sentences, what the call was about and what was concluded)

## Key points
(bulleted, the substantive facts/decisions discussed)

## Action items
(bulleted, each as "**Who** — what, by when" using only commitments actually \
made in the call)

Only include things actually said in the transcript. Do not invent names, \
dates, or numbers.

TRANSCRIPT:
{transcript}
"""


def post(path, payload, timeout=600):
    req = urllib.request.Request(
        OLLAMA + path, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def get(path, timeout=10):
    with urllib.request.urlopen(OLLAMA + path, timeout=timeout) as r:
        return json.loads(r.read())


def where_is_it_running():
    """Ask Ollama whether the loaded model sits in VRAM (GPU) or RAM (CPU)."""
    try:
        for m in get("/api/ps").get("models", []):
            if m.get("name", "").startswith(MODEL.split(":")[0]):
                vram, total = m.get("size_vram", 0), m.get("size", 0) or 1
                if vram == 0:
                    return "CPU"
                if vram >= total:
                    return "GPU"
                return f"GPU+CPU split ({100 * vram // total}% in VRAM)"
    except Exception:
        pass
    return "unknown"


def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8") as f:
            transcript = f.read()
        source = sys.argv[1]
    else:
        transcript = SAMPLE_TRANSCRIPT
        source = "built-in sample"

    try:
        version = get("/api/version").get("version", "?")
    except (urllib.error.URLError, OSError):
        raise SystemExit(
            f"Ollama isn't reachable at {OLLAMA}.\n"
            "Start it ('ollama serve' or the Ollama app) and try again.")
    print(f"Ollama  : {version} at {OLLAMA}")
    print(f"Model   : {MODEL}")
    print(f"Input   : {source} ({len(transcript.splitlines())} lines)")

    print("\nGenerating notes locally (zero-token)…")
    t0 = time.perf_counter()
    resp = post("/api/chat", {
        "model": MODEL,
        "messages": [{"role": "user",
                      "content": PROMPT.format(transcript=transcript)}],
        "stream": False,
        "options": {"temperature": 0.2},   # notes should be factual, not creative
    })
    dt = time.perf_counter() - t0

    notes = resp.get("message", {}).get("content", "").strip()
    print("\n=================== NOTES ===================")
    print(notes if notes else "(model returned nothing)")
    print("=============================================")

    ev = resp.get("eval_count", 0)
    ed = resp.get("eval_duration", 0)
    tps = f", {ev / (ed / 1e9):.1f} tok/s" if ev and ed else ""
    print(f"\nWall clock : {dt:.1f}s (load {resp.get('load_duration', 0) / 1e9:.1f}s"
          f" + generate {ed / 1e9:.1f}s{tps})")
    print(f"Ran on     : {where_is_it_running()}")
    print("\nIf the notes above read like a real summary of the call — accurate "
          "summary, key points, and action items with owners — Step 2 is proven "
          "and we wire record → transcribe → notes into the real app.")


if __name__ == "__main__":
    main()
