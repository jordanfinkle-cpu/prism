import { Accordion, Button, Card, Chip, Kbd, Separator } from '@heroui/react'
import { ChevronDown } from '@gravity-ui/icons'
import Mockup from './Mockup.jsx'
import {
  Tri, SearchIcon, MicIcon, BellIcon, CameraIcon, CalendarIcon, WaveIcon, BoltIcon,
  NotesIcon, AppleIcon, WindowsIcon, PhoneIcon,
} from './icons.jsx'

// Button rendered as a real <a> so anchors + downloads keep native semantics.
const asLink = (href) => (props) => <a href={href} {...props} />

const DL = {
  mac: 'https://github.com/jordanfinkle-cpu/prism/releases/latest/download/Prism.dmg',
  win: 'https://github.com/jordanfinkle-cpu/prism/releases/latest/download/Prism-Setup.exe',
  phone: 'https://jordanfinkle-cpu.github.io/prism-phone/',
}

/* ============================= banner + nav ============================= */

function Banner() {
  return (
    <div className="flex items-center justify-center gap-2.5 border-b border-border px-5 py-2.5 text-[13px] text-muted" style={{ background: 'var(--background-secondary)' }}>
      <Tri className="size-3 shrink-0" />
      <span className="text-foreground/80">Prism 2.0 is here — now a 4&nbsp;MB download. Free during beta.</span>
      <a href="#download" className="font-semibold text-foreground no-underline hover:underline">Download ›</a>
    </div>
  )
}

function Nav() {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center gap-7 px-6 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 text-foreground no-underline">
          <Tri className="size-[26px]" />
          <span className="text-[15.5px] font-semibold tracking-tight">Prism</span>
        </a>
        <div className="flex-1" />
        <nav className="flex items-center gap-6">
          <a href="#how" className="hidden text-[14px] text-muted no-underline hover:text-foreground sm:block">How it works</a>
          <a href="#features" className="hidden text-[14px] text-muted no-underline hover:text-foreground sm:block">Features</a>
          <a href="#faq" className="hidden text-[14px] text-muted no-underline hover:text-foreground sm:block">FAQ</a>
          <Button size="sm" render={asLink('#download')}>Download</Button>
        </nav>
      </div>
    </div>
  )
}

/* ================================= hero ================================= */

function Hero() {
  return (
    <div id="top" className="px-6 pt-24 text-center sm:px-8">
      <h1 className="mx-auto max-w-[760px] text-[40px] font-semibold leading-[1.06] tracking-[-0.028em] text-foreground [text-wrap:balance] md:text-[58px]">
        Your meetings, written&nbsp;up.
      </h1>
      <p className="mx-auto mt-6 max-w-[600px] text-[19px] leading-[1.55] text-muted [text-wrap:pretty]">
        Prism records when you ask, follows along while you jot, and writes the clean version
        beneath your notes — without ever touching a word you wrote.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
        <Button size="lg" render={asLink('#download')}>Download</Button>
        <Button size="lg" variant="secondary" render={asLink('#how')}>See how it works</Button>
      </div>
      <div className="mt-4 text-[12.5px] text-muted/80">
        Free during beta · Windows 10/11 · macOS 13+ (Apple silicon) · iPhone companion
      </div>
      <Mockup />
    </div>
  )
}

/* ============================== principles ============================== */

function Principles() {
  const items = [
    ['RECORDS ON DEMAND', <>Prism only listens when you press record. No bots joining calls, no surprise transcripts.</>],
    ['NEVER REWRITES YOU', <>Every note has two parts: <b className="font-semibold text-foreground/80">My notes</b>, which only you edit, and <b className="font-semibold text-foreground">▲ Prism notes</b>, written for you the moment a call ends.</>],
    ['FREE DURING BETA', <>No card, no subscription, no per-seat pricing. Download it, sign in with your email, and take notes.</>],
  ]
  return (
    <div className="mx-auto max-w-[1100px] px-6 pt-24 sm:px-8">
      <div className="grid gap-10 md:grid-cols-3 md:gap-14">
        {items.map(([t, body]) => (
          <div key={t}>
            <div className="mb-3 text-[11.5px] font-semibold tracking-[0.06em] text-foreground">{t}</div>
            <p className="text-[15px] leading-relaxed text-muted [text-wrap:pretty]">{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================ how it works ============================== */

function StepCard({ step, title, children, visual }) {
  return (
    <Card variant="secondary" className="gap-0 overflow-hidden p-0">
      <div className="relative h-[230px] overflow-hidden">{visual}</div>
      <div className="px-6 pb-7 pt-5">
        <div className="mb-1.5 text-[12px] text-muted/80">Step {step}</div>
        <Card.Title className="mb-2 text-[17px]">{title}</Card.Title>
        <Card.Description className="text-[14px] leading-relaxed [text-wrap:pretty]">{children}</Card.Description>
      </div>
    </Card>
  )
}

const MiniPanel = ({ className = '', children }) => (
  <div className={'absolute rounded-xl border border-border bg-background p-4 shadow-[0_10px_30px_rgba(40,35,25,.08)] ' + className}>{children}</div>
)

function HowItWorks() {
  return (
    <div id="how" className="mx-auto max-w-[1100px] px-6 pt-32 sm:px-8">
      <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] md:text-[34px]">How it works</h2>
      <p className="mx-auto mt-3.5 max-w-[480px] text-center text-[16.5px] leading-[1.55] text-muted">
        You keep taking notes the way you always have. Prism does the busywork.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">

        <StepCard step={1} title="Jot while you talk" visual={
          <MiniPanel className="-right-10 left-5 top-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.04em] text-danger">
                <span className="pulse-soft size-1.5 rounded-full bg-danger" />RECORDING
              </span>
              <span className="text-[10.5px] text-muted/80">12:34</span>
            </div>
            <div className="mb-2 text-[9px] font-semibold tracking-[0.04em]">MY NOTES</div>
            <div className="mb-1.5 flex gap-2 text-[11.5px] leading-relaxed"><span className="text-muted/50">•</span><span>budget approved — final number friday</span></div>
            <div className="mb-3 flex gap-2 text-[11.5px] leading-relaxed"><span className="text-muted/50">•</span>
              <span>launch moving up two wks<span className="blink ml-0.5 inline-block h-3 w-0.5 -mb-0.5 bg-foreground align-middle" /></span>
            </div>
            <Separator className="mb-2.5" />
            <div className="mb-1.5 text-[9px] font-semibold tracking-[0.04em] text-muted">LIVE TRANSCRIPT</div>
            <div className="text-[10px] leading-relaxed text-muted"><b className="font-semibold text-foreground/60">Dana:</b> …let's move the launch up two weeks if the budget clears.</div>
          </MiniPanel>
        }>
          Type quick, messy bullets during the call. Prism captures the transcript and audio
          alongside — and you can watch the transcript roll in live.
        </StepCard>

        <StepCard step={2} title="Stop — notes write themselves" visual={
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Button className="pointer-events-none shadow-[0_12px_32px_rgba(26,26,25,.28)]">Stop recording</Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted/90">
                <Tri className="pulse-soft size-3 text-foreground" />Combining your notes, transcript &amp; audio…
              </div>
            </div>
          </div>
        }>
          One press when the call ends and your notes are written on the spot — usually in
          seconds. Regenerate any time.
        </StepCard>

        <StepCard step={3} title="Two tabs, one note" visual={
          <MiniPanel className="-right-10 left-5 top-6">
            <div className="mb-2.5 inline-flex rounded-full bg-foreground/5 p-0.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1.5 text-[9.5px] font-semibold shadow-[0_1px_3px_rgba(0,0,0,.12)]">
                <Tri className="size-2" /> Prism notes
              </span>
              <span className="inline-flex items-center px-2.5 py-1.5 text-[9.5px] font-semibold text-muted">My notes</span>
            </div>
            <div className="mb-1.5 text-[10px] font-semibold">Summary</div>
            <div className="mb-1.5 flex gap-2 text-[11.5px] leading-relaxed"><span className="text-muted/50">•</span><span>The launch moves up two weeks; the budget clears Friday.</span></div>
            <div className="mb-1.5 mt-2.5 text-[10px] font-semibold">Action items</div>
            <div className="mb-1.5 flex items-start gap-2 text-[11.5px] leading-relaxed"><span className="mt-0.5 size-[11px] shrink-0 rounded border-[1.5px] border-border" /><span>Send Jeffrey the revised timeline by Friday.</span></div>
            <div className="flex items-start gap-2 text-[11.5px] leading-relaxed"><span className="mt-0.5 size-[11px] shrink-0 rounded border-[1.5px] border-border" /><span>Book the follow-up for Thursday at 2 PM.</span></div>
          </MiniPanel>
        }>
          <b className="font-semibold text-foreground/80">My notes</b> stays exactly as you typed
          it. <b className="font-semibold text-foreground">▲ Prism notes</b> is the clean write-up —
          watch it write itself, transcript attached.
        </StepCard>
      </div>
    </div>
  )
}

/* =============================== features =============================== */

function NoteRow({ icon, title, folder, time, last }) {
  return (
    <div className={'flex items-center gap-2.5 py-2 ' + (last ? '' : 'border-b border-border/60')}>
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md text-muted" style={{ background: 'var(--surface-tertiary)' }}>{icon}</span>
      <div className="min-w-0 flex-1 truncate text-[12px] font-medium">{title}</div>
      <Chip size="sm" className="text-[9px]">{folder}</Chip>
      <span className="whitespace-nowrap text-[10px] text-muted/80">{time}</span>
    </div>
  )
}

function Features() {
  return (
    <div id="features" className="mx-auto max-w-[1100px] px-6 pt-28 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">

        <Card variant="secondary" className="gap-0 overflow-hidden p-0">
          <div className="relative h-[250px] overflow-hidden">
            <MiniPanel className="left-6 right-6 top-6 px-5">
              <div className="mb-2 flex items-baseline justify-between">
                <div className="text-[14px] font-semibold">All notes</div>
                <span className="text-[10px] text-muted/80">Sort: Recent ▾</span>
              </div>
              <div className="mb-0.5 text-[10px] text-muted/80">Today</div>
              <NoteRow icon={<NotesIcon className="size-3" />} title="Meeting with boss" folder="Work" time="9:20 AM" />
              <NoteRow icon={<span className="text-[10px] font-semibold">T</span>} title="Call with Jeffrey" folder="Clients" time="8:05 AM" />
              <div className="mb-0.5 mt-2 text-[10px] text-muted/80">Tue, Jun 23</div>
              <NoteRow last icon={<NotesIcon className="size-3" />} title="Quarterly budget review" folder="Work" time="4:16 PM" />
            </MiniPanel>
          </div>
          <div className="px-7 pb-8 pt-6">
            <Card.Title className="mb-2 text-[18px]">Every meeting in one place</Card.Title>
            <Card.Description className="max-w-[400px] text-[14.5px] leading-relaxed [text-wrap:pretty]">
              All notes gathers your whole workspace into one list — organized by day, with folders
              and sub-folders to keep it tidy.
            </Card.Description>
          </div>
        </Card>

        <Card variant="secondary" className="gap-0 overflow-hidden p-0">
          <div className="relative h-[250px] overflow-hidden">
            <MiniPanel className="left-6 right-6 top-6 px-5 pt-5">
              <div className="mb-4 text-[14px] font-semibold">Coming up</div>
              <div className="flex gap-4">
                <div className="w-11 shrink-0">
                  <div className="text-[20px] font-medium leading-none">26</div>
                  <div className="mt-1 text-[10px] font-medium">June</div>
                  <div className="text-[10px] text-muted/80">Fri</div>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between gap-2.5">
                    <div>
                      <div className="text-[12.5px] font-medium">Call with Jeffrey</div>
                      <div className="mt-0.5 text-[10.5px] text-muted/80">10:30 – 11:00 AM</div>
                    </div>
                    <Button size="sm" className="pointer-events-none h-7 gap-1.5 px-2.5 text-[10px]">
                      <span className="size-[5px] rounded-full bg-danger" />Record
                    </Button>
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium">Team standup</div>
                    <div className="mt-0.5 text-[10.5px] text-muted/80">1:00 – 1:20 PM</div>
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium">Dentist appointment</div>
                    <div className="mt-0.5 text-[10.5px] text-muted/80">5:30 – 6:00 PM</div>
                  </div>
                </div>
              </div>
            </MiniPanel>
          </div>
          <div className="px-7 pb-8 pt-6">
            <div className="mb-2 flex items-center gap-2.5">
              <Card.Title className="text-[18px]">Your day, ready to record</Card.Title>
              <Chip size="sm">Coming soon on Windows</Chip>
            </div>
            <Card.Description className="max-w-[400px] text-[14.5px] leading-relaxed [text-wrap:pretty]">
              Connect your calendar and Home shows just what's next — every meeting one press from
              a note.
            </Card.Description>
          </div>
        </Card>
      </div>

      <p className="mx-auto mt-14 max-w-[560px] text-center text-[14.5px] leading-relaxed text-muted/80 [text-wrap:pretty]">
        Recording is always visible while it's happening. Everything you capture stays in your own
        workspace, deletable any time.
      </p>
    </div>
  )
}

/* ============================= capabilities ============================= */

function CapCard({ icon, title, children }) {
  return (
    <Card className="p-6 pb-7">
      <span className="mb-2 inline-flex size-10 items-center justify-center rounded-xl" style={{ background: 'var(--surface-tertiary)' }}>{icon}</span>
      <Card.Title className="mb-1 text-[16.5px]">{title}</Card.Title>
      <Card.Description className="text-[14px] leading-relaxed [text-wrap:pretty]">{children}</Card.Description>
    </Card>
  )
}

function Capabilities() {
  return (
    <div id="more" className="mx-auto max-w-[1100px] px-6 pt-32 sm:px-8">
      <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] md:text-[34px]">More than a recorder</h2>
      <p className="mx-auto mt-3.5 max-w-[520px] text-center text-[16.5px] leading-[1.55] text-muted">
        Small things that add up to notes you can actually trust — and never have to chase.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CapCard icon={<BellIcon className="size-[19px]" />} title="It notices your calls">
          A card slides in the moment a meeting starts. One click to record — and it stops itself
          when you hang up.
        </CapCard>
        <CapCard icon={<MicIcon className="size-[19px]" />} title="Hears both sides">
          Captures your mic and the meeting audio together — Zoom, Meet, Teams, a phone call, or
          the room. Nothing said gets missed.
        </CapCard>
        <CapCard icon={<WaveIcon className="size-[19px]" />} title="Follows along live">
          A live transcript rolls in while the call is still happening, so you can watch the
          conversation take shape beside your notes.
        </CapCard>
        <CapCard icon={<CameraIcon className="size-[19px]" />} title="Reads your handwriting">
          Snap a whiteboard or a page of handwritten notes and Prism folds what it says straight
          into the note.
        </CapCard>
        <CapCard icon={<SearchIcon className="size-[19px]" />} title="Finds anything fast">
          Search every word across all your notes, transcripts, and summaries — one{' '}
          <Kbd className="align-middle text-[11px]"><Kbd.Abbr keyValue="ctrl" /><Kbd.Content>K</Kbd.Content></Kbd>{' '}
          away.
        </CapCard>
        <CapCard icon={<BoltIcon className="size-[19px]" />} title="Installs in a blink">
          The whole app is a 4&nbsp;MB download. Run the installer, sign in, and you're taking
          notes a minute later.
        </CapCard>
      </div>
    </div>
  )
}

/* =============================== privacy ================================ */

function Privacy() {
  const cols = [
    ['No bots, ever', 'Prism never joins a meeting. It records from your own device, and only while a visible recording indicator is on.'],
    ['A private account, not a data pool', 'On Windows, transcription and the write-up run through your own signed-in account — audio is processed securely, then discarded, and Prism keeps no copy on its servers. On Mac, everything runs on-device.'],
    ['Yours to keep or delete', 'Every recording and note lives in your own workspace. Delete anything whenever you like.'],
  ]
  return (
    <div id="private" className="mt-32 border-y border-border px-6 py-24 sm:px-8" style={{ background: 'var(--background-secondary)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <div className="mb-3.5 text-[11.5px] font-semibold tracking-[0.08em] text-muted/80">PRIVATE BY DESIGN</div>
          <h2 className="text-[30px] font-semibold tracking-[-0.02em] [text-wrap:balance] md:text-[34px]">
            Your meetings are nobody's business.
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[16.5px] leading-[1.55] text-muted [text-wrap:pretty]">
            Nothing ever joins your calls, recording is always visible, and your notes live on
            your machine.
          </p>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          {cols.map(([t, body]) => (
            <div key={t}>
              <div className="mb-2 text-[15.5px] font-semibold">{t}</div>
              <p className="text-[14.5px] leading-relaxed text-muted [text-wrap:pretty]">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-[13.5px] text-muted/80">
          Signed out, notes never leave your device. Sign in and they sync privately across your
          devices — nobody else's.
        </p>
      </div>
    </div>
  )
}

/* =============================== devices ================================ */

function DeviceCard({ icon, name, children }) {
  return (
    <Card variant="secondary" className="items-center p-8 text-center">
      <span className="mb-2 inline-flex size-12 items-center justify-center rounded-[13px] border border-border bg-background">{icon}</span>
      <Card.Title className="mb-1 text-[16.5px]">{name}</Card.Title>
      <Card.Description className="text-[14px] leading-relaxed [text-wrap:pretty]">{children}</Card.Description>
    </Card>
  )
}

function Devices() {
  return (
    <div id="devices" className="mx-auto max-w-[1100px] px-6 pt-32 sm:px-8">
      <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] md:text-[34px]">Wherever you take the call</h2>
      <p className="mx-auto mt-3.5 max-w-[520px] text-center text-[16.5px] leading-[1.55] text-muted">
        Mac, Windows, and iPhone — the same notes, kept in step. Sign in once and they follow you.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <DeviceCard icon={<AppleIcon className="size-[22px]" />} name="Mac">
          Lives in your menu bar. Records, transcribes, and writes every note entirely on-device.
        </DeviceCard>
        <DeviceCard icon={<WindowsIcon className="size-5" />} name="Windows">
          Prism 2.0 is a 4&nbsp;MB installer — sign in and go. Notes are written through your
          private account in seconds.
        </DeviceCard>
        <DeviceCard icon={<PhoneIcon className="size-5" />} name="iPhone">
          A web app you add to your Home Screen. Snap notes and photos on the go — they land in
          your notes back home.
        </DeviceCard>
      </div>
      <p className="mx-auto mt-11 max-w-[560px] text-center text-[14.5px] leading-relaxed text-muted/80 [text-wrap:pretty]">
        Sign in with your email and your notes, folders, and photos stay in sync across all three.
        Signed out, everything stays on that one device.
      </p>
    </div>
  )
}

/* ================================= faq ================================== */

const FAQ_ITEMS = [
  ['Is Prism free?',
    "Yes — free while it's in beta. No card and no subscription. On Windows you sign in with just your email; on Mac you don't even need an account."],
  ['Does my audio go to the cloud?',
    'On Mac, no — recording, transcription, and the write-up all happen on-device. On Windows, Prism 2.0 transcribes and writes notes through your private account: audio is processed securely, then discarded. Prism keeps no copy of your audio on any server.'],
  ['Does it work offline?',
    "Recording and your typed notes always work offline. The Mac app writes the clean notes offline too. On Windows the write-up needs a connection — if you're offline, Prism finishes the note the next time it's online."],
  ['Does it join meetings like a bot?',
    'Never. Prism notices a call and offers to record from your own device with one click. Nothing ever joins your meeting.'],
  ['What can it record?',
    'Anything you can hear on your machine — Zoom, Meet, Teams, a phone call, or a conversation in the room. Only when you press record.'],
  ['Do I need to install anything else?',
    "No. The Windows installer is about 4 MB and includes everything. On Mac it's a single app in your menu bar."],
  ['Why does Windows warn me when I install?',
    'Prism is a free app distributed outside the Microsoft Store, so SmartScreen shows a one-time warning. Click "More info", then "Run anyway" — it installs normally after that.'],
  ['How does syncing work?',
    'Sign in with your email and your notes, folders, and photos stay in sync across Mac, Windows, and iPhone. Signed out, everything stays only on your device.'],
]

function Faq() {
  return (
    <div id="faq" className="mx-auto max-w-[760px] px-6 pt-32 sm:px-8">
      <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] md:text-[34px]">Questions, answered</h2>
      <Accordion className="mt-12 w-full" variant="surface">
        {FAQ_ITEMS.map(([title, content]) => (
          <Accordion.Item key={title}>
            <Accordion.Heading>
              <Accordion.Trigger>
                {title}
                <Accordion.Indicator><ChevronDown /></Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>{content}</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

/* =============================== download =============================== */

function Download() {
  return (
    <div id="download" className="mt-32 px-6 py-24 text-center sm:px-8" style={{ background: 'var(--ink)' }}>
      <Tri gradient className="mx-auto mb-6 size-11" />
      <h2 className="text-[32px] font-semibold tracking-[-0.022em] text-white [text-wrap:balance] md:text-[38px]">
        Bring Prism to your next call.
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Button size="lg" render={asLink(DL.win)}
          className="gap-2.5 bg-white text-[#1A1A19] hover:bg-[#e9e9e7]">
          <WindowsIcon className="size-[15px]" />Download for Windows
        </Button>
        <Button size="lg" variant="secondary" render={asLink(DL.mac)}
          className="gap-2.5 border-white/35 bg-transparent text-white hover:bg-white/10">
          <AppleIcon className="size-[17px]" />Download for Mac
        </Button>
        <Button size="lg" variant="secondary" render={asLink(DL.phone)}
          className="gap-2.5 border-white/35 bg-transparent text-white hover:bg-white/10">
          <PhoneIcon className="size-[15px]" />Get for iPhone
        </Button>
      </div>
      <div className="mt-5 text-[12.5px] text-white/55">
        Free during beta · Windows 10/11 — a 4&nbsp;MB installer, everything included · Mac: macOS 13+, lives in your menu bar
      </div>
      <div className="mx-auto mt-3 max-w-[560px] text-[12.5px] leading-relaxed text-white/55">
        On your iPhone it's a web app — open <a href={DL.phone} className="text-white/75">the link</a> in
        Safari, tap <b className="font-semibold text-white/80">Share → Add to Home Screen</b>, and sign in
        with your Prism account.
      </div>
      <a href="#install" className="mt-4 inline-block text-[12.5px] text-white/55 underline hover:text-white/80">
        First time opening it? Read this →
      </a>
    </div>
  )
}

/* ================================ install =============================== */

function InstallCard({ step, title, children, visual }) {
  return (
    <Card variant="secondary" className="gap-0 overflow-hidden p-0">
      <div className="flex h-[180px] items-center justify-center p-6">{visual}</div>
      <div className="px-6 pb-7 pt-2">
        <div className="mb-1.5 text-[12px] text-muted/80">Step {step}</div>
        <Card.Title className="mb-2 text-[17px]">{title}</Card.Title>
        <Card.Description className="text-[14px] leading-relaxed [text-wrap:pretty]">{children}</Card.Description>
      </div>
    </Card>
  )
}

function Install() {
  return (
    <div id="install" className="mx-auto max-w-[1100px] px-6 pt-24 sm:px-8">
      <h2 className="text-center text-[27px] font-semibold tracking-[-0.02em] md:text-[30px]">Opening Prism the first time</h2>
      <p className="mx-auto mt-3.5 max-w-[560px] text-center text-[15.5px] leading-[1.55] text-muted [text-wrap:pretty]">
        Prism is a free app from outside the app stores, so your computer asks you to approve it
        once. <b className="font-semibold text-foreground/80">On Windows</b>, SmartScreen shows a
        warning — click <b className="font-semibold text-foreground/80">More info → Run anyway</b>.
        On a Mac it's the three steps below.
      </p>
      <div className="mt-11 grid gap-6 md:grid-cols-3">
        <InstallCard step={1} title="Drag Prism to Applications" visual={
          <div className="flex items-center gap-5">
            <span className="inline-flex size-[52px] items-center justify-center rounded-[14px] shadow-[0_8px_22px_rgba(26,26,25,.2)]" style={{ background: 'var(--ink)' }}>
              <Tri className="size-[26px] text-white" />
            </span>
            <svg width="34" height="20" viewBox="0 0 34 20" fill="none" stroke="var(--border)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10h27M22 3l8 7-8 7" /></svg>
            <span className="inline-flex size-[52px] items-center justify-center rounded-[13px] text-[22px]" style={{ background: 'var(--surface-tertiary)' }}>📁</span>
          </div>
        }>
          Open the downloaded <b className="font-semibold text-foreground/80">Prism.dmg</b> and drag
          the Prism icon into your Applications folder.
        </InstallCard>
        <InstallCard step={2} title="Click Done — don't trash it" visual={
          <div className="w-[230px] rounded-xl border border-border bg-background p-4 text-center shadow-[0_12px_30px_rgba(40,35,25,.14)]">
            <div className="mx-auto mb-2.5 flex size-[34px] items-center justify-center rounded-lg" style={{ background: 'var(--ink)' }}>
              <Tri className="size-[17px] text-white" />
            </div>
            <div className="mb-1 text-[11px] font-semibold">"Prism" can't be opened</div>
            <div className="mb-3 text-[9.5px] leading-relaxed text-muted/80">Apple could not verify it is free of malware.</div>
            <div className="rounded-md bg-[#0a7cff] py-1.5 text-[10.5px] font-semibold text-white">Done</div>
          </div>
        }>
          The first open shows a warning. Just click <b className="font-semibold text-foreground/80">Done</b>.
          This is expected for free apps outside the App Store.
        </InstallCard>
        <InstallCard step={3} title="Open Anyway, once" visual={
          <div className="w-[250px] rounded-xl border border-border bg-background px-4 py-3.5 shadow-[0_12px_30px_rgba(40,35,25,.14)]">
            <div className="mb-2.5 text-[10px] font-semibold">Privacy &amp; Security</div>
            <div className="flex items-center gap-2.5 text-[10px] text-muted">
              <span className="flex-1 leading-snug">"Prism" was blocked to protect your Mac.</span>
              <span className="whitespace-nowrap rounded-md px-2 py-1 text-[9.5px] font-semibold text-foreground" style={{ background: 'var(--surface-tertiary)' }}>Open Anyway</span>
            </div>
          </div>
        }>
          Go to <b className="font-semibold text-foreground/80">System Settings → Privacy &amp; Security</b>,
          scroll down, and click <b className="font-semibold text-foreground/80">Open Anyway</b>. Prism opens
          normally from then on.
        </InstallCard>
      </div>
    </div>
  )
}

/* ================================ footer ================================ */

function Footer() {
  return (
    <div className="mt-28 border-t border-border">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-6 px-6 py-8 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Tri className="size-5" />
          <span className="text-[13px] font-semibold">Prism</span>
        </div>
        <div className="flex-1" />
        <span className="text-[12.5px] text-muted/80">Free during beta · Notes sync when you sign in</span>
        <span className="text-[12.5px] text-muted/60">© 2026 Prism</span>
      </div>
    </div>
  )
}

/* ================================= page ================================= */

export default function App() {
  return (
    <>
      <Banner />
      <Nav />
      <Hero />
      <Principles />
      <HowItWorks />
      <Features />
      <Capabilities />
      <Privacy />
      <Devices />
      <Faq />
      <Download />
      <Install />
      <Footer />
    </>
  )
}
