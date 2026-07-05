r"""Prism for Windows — session storage.

Everything lives under %LOCALAPPDATA%\Prism, one folder per note/session:
    sessions/<id>/me.wav, caller.wav   raw call audio (deletable any time)
    sessions/<id>/transcript.txt       [MM:SS] Who: text lines
    sessions/<id>/my_notes.md          the user's own bullets — never AI-touched
    sessions/<id>/prism_notes.md       the generated notes
    sessions/<id>/meta.json            {id, title, created, duration_s}
"""
import json
import os
import shutil
import time

DATA_DIR = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~")), "Prism")
SESSIONS_DIR = os.path.join(DATA_DIR, "sessions")
MODELS_DIR = os.path.join(DATA_DIR, "models")


def _ensure():
    os.makedirs(SESSIONS_DIR, exist_ok=True)
    os.makedirs(MODELS_DIR, exist_ok=True)


def session_dir(sid):
    return os.path.join(SESSIONS_DIR, sid)


def create_session():
    _ensure()
    sid = time.strftime("%Y%m%d-%H%M%S")
    d = session_dir(sid)
    os.makedirs(d, exist_ok=True)
    meta = {"id": sid, "title": "New call", "created": time.time(), "duration_s": 0}
    save_meta(sid, meta)
    return meta


def save_meta(sid, meta):
    with open(os.path.join(session_dir(sid), "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f)


def load_meta(sid):
    with open(os.path.join(session_dir(sid), "meta.json"), encoding="utf-8") as f:
        return json.load(f)


def _read(sid, name):
    p = os.path.join(session_dir(sid), name)
    if os.path.exists(p):
        with open(p, encoding="utf-8") as f:
            return f.read()
    return ""


def _write(sid, name, text):
    with open(os.path.join(session_dir(sid), name), "w", encoding="utf-8") as f:
        f.write(text)


def get_session(sid):
    meta = load_meta(sid)
    meta["transcript"] = _read(sid, "transcript.txt")
    meta["my_notes"] = _read(sid, "my_notes.md")
    meta["prism_notes"] = _read(sid, "prism_notes.md")
    return meta


def save_my_notes(sid, text):
    _write(sid, "my_notes.md", text)


def save_prism_notes(sid, text):
    _write(sid, "prism_notes.md", text)


def save_transcript(sid, text):
    _write(sid, "transcript.txt", text)


def list_sessions():
    _ensure()
    out = []
    for sid in sorted(os.listdir(SESSIONS_DIR), reverse=True):
        try:
            out.append(load_meta(sid))
        except (OSError, ValueError):
            continue
    return out


def delete_session(sid):
    shutil.rmtree(session_dir(sid), ignore_errors=True)
