# Step 4 results — Prism-Setup.exe, shipped

**Verdict: SHIPPED.** The Windows installer is built, tested on this PC, and
live on the download site.

- Installer: **Prism-Setup.exe, 71 MB** (PyInstaller onedir → Inno Setup, lzma2)
- Release: https://github.com/jordanfinkle-cpu/prism/releases/tag/win-v1.0.0
- Direct link: https://github.com/jordanfinkle-cpu/prism/releases/download/win-v1.0.0/Prism-Setup.exe
- Site: "Download for Windows" added to the hero and download band, plus a
  SmartScreen/Ollama first-run note. `version-win.json` added alongside
  `version.json` for a future Windows update check.
- The release is **not marked latest** on purpose — `releases/latest/download/Prism.dmg`
  (the Mac button and `version.json`) still resolves to the Mac release.

## Build pipeline (repeatable)

```
cd windows\app
powershell -File build_win.ps1 -Python <python-with-deps>   # → dist\Prism\  (275 MB)
ISCC.exe installer.iss                                      # → Output\Prism-Setup.exe (71 MB)
```

- PyInstaller: onedir + windowed; `--collect-all ctranslate2`,
  `--collect-data faster_whisper`; excludes torch/Qt/scipy/llvmlite etc.
  (the first build was 572 MB because PyInstaller vacuumed up unrelated conda
  packages; the excludes in `build_win.ps1` cut it to 275 MB).
- Inno Setup: per-user install (`{localappdata}\Programs\Prism`, no admin
  prompt), Start-menu shortcut, optional desktop icon. Uninstall keeps
  `%LOCALAPPDATA%\Prism` (the user's notes/audio survive reinstalls).

## Verification on this PC (all passed)

1. Frozen `Prism.exe --selftest` → window opens, exit 0.
2. Frozen `Prism.exe --smoke <wavs>` → full pipeline in the shipped binary:
   transcribed Step 1's real recordings + generated notes via Ollama, exit 0.
3. Frozen `Prism.exe --recorder` → devices detected, mic audio captured.
4. `Prism-Setup.exe /VERYSILENT` → installed to `%LOCALAPPDATA%\Programs\Prism`,
   installed copy passes `--selftest`. Left installed on Jordan's PC.

## Known limitations / calls made (flag if you disagree)

- **Unsigned.** No code-signing cert (that needs Jordan + money), so
  SmartScreen warns on first run. The site and release notes explain
  "More info → Run anyway". Same situation as the unsigned Mac beta.
- **Ollama is not bundled.** The installer stays 71 MB; the app detects a
  missing Ollama/model and shows the two setup steps in a banner. Bundling
  Ollama + a 2 GB model into the installer felt wrong for a beta.
- **Whisper model downloads on first transcription** (~460 MB for `small`),
  to `%LOCALAPPDATA%\Prism\models`.
- Installed via winget on this PC during the build: **Inno Setup 6**
  (user-level). GitHub CLI was *not* installed (winget kept stalling);
  pushes/API used the Git Credential Manager credential Jordan approved.

## Suggested next steps (Mac Claude / Jordan)

- Real-call acceptance test on Jordan's PC (see step3.md caveat).
- Decide on code signing (or an MSIX/store route) to kill the SmartScreen warning.
- Wire an update check against `version-win.json`.
- Consider `large-v3`/GPU routing once a machine with an NVIDIA driver shows up.
