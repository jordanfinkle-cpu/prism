"""Prism for Windows — recording subprocess.

Runs as `Prism.exe --recorder <session_dir>` (or the same via python). Captures
the default mic ("Me") and the WASAPI loopback of the default speakers
("Caller") to two WAVs until a line arrives on stdin, then exits cleanly.

This is a separate process on purpose: PortAudio must never share a process
with ctranslate2 on some PCs (access violation), and a crash here can't take
the app down mid-call.
"""
import json
import os
import sys
import threading
import wave


def recorder_main(out_dir):
    import pyaudiowpatch as pyaudio

    mic_wav = os.path.join(out_dir, "me.wav")
    sys_wav = os.path.join(out_dir, "caller.wav")

    p = pyaudio.PyAudio()
    wasapi = p.get_host_api_info_by_type(pyaudio.paWASAPI)

    out_info = p.get_device_info_by_index(wasapi["defaultOutputDevice"])
    loopback = None
    for lb in p.get_loopback_device_info_generator():
        if out_info["name"] in lb["name"]:
            loopback = lb
            break
    if loopback is None:
        print(json.dumps({"error": "No WASAPI loopback for the default "
                                   f"speakers ({out_info['name']})"}), flush=True)
        sys.exit(2)

    mic_info = p.get_device_info_by_index(wasapi["defaultInputDevice"])
    print(json.dumps({"me": mic_info["name"], "caller": loopback["name"]}),
          flush=True)

    def open_wav(path, ch, rate):
        w = wave.open(path, "wb")
        w.setnchannels(ch)
        w.setsampwidth(2)              # paInt16
        w.setframerate(int(rate))
        return w

    mic_ch = max(1, min(2, int(mic_info["maxInputChannels"]) or 1))
    lb_ch = max(1, min(2, int(loopback["maxInputChannels"]) or 2))
    mic_wf = open_wav(mic_wav, mic_ch, mic_info["defaultSampleRate"])
    lb_wf = open_wav(sys_wav, lb_ch, loopback["defaultSampleRate"])

    stop = threading.Event()

    def pump(dev_index, ch, rate, wf, label):
        try:
            stream = p.open(format=pyaudio.paInt16, channels=ch, rate=int(rate),
                            frames_per_buffer=1024, input=True,
                            input_device_index=dev_index)
        except Exception as e:          # WASAPI format mismatch, device gone…
            print(json.dumps({"error": f"{label}: could not open stream ({e})"}),
                  flush=True)
            return
        try:
            while not stop.is_set():
                wf.writeframes(stream.read(1024, exception_on_overflow=False))
        finally:
            try:
                stream.stop_stream()
                stream.close()
            except Exception:
                pass

    threads = [
        threading.Thread(target=pump, args=(mic_info["index"], mic_ch,
                         mic_info["defaultSampleRate"], mic_wf, "Me"), daemon=True),
        threading.Thread(target=pump, args=(loopback["index"], lb_ch,
                         loopback["defaultSampleRate"], lb_wf, "Caller"), daemon=True),
    ]
    for t in threads:
        t.start()

    sys.stdin.readline()               # parent writes a line to stop us
    stop.set()
    for t in threads:
        t.join(3)
    mic_wf.close()
    lb_wf.close()
    p.terminate()
    print(json.dumps({"stopped": True}), flush=True)
