import pyaudiowpatch as pa

p = pa.PyAudio()
w = p.get_host_api_info_by_type(pa.paWASAPI)
print("default in :", w["defaultInputDevice"], "| default out:", w["defaultOutputDevice"])
for i in range(w["deviceCount"]):
    d = p.get_device_info_by_host_api_device_index(w["index"], i)
    print(f"[{d['index']:2d}] in={d['maxInputChannels']} out={d['maxOutputChannels']} "
          f"rate={int(d['defaultSampleRate'])} {d['name']}")
p.terminate()
