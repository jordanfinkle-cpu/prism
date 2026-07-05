"""Prism for Windows — app entry point.

pywebview (EdgeWebView2) window hosting ui.html, with a JS bridge to:
record (subprocess) → transcribe (faster-whisper) → notes (Ollama). 100% local.

Usage:
    python prism_app.py               normal launch
    python prism_app.py --selftest    open, wait a few seconds, close (CI smoke)
    <exe> --recorder <session_dir>    internal: recording subprocess
"""
import os
import subprocess
import sys
import time
import webbrowser

# --recorder must run before any heavyweight imports: this branch is the
# PortAudio process and must never load ctranslate2 (see recorder.py).
if "--recorder" in sys.argv:
    from recorder import recorder_main
    recorder_main(sys.argv[sys.argv.index("--recorder") + 1])
    sys.exit(0)

import webview  # noqa: E402

import engine   # noqa: E402
import store    # noqa: E402

# Frozen-build smoke test: `Prism.exe --smoke <dir-with-me.wav+caller.wav>`
# proves the bundled transcription + notes pipeline without opening a window.
if "--smoke" in sys.argv:
    import shutil
    if sys.stdout:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    src = sys.argv[sys.argv.index("--smoke") + 1]
    meta = store.create_session()
    for name in ("me.wav", "caller.wav"):
        shutil.copy(os.path.join(src, name), store.session_dir(meta["id"]))
    print(engine.transcribe_session(meta["id"]))
    print(engine.generate_notes(meta["id"]))
    store.delete_session(meta["id"])
    print("SMOKE OK")
    sys.exit(0)


def resource(name):
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, name)


def recorder_cmd(session_dir):
    if getattr(sys, "frozen", False):          # PyInstaller: re-exec ourselves
        return [sys.executable, "--recorder", session_dir]
    return [sys.executable, resource("prism_app.py"), "--recorder", session_dir]


class Api:
    """Everything the UI can call. pywebview runs each call on a worker
    thread, so blocking here (whisper, Ollama) doesn't freeze the window."""

    def __init__(self):
        self._rec_proc = None
        self._rec_sid = None
        self._rec_started = None

    # ---- recording -------------------------------------------------------
    def start_recording(self):
        if self._rec_proc is not None:
            return {"error": "Already recording."}
        meta = store.create_session()
        meta["title"] = time.strftime("Call — %b %d, %I:%M %p").replace("— 0", "— ")
        store.save_meta(meta["id"], meta)
        proc = subprocess.Popen(
            recorder_cmd(store.session_dir(meta["id"])),
            stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            text=True, encoding="utf-8",
            creationflags=subprocess.CREATE_NO_WINDOW)
        first = proc.stdout.readline().strip()   # device info or error
        import json
        info = json.loads(first) if first else {}
        if "error" in info:
            proc.kill()
            store.delete_session(meta["id"])
            return {"error": info["error"]}
        self._rec_proc, self._rec_sid = proc, meta["id"]
        self._rec_started = time.time()
        return {"session": meta, "devices": info}

    def stop_recording(self):
        if self._rec_proc is None:
            return {"error": "Not recording."}
        proc, sid = self._rec_proc, self._rec_sid
        self._rec_proc = self._rec_sid = None
        try:
            proc.stdin.write("stop\n")
            proc.stdin.flush()
            proc.wait(timeout=10)
        except (OSError, subprocess.TimeoutExpired):
            proc.kill()
        meta = store.load_meta(sid)
        meta["duration_s"] = int(time.time() - self._rec_started)
        store.save_meta(sid, meta)
        return {"session_id": sid}

    # ---- pipeline --------------------------------------------------------
    def transcribe(self, sid):
        try:
            return {"transcript": engine.transcribe_session(sid)}
        except Exception as e:
            return {"error": f"Transcription failed: {e}"}

    def generate(self, sid):
        try:
            return {"prism_notes": engine.generate_notes(sid)}
        except Exception as e:
            return {"error": f"Notes generation failed: {e}"}

    # ---- notes / library -------------------------------------------------
    def list_sessions(self):
        return store.list_sessions()

    def get_session(self, sid):
        return store.get_session(sid)

    def save_my_notes(self, sid, text):
        store.save_my_notes(sid, text)
        return {"ok": True}

    def rename_session(self, sid, title):
        meta = store.load_meta(sid)
        meta["title"] = (title or "").strip() or meta["title"]
        store.save_meta(sid, meta)
        return {"ok": True}

    def delete_session(self, sid):
        store.delete_session(sid)
        return {"ok": True}

    # ---- environment -----------------------------------------------------
    def ollama_status(self):
        return engine.ollama_status()

    def open_url(self, url):
        if url.startswith(("http://", "https://")):
            webbrowser.open(url)
        return {"ok": True}


def main():
    api = Api()
    window = webview.create_window(
        "Prism", resource("ui.html"), js_api=api,
        width=1120, height=760, min_size=(860, 600),
        background_color="#FFFFFF")
    if "--selftest" in sys.argv:
        def close_soon():
            time.sleep(6)
            window.destroy()
        import threading
        threading.Thread(target=close_soon, daemon=True).start()
    webview.start()
    # Never leave an orphaned recorder holding the mic after the window closes.
    if api._rec_proc is not None:
        api.stop_recording()


if __name__ == "__main__":
    main()
