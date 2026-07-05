"""Prism for Windows — on-device transcription + local-LLM notes.

Zero-token by design: faster-whisper (CPU/GPU) for speech, Ollama for notes.
IMPORTANT: never import this next to live PortAudio — on some PCs ctranslate2
access-violates if it shares a process with an open audio stream. Recording
happens in a subprocess (see prism_app.py); we only run after it has exited.
"""
import json
import os
import shutil
import urllib.error
import urllib.request

import store

OLLAMA = os.environ.get("PRISM_OLLAMA_URL", "http://localhost:11434")
MODEL = os.environ.get("PRISM_NOTES_MODEL", "qwen2.5:3b")

_whisper = None


def _load_whisper():
    global _whisper
    if _whisper is None:
        from faster_whisper import WhisperModel
        try:
            if shutil.which("nvidia-smi") is None:
                raise RuntimeError("no NVIDIA driver")
            _whisper = WhisperModel("large-v3", device="cuda",
                                    compute_type="float16",
                                    download_root=store.MODELS_DIR)
        except Exception:
            _whisper = WhisperModel("small", device="cpu", compute_type="int8",
                                    download_root=store.MODELS_DIR)
    return _whisper


def transcribe_session(sid):
    """Transcribe both sides of a recorded session, save + return the text."""
    model = _load_whisper()
    d = store.session_dir(sid)
    rows = []
    for wav, who in ((os.path.join(d, "me.wav"), "Me"),
                     (os.path.join(d, "caller.wav"), "Caller")):
        if not os.path.exists(wav) or os.path.getsize(wav) <= 44:  # empty wav
            continue
        segs, _ = model.transcribe(wav, beam_size=5, vad_filter=True)
        rows += [(s.start, who, s.text.strip()) for s in segs if s.text.strip()]
    rows.sort(key=lambda r: r[0])
    text = "\n".join(f"[{int(t) // 60:02d}:{int(t) % 60:02d}] {who}: {line}"
                     for t, who, line in rows)
    store.save_transcript(sid, text)
    return text


NOTES_PROMPT = """You are a precise note-taker. Below is a transcript of a call \
between "Me" (the user) and "Caller" (the other party){notes_clause}. Write \
meeting notes in exactly this markdown format:

## Summary
(2-3 sentences, what the call was about and what was concluded)

## Key points
(bulleted, the substantive facts/decisions discussed)

## Action items
(bulleted, each as "**Who** — what, by when" using only commitments actually \
made in the call; write "None" if there are none)

Only include things actually said in the transcript. Do not invent names, \
dates, or numbers. Do not add status tags like [Completed].
{notes_block}
TRANSCRIPT:
{transcript}
"""


def generate_notes(sid):
    """Generate Prism notes from the transcript (+ the user's own bullets as
    context, per the product promise: synthesized from your notes & transcript,
    never rewriting them)."""
    s = store.get_session(sid)
    transcript = s["transcript"]
    if not transcript.strip():
        raise RuntimeError("Nothing was transcribed for this call.")
    my_notes = s["my_notes"].strip()
    notes_clause = ", plus the user's own rough bullets" if my_notes else ""
    notes_block = (f"\nTHE USER'S OWN NOTES (context only — do not rewrite or "
                   f"repeat them verbatim):\n{my_notes}\n" if my_notes else "")
    prompt = NOTES_PROMPT.format(notes_clause=notes_clause,
                                 notes_block=notes_block,
                                 transcript=transcript)
    req = urllib.request.Request(
        OLLAMA + "/api/chat",
        data=json.dumps({
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "options": {"temperature": 0.2},
        }).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as r:
        resp = json.loads(r.read())
    notes = resp.get("message", {}).get("content", "").strip()
    store.save_prism_notes(sid, notes)
    return notes


def ollama_status():
    """For the UI setup banner: is Ollama up, and is our model pulled?"""
    try:
        with urllib.request.urlopen(OLLAMA + "/api/tags", timeout=3) as r:
            tags = json.loads(r.read())
        has_model = any(m.get("name", "").startswith(MODEL)
                        for m in tags.get("models", []))
        return {"running": True, "model": MODEL, "model_present": has_model}
    except (urllib.error.URLError, OSError):
        return {"running": False, "model": MODEL, "model_present": False}
