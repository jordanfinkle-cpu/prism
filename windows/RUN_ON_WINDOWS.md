# Prism for Windows — Step 1: prove it works on your PC

This is a small **feasibility spike**, not the app yet. It records you + your
system audio and transcribes both on-device. If it works, the full Windows port
is a green light.

> Written on a Mac; **it only runs on Windows** (WASAPI + faster-whisper are PC-only).

## Do this on your Windows PC

1. **Install Python 3.11 or 3.12** from python.org (tick *"Add python.exe to PATH"*).

2. **Copy this `windows` folder to the PC** (USB, OneDrive, or `git clone` once we
   put it in the repo).

3. **Open PowerShell in this folder** and install the two dependencies:
   ```powershell
   py -m pip install -r requirements-win.txt
   ```
   - CPU-only is fine. For speed on an **NVIDIA GPU**, also install a CUDA-enabled
     build (we'll wire this properly later): the spike auto-falls back to CPU if
     there's no usable GPU.

4. **Run it** (records 15 seconds by default):
   ```powershell
   py spike_record_transcribe.py
   ```
   While it records: **say a few sentences**, and **play a YouTube video** (or any
   audio) so the "Caller"/system side has something to capture.

5. **Read the transcript** it prints. Then paste the whole console output back to
   me — especially:
   - the `Me :` and `Caller :` device lines,
   - whether your words show up under **Me**,
   - whether the played audio shows up under **Caller**,
   - any errors (WASAPI format mismatch, no loopback, CUDA, etc.).

## What I'm checking with this
- **WASAPI loopback** captures system audio with no virtual cable (the Mac needed
  BlackHole; Windows shouldn't).
- **Mic auto-detect** picks your real input (headset/USB), same idea as the Mac fix.
- **faster-whisper** transcribes locally at usable speed/quality on your hardware.

## Known things that might need a tweak on first run
- **WASAPI format mismatch** when opening a stream — some devices reject the
  default rate/channels. If you see `could not open stream`, send me the device
  names + the error and I'll pin the exact format.
- **First run downloads the Whisper model** (a few hundred MB to ~3 GB for
  large-v3) — that's normal, one time.
- **GPU**: if CUDA isn't set up, it prints a note and uses CPU. Fine for the spike.

Once this prints a clean two-speaker transcript, Step 2 is wiring it into the real
`ui.html` + local-LLM notes, then Step 3 packages it into `Prism-Setup.exe`.
