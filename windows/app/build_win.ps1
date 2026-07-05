# Prism for Windows — build the frozen app with PyInstaller.
#   powershell -File build_win.ps1 [-Python <path-to-python.exe>]
# Output: dist\Prism\Prism.exe (onedir — reliable with ctranslate2's DLLs)
param([string]$Python = "python")

Set-Location $PSScriptRoot
& $Python -m PyInstaller --noconfirm --clean --windowed --name Prism `
    --icon prism.ico `
    --add-data "ui.html;." `
    --collect-data faster_whisper `
    --collect-all ctranslate2 `
    --exclude-module torch --exclude-module torchvision --exclude-module torchaudio `
    --exclude-module matplotlib --exclude-module PIL --exclude-module tkinter `
    --exclude-module llvmlite --exclude-module numba --exclude-module scipy `
    --exclude-module PyQt5 --exclude-module PySide6 --exclude-module qtpy `
    --exclude-module IPython --exclude-module pandas `
    prism_app.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Built dist\Prism\Prism.exe"
