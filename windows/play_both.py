"""Play two WAVs to two specific output devices at once (test-rig for the spike).

Usage: python play_both.py <delay_seconds>
  me_source.wav     -> Realtek speakers (Stereo Mix hears this = "Me")
  caller_source.wav -> default output / monitor (loopback hears this = "Caller")
"""
import os
import sys
import time
import wave
import threading

import pyaudiowpatch as pyaudio

HERE = os.path.dirname(os.path.abspath(__file__))
DELAY = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0

p = pyaudio.PyAudio()
wasapi = p.get_host_api_info_by_type(pyaudio.paWASAPI)
default_out = wasapi["defaultOutputDevice"]

# Find the Realtek render device (the endpoint Stereo Mix monitors).
realtek_out = None
for i in range(wasapi["deviceCount"]):
    d = p.get_device_info_by_host_api_device_index(wasapi["index"], i)
    if d["maxOutputChannels"] > 0 and "Realtek" in d["name"]:
        realtek_out = d["index"]
        break
if realtek_out is None:
    sys.exit("No Realtek output device found")

def play(path, dev_index, label):
    wf = wave.open(path, "rb")
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(), rate=wf.getframerate(),
                    output=True, output_device_index=dev_index)
    print(f"{label}: playing {os.path.basename(path)} -> device {dev_index}")
    data = wf.readframes(1024)
    while data:
        stream.write(data)
        data = wf.readframes(1024)
    stream.stop_stream()
    stream.close()
    wf.close()

time.sleep(DELAY)
threads = [
    threading.Thread(target=play, args=(
        os.path.join(HERE, "spike_out", "me_source.wav"), realtek_out, "Me-sim")),
    threading.Thread(target=play, args=(
        os.path.join(HERE, "spike_out", "caller_source.wav"), default_out, "Caller-sim")),
]
for t in threads:
    t.start()
for t in threads:
    t.join()
p.terminate()
print("playback done")
