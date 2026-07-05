; Prism for Windows — Inno Setup script.
;   Build the app first (build_win.ps1), then:
;   ISCC.exe installer.iss   ->  Output\Prism-Setup.exe
; Per-user install (no admin prompt), like Ollama — the app is unsigned, so
; keep friction low: SmartScreen warning is already one hurdle.

#define AppVersion "1.0.0"

[Setup]
AppId={{7E1B4A52-9C1E-4C6A-B7D1-PRISMWIN0100}
AppName=Prism
AppVersion={#AppVersion}
AppPublisher=Prism
AppPublisherURL=https://jordanfinkle-cpu.github.io/prism/
DefaultDirName={localappdata}\Programs\Prism
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputBaseFilename=Prism-Setup
SetupIconFile=prism.ico
UninstallDisplayIcon={app}\Prism.exe
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern

[Files]
Source: "dist\Prism\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{userprograms}\Prism"; Filename: "{app}\Prism.exe"
Name: "{userdesktop}\Prism"; Filename: "{app}\Prism.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; Flags: unchecked

[Run]
Filename: "{app}\Prism.exe"; Description: "{cm:LaunchProgram,Prism}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Recorded audio/notes stay in {localappdata}\Prism on purpose — the user's
; notes shouldn't vanish with an app update/reinstall.
