/* From claude.ai/design project 87613f02 — site/Mockups.jsx, verbatim.
   ADAPTED: the design project's preview pages get React and the component namespace as script
   globals and publish these mocks onto `window`; here they are ES module imports and exports.
   The two asset paths below are the other seam. Component bodies are untouched. */
import React from 'react'
import DS from '../ds/index.js'
// The mark is ours, not the design bundle's — see Wordmark.jsx for why.
import Wordmark, { Mark } from './Wordmark.jsx'

const { SidebarRail, SidebarItem, FolderRow, SearchField, AccountRow, NoteRow, NoteGroup,
  NoteStack, FolderTag, TagChip, TaskRow, TabBar, Icon, ChatMessage, ThinkingTrace, SourceChip,
  NodeGraph, Segmented, UsageMeter, SectionHeader, Button } = DS;

/* One breakpoint. The site is either the desktop layout or the phone layout — there is no
   tablet in between worth designing separately, and matchMedia is how inline-styled JSX gets
   to answer that question at all. */
function useVp(query = '(max-width: 860px)') {
  /* A device page pins the layout (window.PRISM_SITE_VIEW), because inside a phone frame the
     real viewport is desktop-wide and the media query would answer the wrong question. */
  const forced = typeof window !== 'undefined' ? window.PRISM_SITE_VIEW : null;
  const [hit, setHit] = React.useState(() => forced ? forced === 'phone'
    : typeof window !== 'undefined' && window.matchMedia(query).matches);
  React.useEffect(() => {
    if (forced) return setHit(forced === 'phone');
    const mq = window.matchMedia(query);
    const on = e => setHit(e.matches);
    mq.addEventListener('change', on);
    setHit(mq.matches);
    return () => mq.removeEventListener('change', on);
  }, [query, forced]);
  return hit;
}

/* The Mac window is a fixed 1040px because the app is. Rather than reflow it — which would be
   a lie about the product — scale it down to whatever room the column has, and shrink the
   reserved height to match so nothing under it floats. */
function Fit({ width, height, children, align = 'center' }) {
  const box = React.useRef(null);
  const [k, setK] = React.useState(1);
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(Math.min(1, el.clientWidth / width)));
    ro.observe(el);
    setK(Math.min(1, el.clientWidth / width));
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={box} style={{ width: '100%', height: height * k, display: 'flex', justifyContent: align, overflow: 'hidden' }}>
      <div style={{ width, height, flex: '0 0 auto', transform: 'scale(' + k + ')', transformOrigin: align === 'center' ? 'top center' : 'top left' }}>
        {children}
      </div>
    </div>
  );
}

/* ADAPTED FROM THE DESIGN: in the design project these resolve inside the project tree
   ('../assets/…'); on the site they are served from public/ at the document root. */
const LOGO = 'logo.svg';
const AV = 'avatars/blue.jpg';
const A = { blue: 'var(--accent-blue)', red: 'var(--accent-red)', green: 'var(--accent-green)', violet: 'var(--accent-violet)' };

const NOTES = [
  { id: 1, title: 'Weekly team sync', snippet: 'Importer ships Friday — Dana owns the merch reset.', time: '7h ago', folder: 'Retail Leadership', color: A.blue },
  { id: 2, title: 'Meridian Title callback', snippet: 'Payoff letter promised by 4pm. Karen is the escalation.', time: '3h ago', folder: 'Deal Notes', color: A.green },
  { id: 3, title: 'Q3 recap outline', snippet: 'Three sections: pipeline, hiring pause, retail reset.', time: '6h ago', folder: 'ISA Leadership', color: A.red },
  { id: 4, title: 'Pediatrician — Tuesday 8:40', snippet: 'Bring the immunisation card.', time: '1d ago', folder: 'Personal', color: A.violet }
];
const FOLDERS = [
  { id: 'retail', name: 'Retail Leadership', color: A.blue, count: 24 },
  { id: 'isa', name: 'ISA Leadership', color: A.red, count: 11 },
  { id: 'deals', name: 'Deal Notes', color: A.green, count: 18, children: [{ id: 'hartwell', name: 'Hartwell', count: 5 }] },
  { id: 'personal', name: 'Personal', color: A.violet, count: 6 }
];

/* Mac window chrome — the same 12px radius, grey frame and traffic lights as the app kit. */
function MacMock({ scale = 1, children, height = 520 }) {
  return (
    <div style={{
      width: 1040, height, flex: '0 0 auto', borderRadius: 12, overflow: 'hidden',
      background: 'var(--surface-canvas)', boxShadow: 'var(--shadow-window)',
      display: 'flex', flexDirection: 'column',
      transform: scale === 1 ? 'none' : 'scale(' + scale + ')', transformOrigin: 'top left'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 28, padding: '0 13px', flex: '0 0 auto' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>{children}</div>
    </div>
  );
}

function Rail({ nav = 'notes', expanded }) {
  return (
    <SidebarRail expanded={expanded}
      header={({ expanded: on, label, iconCol }) => (
        <>
          <div style={{ display: 'flex', alignItems: 'center', height: 26, overflow: 'hidden' }}>
            <span style={iconCol}><Wordmark size={17} showName={false} /></span>
            <span style={{ ...label, font: 'var(--type-title)', letterSpacing: 'var(--tracking-title)' }}>Prism</span>
          </div>
          {on ? <SearchField placeholder="Search" shortcut="⌃K" />
              : <span style={{ ...iconCol, height: 'var(--row-height)', color: 'var(--nav-item-icon)' }}><Icon name="search" size={16} /></span>}
        </>
      )}
      footer={<div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 7 }}>
        <AccountRow name="Jordan Finkle" email="jordanfinkle@gmail.com" avatarSrc={AV} />
      </div>}>
      <SidebarItem icon={<Icon name="note" size={16} />} selected={nav === 'notes'}>All notes</SidebarItem>
      <SidebarItem icon={<Icon name="list" size={16} />} selected={nav === 'tasks'}>Tasks</SidebarItem>
      <SidebarItem icon={<Icon name="message-circle" size={16} />} selected={nav === 'chat'}>Chat</SidebarItem>
      <SidebarItem icon={<Icon name="git-fork" size={16} />} selected={nav === 'graph'}>Graph</SidebarItem>
      <div style={{ height: 1, background: 'var(--border-hairline)', margin: '8px 6px' }} />
      {FOLDERS.map(f => (
        <FolderRow key={f.id} color={f.color} count={f.children ? undefined : f.count}
          folders={(f.children || []).map(k => ({ ...k, color: f.color }))}>{f.name}</FolderRow>
      ))}
    </SidebarRail>
  );
}

const pane = {
  flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0,
  background: 'var(--surface-content)', borderRadius: 'var(--radius-content)',
  border: 'var(--border-width) solid var(--border-card)', overflow: 'hidden'
};

/* The hero shot: All notes as it actually ships — list pane on grey, reading pane beside it. */
function HeroShot() {
  return (
    <MacMock>
      <Rail expanded={true} />
      <div style={{ flex: 1, minWidth: 0, padding: '0 10px 10px 2px', display: 'flex' }}>
        <main style={pane}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <div style={{ width: 320, flex: '0 0 auto', borderRight: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 14px 10px' }}>
                <span style={{ flex: 1, font: 'var(--type-body-medium)', fontWeight: 'var(--weight-bold)', letterSpacing: 'var(--tracking-title)' }}>
                  All notes<span style={{ font: 'var(--type-micro)', color: 'var(--text-tertiary)', marginLeft: 7, fontWeight: 'var(--weight-medium)' }}>59</span>
                </span>
                <Button variant="quiet" size="sm">Edit</Button>
                <Button variant="secondary" size="sm" shape="round" icon={<Icon name="plus" size={13} />}>New</Button>
              </div>
              <div data-scrollbar="none" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 10px' }}>
                <SectionHeader title="Today" style={{ padding: '6px 4px' }} />
                {NOTES.slice(0, 3).map((n, i) => (
                  <NoteRow key={n.id} variant="raised" {...n} selected={i === 1} saved={i === 0} onSave={() => {}} />
                ))}
                <SectionHeader title="Yesterday" style={{ padding: '6px 4px' }} />
                <NoteRow variant="raised" {...NOTES[3]} onSave={() => {}} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 11, overflow: 'hidden' }}>
              <span style={{ font: 'var(--type-meta)', color: 'var(--text-tertiary)' }}>Tuesday, August 4, 2026</span>
              <h3 style={{ font: 'var(--type-display-s)', letterSpacing: 'var(--tracking-display)' }}>Meridian Title callback</h3>
              <FolderTag folder="Deal Notes" color={A.green} />
              <p style={{ font: 'var(--type-note-body)' }}>Payoff letter is promised by 4pm today. Karen is the escalation if it slips — she has authority to release without the branch manager.</p>
              <p style={{ font: 'var(--type-note-body)' }}>Escrow will not schedule the signing until the HOA estoppel is in hand. That is the real blocker, not the payoff.</p>
              <div style={{ marginTop: 4 }}>
                <SectionHeader title="Notes today" style={{ marginBottom: 9 }} />
                <NoteStack label="notes" notes={NOTES.map(n => ({ id: n.id, title: n.title, snippet: n.snippet, time: n.time.replace(' ago', ''), color: n.color }))} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </MacMock>
  );
}

/* iPhone — the frame is site-local chrome; everything inside is the real kit. */
/* bare: the app screen with no device chrome — for when the shot is already inside a phone
   (the iOS site page), where a second bezel just looks like a rendering fault */
function PhoneMock({ children, tab = 'notes', bare = false }) {
  const tabs = [
    { value: 'notes', label: 'Notes', icon: <Icon name="note" size={19} /> },
    { value: 'tasks', label: 'Tasks', icon: <Icon name="list" size={19} /> },
    { value: 'chat', label: 'Chat', icon: <Icon name="message-circle" size={19} /> },
    { value: 'you', label: 'You', icon: <Icon name="user" size={19} /> }
  ];
  if (bare) {
    return (
      <div style={{
        position: 'relative', width: '100%', flex: '0 0 auto', overflow: 'hidden',
        borderRadius: 'var(--radius-content)', background: 'var(--surface-canvas)',
        boxShadow: 'var(--shadow-card), 0 0 0 1px var(--border-card)'
      }}>
        {children}
        {/* ADAPTED FROM THE DESIGN — no gradients on the site (Jordan, 2026-08-17). The design
            ends this shot in a fade so the crop reads as "there is more" rather than as a cut;
            without a gradient it is a plain crop. Nothing on the site renders PhoneMock today,
            so this costs nothing at present. */}
      </div>
    );
  }
  return (
    <div style={{
      width: 320, height: 646, flex: '0 0 auto', position: 'relative', borderRadius: 46,
      background: 'var(--surface-canvas)', padding: 4, filter: 'blur(0px)',
      boxShadow: '0 0 0 4px #1c1c1e, var(--shadow-window)'
    }}>
      <div style={{ position: 'absolute', inset: 4, borderRadius: 42, overflow: 'hidden', background: 'var(--surface-canvas)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 14, display: 'flex', alignItems: 'center', padding: '0 26px', pointerEvents: 'none' }}>
          <span style={{ flex: 1, font: 'var(--type-label)', fontWeight: 'var(--weight-semibold)' }}>9:41</span>
          <span style={{ display: 'flex', gap: 5, color: 'var(--text-primary)' }}>
            <Icon name="signal-high" size={14} /><Icon name="wifi" size={14} /><Icon name="battery-full" size={14} />
          </span>
        </div>
        <div data-scrollbar="none" style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <div style={{ height: 52 }} />
          {children}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', padding: '0 18px 14px', zIndex: 16 }}>
          <TabBar value={tab} items={tabs} style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

function PhoneNotes({ scale, bare = false }) {
  const phone = useVp();
  const k = scale != null ? scale : (phone ? 0.84 : 1);
  const inner = (
    <PhoneMock bare={bare}>
      <div style={{ padding: bare ? '16px var(--gutter-mobile) 40px' : '8px var(--gutter-mobile) 104px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><Wordmark size={18} /></div>
        <SearchField placeholder="Search all notes" />
        <div data-scrollbar="none" style={{ display: 'flex', gap: 7, overflowX: 'auto' }}>
          <TagChip selected>All notes</TagChip>
          {FOLDERS.map(f => <TagChip key={f.id} color={f.color}>{f.name}</TagChip>)}
        </div>
        {!bare && <NoteStack label="notes" notes={NOTES.map(n => ({ id: n.id, title: n.title, snippet: n.snippet, time: n.time.replace(' ago', ''), color: n.color }))} />}
        <NoteGroup label="Today">
          {NOTES.slice(0, 3).map((n, i) => <NoteRow key={n.id} variant="flat" divider={i > 0} {...n} saved={i === 0} onSave={() => {}} />)}
        </NoteGroup>
        {!bare && (
          <NoteGroup label="Yesterday">
            <NoteRow variant="flat" {...NOTES[3]} onSave={() => {}} />
          </NoteGroup>
        )}
      </div>
    </PhoneMock>
  );
  if (bare) return inner;
  return k === 1 ? inner : <Fit width={320} height={654}>{inner}</Fit>;
}

/* Chat — a real turn, trace collapsed, citations under the answer. */
function ChatMock() {
  const src = [
    { id: 2, title: 'Meridian Title callback', color: A.green },
    { id: 7, title: 'Hartwell — escrow timeline', color: A.green }
  ];
  return (
    <div style={{
      background: 'var(--surface-content)', borderRadius: 'var(--radius-content)',
      boxShadow: 'var(--shadow-card), 0 0 0 1px var(--border-card)', padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 12
    }}>
      <ChatMessage from="user">Where does the Hartwell close stand?</ChatMessage>
      <ChatMessage steps={['Reading Deal Notes', 'Pulling the Hartwell thread', 'Checking dates against the rate lock']}
        seconds={5} sources={src} onOpenSource={() => {}}>
        Escrow says Thursday at the earliest, and only if the title docs land tomorrow. Meridian still owes the payoff letter and the HOA estoppel — promised by 4pm, with Karen as the escalation. Your rate lock expires on the 19th, so there is one business day of cushion.
      </ChatMessage>
    </div>
  );
}

function GraphMock() {
  const phone = useVp();
  const people = [
    { id: 'dana', label: 'Dana Reyes', kind: 'person', weight: 3 },
    { id: 'ravi', label: 'Ravi Patel', kind: 'person', weight: 3 },
    { id: 'marcus', label: 'Marcus Toledo', kind: 'person', weight: 3 },
    { id: 'priya', label: 'Priya Shah', kind: 'person', weight: 2 },
    { id: 'karen', label: 'Karen Diaz', kind: 'mentioned', weight: 2 },
    { id: 'tom', label: 'Tom Whitlock', kind: 'mentioned', weight: 1 }
  ];
  const notes = [
    { id: 'n1', label: 'Weekly team sync', kind: 'note', color: A.blue },
    { id: 'n2', label: 'Meridian Title callback', kind: 'note', color: A.green },
    { id: 'n3', label: 'Hartwell — escrow', kind: 'note', color: A.green },
    { id: 'n4', label: 'Endcap swap', kind: 'note', color: A.blue },
    { id: 'n5', label: 'Q3 recap outline', kind: 'note', color: A.red },
    { id: 'n6', label: 'Signage proofs', kind: 'note', color: A.blue },
    { id: 'n7', label: 'Pediatrician', kind: 'note', color: A.violet }
  ];
  const inN = { dana: ['n1', 'n4'], ravi: ['n1', 'n5'], marcus: ['n2', 'n3'], priya: ['n1', 'n6'], karen: ['n2'], tom: ['n3', 'n7'] };
  const nodes = [{ id: 'you', label: 'You', kind: 'you' }].concat(people, notes);
  const links = [];
  people.forEach(p => {
    links.push({ source: 'you', target: p.id, kind: p.kind === 'person' ? 'spoke' : 'weak' });
    inN[p.id].forEach(n => links.push({ source: p.id, target: n, kind: 'mention' }));
  });
  people.forEach((a, i) => people.slice(i + 1).forEach(b => {
    if (inN[a.id].some(x => inN[b.id].includes(x))) links.push({ source: a.id, target: b.id, kind: 'tie' });
  }));
  return (
    <div style={{
      position: 'relative', height: phone ? 340 : 460, borderRadius: 'var(--radius-content)', overflow: 'hidden',
      boxShadow: 'var(--shadow-card), 0 0 0 1px var(--border-card)'
    }}>
      <NodeGraph nodes={nodes} links={links} avatar={AV} controls={false} />
      <div style={{ position: 'absolute', left: 18, top: 16 }}>
        <Segmented value="combined" items={[{ value: 'notes', label: 'Notes' }, { value: 'people', label: 'People' }, { value: 'combined', label: 'Combined' }]} />
      </div>
    </div>
  );
}

function TasksMock() {
  return (
    <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card), 0 0 0 1px var(--border-card)', overflow: 'hidden' }}>
      <TaskRow title="Send Meridian the payoff request" due="Today, 16:00" color={A.green} />
      <TaskRow title="Confirm the importer ship date with Dana" due="Today" color={A.blue} />
      <TaskRow title="Review signage proofs before print" due="Thursday" color={A.blue} />
      <TaskRow title="Book the pediatrician" due="Tomorrow, 9:00" color={A.violet} done />
    </div>
  );
}

function FoldersMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--surface-sidebar)', borderRadius: 'var(--radius-card)', padding: 7, boxShadow: '0 0 0 1px var(--border-card)' }}>
        <SidebarRail expanded={true} style={{ background: 'transparent', padding: 0, height: 'auto', width: '100%' }}>
          {FOLDERS.map(f => (
            <FolderRow key={f.id} color={f.color} count={f.children ? undefined : f.count}
              folders={(f.children || []).map(k => ({ ...k, color: f.color }))}>{f.name}</FolderRow>
          ))}
        </SidebarRail>
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <FolderTag folder="Retail Leadership" color={A.blue} />
        <FolderTag folder="Deal Notes" leaf="Hartwell" color={A.green} />
        <FolderTag folder="ISA Leadership" color={A.red} />
        <FolderTag folder="Personal" color={A.violet} />
      </div>
    </div>
  );
}

function LimitsMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <UsageMeter label="Weekly limit" used={18.5} cap={30} />
      <UsageMeter label="8 hour limit" used={3.4} cap={8} />
    </div>
  );
}

/* The meeting popup, from the design project's `Prism Call Island.html`. That page is a
   standalone prototype — its own CSS, its own hex values, no DS components — so it is ported
   as one self-contained artifact rather than rebuilt out of tokens.

   ADAPTED FROM THE DESIGN, four things:
   1. Every selector is scoped under .pci and the two keyframes are renamed. The design page
      owns a whole document, so its class names (.main, .live, .mark, .win) are far too
      generic to let loose on a shared page.
   2. The stage shadow becomes --shadow-window. The original
      `0 0 0 1px #2A2B31, 0 30px 80px rgba(0,0,0,.5)` is cut for that page's near-black
      backdrop and reads as a hard dark ring on the site's white.
   3. The flow runs on a loop rather than waiting for clicks — nobody clicks a picture — so
      the ✕ / Start / Stop controls are spans and the stage is pointer-events:none.
   4. A phone branch, since the desktop stage does not survive being scaled to a phone column.
   Geometry, timings, easings, hex values and copy are all the design's. */
const CALL_ISLAND_CSS = `
.pci{position:relative;width:1060px;height:662px;background:#ECECEF;border-radius:16px;box-shadow:var(--shadow-window);overflow:hidden;pointer-events:none}
.pci .menubar{position:absolute;top:0;left:0;right:0;height:27px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;background:rgba(250,250,251,.85);backdrop-filter:blur(10px);z-index:5}
.pci .mb{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#181819}
.pci .mb .mark{width:12px;height:12px}
.pci .mbr{font-size:12px;font-weight:500;color:#3A3A3E}
.pci .win{position:absolute;left:170px;top:78px;width:760px;height:540px;background:#F6F6F7;border-radius:12px;box-shadow:0 0 0 1px rgba(24,24,25,.09),0 22px 60px rgba(24,24,25,.18);display:flex;overflow:hidden}
.pci .lights{position:absolute;top:11px;left:12px;display:flex;gap:7px}
.pci .lights i{width:11px;height:11px;border-radius:50%;background:#D6D6D8}
.pci .rail{width:168px;flex:0 0 auto;border-right:1px solid rgba(24,24,25,.06);padding:38px 12px 0;display:flex;flex-direction:column;gap:9px}
.pci .rk{background:#EAEAEC;border-radius:8px}
.pci .main{flex:1;background:#FFFFFF;padding:26px 24px;display:flex;flex-direction:column;gap:13px}
.pci .mk{background:#F2F2F3;border-radius:10px}
.pci .mark{fill:currentColor;display:block}
.pci .pop{position:absolute;top:39px;right:14px;z-index:9;background:#FFFFFF;color:#181819;box-shadow:0 1px 2px rgba(24,24,25,.035),0 10px 30px rgba(24,24,25,.10);overflow:hidden;opacity:0;transform:translateY(-8px);
  width:178px;height:40px;border-radius:12px;
  transition:width .58s cubic-bezier(.32,.72,0,1),height .58s cubic-bezier(.32,.72,0,1),border-radius .58s cubic-bezier(.32,.72,0,1),opacity .3s ease,transform .45s cubic-bezier(.32,.72,0,1)}
.pci[data-st="det"] .pop,.pci[data-st="conf"] .pop,.pci[data-st="live"] .pop{opacity:1;transform:none}
.pci[data-st="det"] .pop{width:236px;height:150px;border-radius:16px}
.pci[data-st="conf"] .pop{width:238px;height:58px;border-radius:14px}
.pci[data-st="live"] .pop{width:177px;height:40px;border-radius:12px}
.pci .pop .st{position:absolute;inset:0;display:flex;opacity:0;transition:opacity .22s ease}
.pci .pop .st.on{opacity:1;transition-delay:.18s}
.pci .det{flex-direction:column;padding:11px 13px 11px}
.pci .det .hd{display:flex;align-items:center;gap:7px}
.pci .det .hd .mark{width:11px;height:11px}
.pci .det .hd b{font-size:12.5px;font-weight:600;letter-spacing:-.008em}
.pci .det .x{margin-left:auto;width:22px;height:22px;display:grid;place-items:center;color:#9A9A9C;font-size:13px;padding:0}
.pci .det .tt{margin-top:7px;font-size:15px;font-weight:700;letter-spacing:-.016em}
.pci .det .tt i{font-style:normal;font-size:11.5px;font-weight:500;color:#9A9A9C;margin-left:6px}
.pci .det .ss{font-size:12.5px;font-weight:500;color:#717273;margin-top:2px}
.pci .rbtn{margin-top:11px;width:100%;height:38px;border-radius:999px;background:#EEEEEF;color:#1B1B1D;font-size:13px;font-weight:600;letter-spacing:-.008em;display:flex;align-items:center;justify-content:center;gap:8px}
.pci .rbtn .dot{width:7px;height:7px;border-radius:50%;background:#FF453A}
.pci .drain{margin-top:11px;height:3px;border-radius:999px;background:#F3F3F4;overflow:hidden}
.pci .drain i{display:block;height:100%;border-radius:999px;background:#C9C9CD;width:100%}
.pci[data-st="det"] .drain i{animation:pciDrain 6s linear forwards}
@keyframes pciDrain{from{width:100%}to{width:0%}}
.pci .conf{align-items:center;gap:10px;padding:0 13px}
.pci .conf .ok{width:30px;height:30px;flex:0 0 auto;border-radius:50%;background:#EEEEEF;display:grid;place-items:center;color:#1B1B1D}
.pci .conf .tt{font-size:13.5px;font-weight:700;letter-spacing:-.014em;line-height:1.3}
.pci .conf .ss{font-size:12px;font-weight:500;color:#717273;margin-top:1px}
.pci .live{align-items:center;gap:8px;padding:0 9px 0 12px}
.pci .live .mark{width:11px;height:11px;flex:0 0 auto}
.pci .wv{display:flex;align-items:center;gap:2.5px;height:14px;flex:0 0 auto}
.pci .wv i{width:2.5px;height:2.5px;flex:0 0 auto;border-radius:999px;background:#BBBBBB;animation:pciPill 1.1s ease-in-out infinite}
@keyframes pciPill{0%,100%{height:2.5px}50%{height:var(--h)}}
.pci .live .tm{font-size:12px;font-weight:500;color:#717273;font-variant-numeric:tabular-nums}
.pci .stop{width:24px;height:24px;flex:0 0 auto;border-radius:50%;border:1.5px solid #FF453A;background:#FFF;display:grid;place-items:center;padding:0}
.pci .stop i{width:9px;height:9px;border-radius:2.5px;background:#FF453A}
/* Phone: the desktop stage scaled into a ~335px column puts the popup at 75px wide, which is
   not a picture of anything. Drop the desktop and show the card at full size — the same move
   the design makes with PhoneMock's \`bare\`, and with the hero shot it hides outright. */
.pci.bare{width:100%;height:212px;border-radius:var(--radius-content);box-shadow:var(--shadow-card),0 0 0 1px var(--border-card);display:grid;place-items:center}
.pci.bare .pop{position:relative;top:auto;right:auto}
@media (prefers-reduced-motion:reduce){
  .pci .pop,.pci .pop .st{transition:none}
  .pci[data-st="det"] .drain i{animation:none}
  .pci .wv i{animation:none;height:var(--h)}
}
`;


/* The design page's own timings: the card appears after 700ms, the confirmation holds 1900ms
   before it shrinks to the pill, and the drain bar is a 6s auto-dismiss. Here 'det' ends at
   3.6s — partway through the drain — which is what it looks like when someone actually clicks
   Start rather than letting it time out. */
const CALL_FLOW = [['idle', 900], ['det', 3600], ['conf', 1900], ['live', 6000]];

/* Bar heights and stagger, straight from the design's markup. */
const WAVE = [[5, 0], [8, .09], [12, .18], [14, .27], [7, .36], [10, .45], [6, .54],
  [11, .63], [14, .72], [8, .81], [13, .9], [6, .99], [9, 1.08], [12, 1.17]];

function CallIslandMock() {
  const phone = useVp();
  const still = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Reduced motion holds the card open instead of looping — 'idle' is an empty corner, so
     stopping at step 0 would show nothing at all. */
  const [step, setStep] = React.useState(still ? 1 : 0);
  const [sec, setSec] = React.useState(0);
  const st = CALL_FLOW[step][0];

  React.useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setStep(n => (n + 1) % CALL_FLOW.length), CALL_FLOW[step][1]);
    return () => clearTimeout(t);
  }, [step, still]);

  React.useEffect(() => {
    if (st !== 'live') return setSec(0);
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [st]);

  const on = s => 'st ' + s + (st === s ? ' on' : '');
  const pop = (
    <div className="pop">
      <div className={on('det')}>
        <div className="hd">
          <Mark /><b>Prism</b><span className="x" aria-hidden="true">✕</span>
        </div>
        <div className="tt">Meeting detected<i>now</i></div>
        <div className="ss">Zoom meeting just started.</div>
        <span className="rbtn"><span className="dot" />Start recording</span>
        <div className="drain"><i /></div>
      </div>
      <div className={on('conf')}>
        <span className="ok">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.6 4.6L19 7.5" /></svg>
        </span>
        <span><span className="tt">Recording this meeting</span><br /><span className="ss">Got it — capturing the call.</span></span>
      </div>
      <div className={on('live')}>
        <Mark />
        <span className="wv">
          {WAVE.map(([h, d], i) => <i key={i} style={{ '--h': h + 'px', animationDelay: d + 's' }} />)}
        </span>
        <span className="tm">{Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0')}</span>
        <span className="stop"><i /></span>
      </div>
    </div>
  );

  if (phone) {
    return <><style>{CALL_ISLAND_CSS}</style><div className="pci bare" data-st={st}>{pop}</div></>;
  }
  /* Fixed 1060px because a Mac desktop is not a fluid thing — scaled to the column, like the
     hero window, rather than reflowed. */
  return (
    <>
      <style>{CALL_ISLAND_CSS}</style>
      <Fit width={1060} height={662}>
        <div className="pci" data-st={st}>
          <div className="menubar">
            <span className="mb"><Mark />Prism</span>
            <span className="mbr">Sat Aug 9&nbsp;&nbsp;9:41 AM</span>
          </div>
          <div className="win">
            <div className="lights"><i /><i /><i /></div>
            <div className="rail">
              <div className="rk" style={{ height: 26, marginTop: 4 }} />
              <div className="rk" style={{ height: 16, width: '70%' }} />
              <div className="rk" style={{ height: 16, width: '82%' }} />
              <div className="rk" style={{ height: 16, width: '64%' }} />
              <div className="rk" style={{ height: 16, width: '76%', marginTop: 14 }} />
              <div className="rk" style={{ height: 16, width: '58%' }} />
            </div>
            <div className="main">
              <div className="mk" style={{ width: '38%', height: 26 }} />
              <div className="mk" style={{ width: '56%', height: 14 }} />
              <div style={{ display: 'flex', gap: 13, marginTop: 8 }}>
                <div className="mk" style={{ flex: 1.1, height: 200 }} />
                <div className="mk" style={{ flex: 1, height: 200 }} />
              </div>
              <div style={{ display: 'flex', gap: 13 }}>
                <div className="mk" style={{ flex: 1, height: 120 }} />
                <div className="mk" style={{ flex: 1, height: 120 }} />
                <div className="mk" style={{ flex: 1, height: 120 }} />
              </div>
            </div>
          </div>
          {pop}
        </div>
      </Fit>
    </>
  );
}

export { useVp, Fit, MacMock, HeroShot, PhoneMock, PhoneNotes, ChatMock, GraphMock, TasksMock,
  FoldersMock, LimitsMock, CallIslandMock, Rail, LOGO as SITE_LOGO, AV as SITE_AV };
