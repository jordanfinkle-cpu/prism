#!/usr/bin/env python3
"""Prism for Windows — feasibility spike (record + on-device transcribe).

  >>> RUN THIS ON WINDOWS. It cannot run on macOS. <<<
  (It uses WASAPI audio capture + faster-whisper, which are Windows/PC-only.)

This proves the two hardest parts of a Windows port work on your PC, fully local
and zero-token, BEFORE we build the whole app:

  1. Capture BOTH sides of a call with NO virtual cable — your microphone and the
     system audio you actually hear (WASAPI loopback of the default speakers).
     Windows can record "what you hear" natively; on the Mac this needed
     ScreenCaptureKit + BlackHole, so this part is actually simpler here.
  2. Transcribe on-device with faster-whisper — NVIDIA GPU if you have one, else
     CPU. No cloud, no API key, no tokens.

Usage:
    python spike_record_transcribe.py [seconds]     (default 15)

Talk while it records, and play a YouTube video / any audio so the "Caller"
(system) side has sound to capture. Ctrl+C stops early.
"""
import os
import sys
import time
import wave
import threading

SECONDS = next((int(a) for a in sys.argv[1:] if a.isdigit()), 15)
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "spike_out")
os.makedirs(OUT_DIR, exist_ok=True)
MIC_WAV = os.path.join(OUT_DIR, "me.wav")
SYS_WAV = os.path.join(OUT_DIR, "caller.wav")


def record():
    """Record the default mic and the default-speaker loopback to two WAVs,
    on two threads, for SECONDS seconds. Returns (mic_wav, sys_wav)."""
    import pyaudiowpatch as pyaudio

    p = pyaudio.PyAudio()
    wasapi = p.get_host_api_info_by_type(pyaudio.paWASAPI)

    # The "Caller": the default output device captured as a loopback input.
    out_info = p.get_device_info_by_index(wasapi["defaultOutputDevice"])
    loopback = None
    for lb in p.get_loopback_device_info_generator():
        if out_info["name"] in lb["name"]:
            loopback = lb
            break
    if loopback is None:
        raise RuntimeError("No WASAPI loopback found for the default speakers "
                           f"({out_info['name']}). Is anything playing audio?")

    # The "Me": the current default input device (auto-detect, like the Mac fix —
    # honors a plugged-in headset / USB mic, not a dead built-in).
    mic_info = p.get_device_info_by_index(wasapi["defaultInputDevice"])

    print(f"Me      : [{mic_info['index']}] {mic_info['name']}")
    print(f"Caller  : [{loopback['index']}] {loopback['name']} (system loopback)")

    def open_wav(path, ch, rate):
        w = wave.open(path, "wb")
        w.setnchannels(ch)
        w.setsampwidth(2)              # paInt16
        w.setframerate(int(rate))
        return w

    mic_ch = max(1, min(2, int(mic_info["maxInputChannels"]) or 1))
    lb_ch = max(1, min(2, int(loopback["maxInputChannels"]) or 2))
    mic_wf = open_wav(MIC_WAV, mic_ch, mic_info["defaultSampleRate"])
    lb_wf = open_wav(SYS_WAV, lb_ch, loopback["defaultSampleRate"])

    stop = threading.Event()
    errors = []

    def pump(dev_index, ch, rate, wf, label):
        try:
            stream = p.open(format=pyaudio.paInt16, channels=ch, rate=int(rate),
                            frames_per_buffer=1024, input=True,
                            input_device_index=dev_index)
        except Exception as e:                       # WASAPI format mismatch, etc.
            errors.append(f"{label}: could not open stream ({e})")
            return
        try:
            while not stop.is_set():
                wf.writeframes(stream.read(1024, exception_on_overflow=False))
        except Exception as e:
            errors.append(f"{label}: read failed ({e})")
        finally:
            try:
                stream.stop_stream()
                stream.close()
            except Exception:
                pass

    t_mic = threading.Thread(target=pump, args=(
        mic_info["index"], mic_ch, mic_info["defaultSampleRate"], mic_wf, "Me"), daemon=True)
    t_sys = threading.Thread(target=pump, args=(
        loopback["index"], lb_ch, loopback["defaultSampleRate"], lb_wf, "Caller"), daemon=True)
    t_mic.start()
    t_sys.start()

    print(f"\nRecording {SECONDS}s — talk, and play some audio for the 'Caller' "
          "side… (Ctrl+C to stop early)")
    try:
        time.sleep(SECONDS)
    except KeyboardInterrupt:
        print("\nstopping…")
    stop.set()
    t_mic.join(3)
    t_sys.join(3)
    mic_wf.close()
    lb_wf.close()
    p.terminate()
    for e in errors:
        print("  ! " + e)
    return MIC_WAV, SYS_WAV


def load_model():
    """faster-whisper, GPU if available else CPU. Returns (model, tag)."""
    import shutil
    from faster_whisper import WhisperModel
    # Only probe CUDA when an NVIDIA driver is actually installed — on this PC
    # the ctranslate2 CUDA probe access-violates (0xC0000005) instead of raising.
    try:
        if shutil.which("nvidia-smi") is None:
            raise RuntimeError("no NVIDIA driver (nvidia-smi not found)")
        m = WhisperModel("large-v3", device="cuda", compute_type="float16")
        return m, "CUDA / large-v3"
    except Exception as e:
        print(f"  (no usable GPU — {e}; using CPU)")
        # 'small' keeps CPU transcription reasonably quick for a spike;
        # the real app would pick by hardware, like the Mac RAM routing.
        return WhisperModel("small", device="cpu", compute_type="int8"), "CPU / small"


def transcribe(path, speaker, model):
    segs, _ = model.transcribe(path, beam_size=5, vad_filter=True)
    return [(s.start, speaker, s.text.strip()) for s in segs if s.text.strip()]


def main():
    if "--record-only" in sys.argv:
        record()
        return
    # On this PC, ctranslate2/onnxruntime access-violates (0xC0000005) whenever
    # it shares a process — or even a moment in time — with PortAudio. So record
    # in a subprocess, wait for it to fully exit, then transcribe here.
    import subprocess
    rc = subprocess.call([sys.executable, "-u", os.path.abspath(__file__),
                          "--record-only", str(SECONDS)])
    if rc != 0:
        raise SystemExit(rc)
    mic_wav, sys_wav = MIC_WAV, SYS_WAV
    print("\nLoading faster-whisper (first run downloads the model)…")
    model, tag = load_model()
    print(f"Transcribing on-device ({tag})…")
    rows = transcribe(mic_wav, "Me", model) + transcribe(sys_wav, "Caller", model)
    rows.sort(key=lambda r: r[0])

    print("\n================= TRANSCRIPT =================")
    if not rows:
        print("(nothing transcribed — did the mic/loopback capture any sound?)")
    for t, who, text in rows:
        print(f"[{int(t) // 60:02d}:{int(t) % 60:02d}] {who}: {text}")
    print("=============================================")
    print(f"\nAudio saved to:\n  {mic_wav}\n  {sys_wav}")
    print("\nIf you see your words under 'Me' and the played audio under 'Caller', "
          "the Windows port is proven — we move on to wiring the real app.")


if __name__ == "__main__":
    main()
