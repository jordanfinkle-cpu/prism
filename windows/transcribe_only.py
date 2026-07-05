"""Transcribe already-recorded spike WAVs in a fresh process (no PyAudio)."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from spike_record_transcribe import load_model, transcribe, MIC_WAV, SYS_WAV

print("Loading faster-whisper…")
model, tag = load_model()
print(f"Transcribing on-device ({tag})…")
rows = transcribe(MIC_WAV, "Me", model) + transcribe(SYS_WAV, "Caller", model)
rows.sort(key=lambda r: r[0])

print("\n================= TRANSCRIPT =================")
if not rows:
    print("(nothing transcribed — did the mic/loopback capture any sound?)")
for t, who, text in rows:
    print(f"[{int(t) // 60:02d}:{int(t) % 60:02d}] {who}: {text}")
print("=============================================")
