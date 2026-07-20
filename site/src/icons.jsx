// Brand + UI icons carried over from the app (ui-react/src/icons.jsx) so the
// site and the product stay visually identical.

export const Tri = ({ className, gradient }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {gradient && (
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7CF7C4" /><stop offset="0.25" stopColor="#4DD6E8" />
          <stop offset="0.5" stopColor="#6AA0FF" /><stop offset="0.7" stopColor="#9B7CFF" />
          <stop offset="0.85" stopColor="#E879C6" /><stop offset="1" stopColor="#F5D36B" />
        </linearGradient>
      </defs>
    )}
    <path d="M12 4.4 20.4 18.9H3.6z" fill={gradient ? 'url(#pg)' : 'currentColor'}
      stroke={gradient ? 'url(#pg)' : 'currentColor'} strokeWidth="3.2" strokeLinejoin="round" />
  </svg>
)

const S = ({ className, children, vb = '0 0 24 24', ...rest }) => (
  <svg className={className} viewBox={vb} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>{children}</svg>
)

export const SearchIcon = (p) => <S {...p}><circle cx="11" cy="11" r="5.75" /><path d="M15.3 15.3 19.5 19.5" /></S>
export const HomeIcon = (p) => (
  <S {...p}><rect x="4.5" y="4.5" width="6.2" height="6.2" rx="2" /><rect x="13.3" y="4.5" width="6.2" height="6.2" rx="2" />
    <rect x="4.5" y="13.3" width="6.2" height="6.2" rx="2" /><rect x="13.3" y="13.3" width="6.2" height="6.2" rx="2" /></S>
)
export const NotesIcon = (p) => <S {...p}><rect x="5" y="3.75" width="14" height="16.5" rx="3" /><path d="M9 8.5h6M9 12h6M9 15.5h3" /></S>
export const FolderClosedIcon = (p) => <S {...p}><path d="M4 7.75C4 6.5 5 5.5 6.25 5.5h3.4l2.1 2.4h6C19 7.9 20 8.9 20 10.15v6.1c0 1.25-1 2.25-2.25 2.25H6.25C5 18.5 4 17.5 4 16.25z" /></S>
export const FolderOpenIcon = (p) => <S {...p}><path d="M4 16.5V7.75C4 6.5 5 5.5 6.25 5.5h3.4l2.1 2.4h5.5C18.5 7.9 19.5 8.9 19.5 10.15M4 16.5l1.7-4.55c.3-.85 1.1-1.45 2-1.45h10.85c1.1 0 1.87 1.1 1.5 2.13l-1.32 3.8c-.3.9-1.15 1.52-2.1 1.52H5.6C4.7 17.95 4.05 17.3 4 16.5z" /></S>
export const MicIcon = (p) => (
  <S {...p}><rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" /><path d="M12 18v2.5" /></S>
)
export const PlusIcon = (p) => <S {...p}><path d="M12 5v14M5 12h14" /></S>
export const BellIcon = (p) => <S {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></S>
export const CameraIcon = (p) => <S {...p}><path d="M3 8.5A2 2 0 0 1 5 6.5h1.8L8.2 4.4h7.6l1.4 2.1H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle cx="12" cy="13" r="3.4" /></S>
export const CalendarIcon = (p) => <S {...p}><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 9.5h16M8 3v4M16 3v4" /></S>
export const WaveIcon = (p) => <S {...p}><path d="M3 12h2M7.5 8v8M12 4.5v15M16.5 8v8M19 12h2" /></S>
export const BoltIcon = (p) => <S {...p}><path d="M13 3 5 13.5h5L11 21l8-10.5h-5z" /></S>
export const PhoneIcon = (p) => <S {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.8" /><path d="M10.5 18.5h3" /></S>

export const AppleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.7-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)
export const WindowsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
)
