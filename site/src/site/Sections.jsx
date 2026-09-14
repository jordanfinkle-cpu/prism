/* From claude.ai/design project 87613f02 — site/Sections.jsx, verbatim.
   ADAPTED: imports/exports replace the design project's script-global namespace and
   `Object.assign(window, …)`. Section bodies, copy and measurements are untouched. */
import React from 'react'
import DS from '../ds/index.js'
import { useVp, Fit, HeroShot, LimitsMock, SITE_LOGO } from './Mockups.jsx'
import { requestAccess } from './access.js'
import Wordmark from './Wordmark.jsx'   // the new mark; see that file for why not the DS one

const { Button, Icon, Badge, Kbd, TagChip, FolderTag, ThinkingTrace, SourceChip } = DS;
const LOGO = SITE_LOGO;

const wrap = { width: '100%', maxWidth: 'var(--site-max)', margin: '0 auto', padding: '0 var(--site-gutter)' };
const h2 = { fontSize: 'var(--site-h2)', fontWeight: 'var(--weight-semibold)', lineHeight: 1.08, letterSpacing: 'var(--tracking-display)' };
const lead = { fontSize: 'var(--site-lead)', lineHeight: 1.55, color: 'var(--text-secondary)' };
const eyebrow = { font: 'var(--type-caps)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' };

/* The request-access field. Invite-only is the real distribution model, so the site's one
   conversion is an email — never a "Download" button that leads to a wall. */
function RequestField({ compact = false }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const ready = /.+@.+\..+/.test(email) && !busy;
  if (sent) return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, height: compact ? 44 : 52,
      padding: '0 18px', borderRadius: 'var(--radius-full)', background: 'var(--surface-field)',
      font: 'var(--type-body)', color: 'var(--text-secondary)', maxWidth: 430
    }}>
      <Icon name="check" size={15} />You are on the list. We send keys in weekly batches.
    </div>
  );
  /* ADAPTED FROM THE DESIGN: the design's field confirms on submit and throws the address
     away — it is a prototype, and there was no waitlist to put it in. It now waits for the
     insert and only claims success when the row exists. */
  const submit = async e => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setErr('');
    const r = await requestAccess(email);
    setBusy(false);
    if (r.ok) setSent(true); else setErr(r.error);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 430 }}>
      <form onSubmit={submit}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          height: compact ? 44 : 52, padding: '0 6px 0 18px', background: 'var(--surface-card)',
          borderRadius: 'var(--radius-full)', boxShadow: '0 0 0 1px var(--border-strong)'
        }}>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@work.com" aria-label="Email address"
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-core)', fontSize: 'var(--size-body-l)', color: 'var(--text-primary)' }} />
        <button type="submit" disabled={!ready} style={{
          flex: '0 0 auto', height: compact ? 34 : 40, padding: '0 17px', border: 'none', borderRadius: 'var(--radius-full)',
          background: ready ? 'var(--action-primary)' : 'var(--action-disabled)',
          color: ready ? 'var(--action-primary-text)' : 'var(--action-disabled-text)',
          fontFamily: 'var(--font-core)', fontSize: 'var(--size-body)', fontWeight: 'var(--weight-medium)',
          cursor: ready ? 'pointer' : 'default', transition: 'var(--transition-control)'
        }}>Request access</button>
      </form>
      {err && <span role="alert" style={{ font: 'var(--type-micro)', color: 'var(--danger)', paddingLeft: 18, textAlign: 'left' }}>{err}</span>}
    </div>
  );
}

/* Sticky nav — solid white, so content passing under it is simply hidden. No blur: at a bar's
   height the glass treatment reads as a smear rather than as depth. */
const LINKS = [['#how', 'How it works'], ['#notes', 'Notes'], ['#ask', 'Ask'], ['#plans', 'Plans'], ['#faq', 'FAQ']];

function SiteNav() {
  const phone = useVp();
  const [lit, setLit] = React.useState(false);
  React.useEffect(() => {
    /* on a device page the site scrolls inside a frame, so the listener has to sit on that
       element — window never fires */
    const host = window.PRISM_SITE_SCROLLER && document.getElementById(window.PRISM_SITE_SCROLLER);
    const el = host || document.scrollingElement || document.documentElement;
    const on = () => setLit(el.scrollTop > 8);
    (host || window).addEventListener('scroll', on, { passive: true });
    return () => (host || window).removeEventListener('scroll', on);
  }, []);
  const link = { font: 'var(--type-meta)', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' };
  return (
    <header style={{
      position: 'sticky', top: 'var(--site-nav-top, 0px)', zIndex: 40,
      background: 'var(--surface-card)',
      borderBottom: '1px solid ' + (lit ? 'var(--border-hairline)' : 'transparent'),
      transition: 'border-color var(--dur-base) var(--ease-standard)'
    }}>
      {/* On a phone the bar is the mark and nothing else. Section links and a Request access pill
          both duplicate what the page already gives you by scrolling — and the page has exactly
          one call to action, repeated in the hero and at the close. */}
      <div style={{ ...wrap, height: phone ? 54 : 66, display: 'flex', alignItems: 'center', gap: 26 }}>
        <a href="#top" style={{ display: 'inline-flex' }}><Wordmark size={phone ? 17 : 19} /></a>
        {!phone && <>
          <nav style={{ display: 'flex', gap: 22, marginLeft: 12 }}>
            {LINKS.map(([href, label]) => <a key={href} href={href} style={link}>{label}</a>)}
          </nav>
          <span style={{ flex: 1 }} />
          <a href="#access" style={{
            display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 15px',
            borderRadius: 'var(--radius-full)', background: 'var(--action-primary)',
            color: 'var(--action-primary-text)', font: 'var(--type-label)', fontWeight: 'var(--weight-medium)'
          }}>Request access</a>
        </>}
      </div>
    </header>
  );
}

function Hero() {
  const phone = useVp();
  return (
    <section id="top" style={{ paddingTop: phone ? 30 : 44, overflow: 'hidden' }}>
      <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, ...eyebrow }}>
          Invite only<span style={{ opacity: .5 }}>·</span>Mac and Windows
        </span>
        <h1 style={{ fontSize: 'var(--site-h1)', fontWeight: 'var(--weight-semibold)', lineHeight: 1.02, letterSpacing: 'var(--tracking-display-l)', maxWidth: 15 + 'em' }}>
          Every conversation,{phone ? ' ' : <br />}written down.
        </h1>
        <p style={{ ...lead, maxWidth: 620 }}>
          Prism records your calls and meetings, files the notes into your own folders, and pulls out
          what you agreed to. Then you can ask it anything — and it shows you which note the answer
          came from.
        </p>
        <RequestField />
        <span style={{ font: 'var(--type-micro)', color: 'var(--text-tertiary)' }}>
          Keys go out in weekly batches. No card, no trial clock.
        </span>
      </div>
      {/* The Mac window is the hero on wide screens. On a phone there is no shot at all — a
          picture of a phone app, on a phone, is the thing you are already holding. */}
      {!phone && (
        <div style={{ padding: '46px var(--site-gutter) 0' }}>
          <Fit width={1040} height={548}><HeroShot /></Fit>
        </div>
      )}
      {/* ADAPTED FROM THE DESIGN — no gradients on the site (Jordan, 2026-08-17). The design
          pulls the shot 120px into the grey section and feathers that seam with a linear
          gradient. Without a gradient the overlap has nowhere to go: a flat grey band would
          slice straight across the note cards, which is exactly what the design's own comment
          warned about. So the window sits whole on the white and the grey starts beneath it.
          The 30px keeps the original rhythm — the design's gradient also ran 30px past the
          window before the next section began. */}
      <div style={{ height: phone ? 46 : 30 }} />
    </section>
  );
}

/* Three steps. Each one is a claim about what you stop doing. */
function Steps() {
  const steps = [
    { n: '01', t: 'It records', d: 'Start it on a call or a meeting, or let it notice one starting. Prism runs in the background on your Mac or your PC and stays out of the way until you need it.', icon: 'mic' },
    { n: '02', t: 'It files', d: 'The note lands titled, dated and tagged into the folder it belongs to — Deal Notes, ISA Leadership, whatever you already use.', icon: 'folder' },
    { n: '03', t: 'It answers', d: 'Ask what you agreed to, who owes you what, or what you are forgetting. Every answer cites the notes it read.', icon: 'message-circle' }
  ];
  return (
    <section id="how" style={{ background: 'var(--surface-canvas)', padding: 'clamp(58px,7vw,86px) 0 clamp(62px,7vw,92px)' }}>
      <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3.4vw,44px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
          <span style={eyebrow}>How it works</span>
          <h2 style={h2}>You stop taking notes. That is the whole idea.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(255px,1fr))', gap: 14 }}>
          {steps.map(s => (
            <div key={s.n} style={{
              background: 'var(--surface-card)', borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card), 0 0 0 1px var(--border-card)',
              padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', gap: 11
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-flex', color: 'var(--text-primary)' }}><Icon name={s.icon} size={17} /></span>
                <span style={{ font: 'var(--type-micro)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{s.n}</span>
              </span>
              <span style={{ font: 'var(--type-title)', letterSpacing: 'var(--tracking-title)' }}>{s.t}</span>
              <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s.d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* A copy column beside a piece of the real product. Alternates side. */
function FeatureRow({ id, eyebrow: eb, title, body, points, media, flip = false, tint = false, wide = false }) {
  const phone = useVp();
  const one = phone || wide;
  return (
    <section id={id} style={{ background: tint ? 'var(--surface-canvas)' : 'var(--surface-content)', padding: phone ? '58px 0' : '82px 0' }}>
      <div style={{
        ...wrap, display: 'grid', alignItems: 'center', gap: phone ? 30 : 'clamp(32px,5vw,68px)',
        gridTemplateColumns: one ? '1fr' : 'minmax(280px,0.86fr) minmax(320px,1.14fr)'
      }}>
        {/* copy always leads on a phone — a stacked mockup above the headline buries the point */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, order: flip && !one ? 2 : 1, maxWidth: wide && !phone ? 640 : 'none' }}>
          <span style={eyebrow}>{eb}</span>
          <h2 style={h2}>{title}</h2>
          <p style={lead}>{body}</p>
          {points && (
            <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {points.map(p => (
                <li key={p} style={{ display: 'flex', gap: 10, font: 'var(--type-body)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ display: 'inline-flex', flex: '0 0 auto', marginTop: 3, color: 'var(--text-tertiary)' }}><Icon name="check" size={14} /></span>{p}
                </li>
              ))}
            </ul>
          )}
        </div>
        {media && <div style={{ order: flip && !one ? 1 : 2, minWidth: 0 }}>{media}</div>}
      </div>
    </section>
  );
}

/* REPRICED (Jordan, 2026-08-17): $20 individual, a free tier of four calls, Team not yet a
   thing you can buy. The design shipped two priced cards at $24 / $19-per-seat; the free tier
   is the same four-call allowance being written into supabase/subscriptions_setup.sql, so the
   card and the entitlement say the same number. Card styling is the design's, unchanged —
   `soon` adds the badge and swaps the CTA for a disabled one. */
function Plans() {
  const plan = (name, price, per, detail, points, primary, soon) => (
    <div style={{
      flex: '1 1 260px', background: 'var(--surface-card)', borderRadius: 'var(--radius-card)',
      boxShadow: primary ? 'var(--shadow-raised), 0 0 0 1.5px var(--border-strong)' : 'var(--shadow-card), 0 0 0 1px var(--border-card)',
      padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', gap: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ font: 'var(--type-title)', letterSpacing: 'var(--tracking-title)' }}>{name}</span>
        {primary && <Badge>Most common</Badge>}
        {soon && <Badge>Coming soon</Badge>}
      </div>
      {price && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 34, fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-display)' }}>{price}</span>
          {per && <span style={{ font: 'var(--type-meta)', color: 'var(--text-tertiary)' }}>{per}</span>}
        </div>
      )}
      <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{detail}</span>
      <div style={{ height: 1, background: 'var(--border-hairline)' }} />
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {points.map(p => (
          <li key={p} style={{ display: 'flex', gap: 9, font: 'var(--type-meta)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <span style={{ display: 'inline-flex', flex: '0 0 auto', marginTop: 2, color: 'var(--text-tertiary)' }}><Icon name="check" size={13} /></span>{p}
          </li>
        ))}
      </ul>
      {soon ? (
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38,
          borderRadius: 'var(--radius-full)', font: 'var(--type-body)', fontWeight: 'var(--weight-medium)',
          background: 'var(--action-disabled)', color: 'var(--action-disabled-text)'
        }}>Coming soon</span>
      ) : (
        <a href="#access" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38,
          borderRadius: 'var(--radius-full)', font: 'var(--type-body)', fontWeight: 'var(--weight-medium)',
          background: primary ? 'var(--action-primary)' : 'var(--surface-field)',
          color: primary ? 'var(--action-primary-text)' : 'var(--text-primary)'
        }}>Request access</a>
      )}
    </div>
  );
  return (
    <section id="plans" style={{ background: 'var(--surface-canvas)', padding: 'clamp(58px,7vw,86px) 0 clamp(62px,7vw,92px)' }}>
      <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 'clamp(26px,3vw,40px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
          <span style={eyebrow}>Plans</span>
          <h2 style={h2}>Four calls to try it. Twenty dollars a month after that.</h2>
          <p style={lead}>Every plan is the whole app — notes, tasks, chat and the note graph. The only thing that changes is how much you can record.</p>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {plan('Free', 'Free', '', 'Four calls, so you can find out whether the notes are any good.', ['Four calls, including the write-up on each', 'Mac and Windows', 'Ask your notes, with citations', 'No card'], false, false)}
          {plan('Individual', '$20', '/ month', 'For one person who is in meetings all day.', ['30 hours of recording a week', '8 hours in any single day', 'Mac and Windows', 'Ask your notes, with citations', 'The note graph'], true, false)}
          {plan('Team', '', '', 'Shared folders, pooled hours, and one bill.', ['Everything in Individual, per person', 'Shared folders across the team', 'Pooled hours', 'One invoice'], false, true)}
        </div>
        <div style={{
          display: 'flex', gap: 'clamp(20px,4vw,54px)', flexWrap: 'wrap', alignItems: 'center',
          background: 'var(--surface-card)', borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card), 0 0 0 1px var(--border-card)', padding: '22px 24px'
        }}>
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: 'var(--type-title)', letterSpacing: 'var(--tracking-title)' }}>You always know where you stand</span>
            <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Your limits live in the app, in plain numbers. Prism tells you what is left and leaves it at that — no upsell banner, no red warning at 90%.
            </span>
          </div>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}><LimitsMock /></div>
        </div>
      </div>
    </section>
  );
}

/* One question. Answers stay short — a paragraph that needs a scrollbar means the answer
   belongs in the docs, not here. */
function FaqItem({ q, a, open, onToggle, first }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ borderTop: first ? 'none' : '1px solid var(--border-hairline)' }}>
      <button type="button" onClick={onToggle} aria-expanded={open}
        onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 16, width: '100%', border: 'none',
          background: 'transparent', padding: '19px 4px', cursor: 'pointer', textAlign: 'left',
          color: hover || open ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'color var(--dur-base) var(--ease-standard)'
        }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--site-lead)', fontWeight: 'var(--weight-medium)', letterSpacing: 'var(--tracking-body)', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flex: '0 0 auto', display: 'inline-flex', color: 'var(--text-tertiary)',
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform var(--dur-slow) var(--ease-glide)'
        }}><Icon name="plus" size={17} /></span>
      </button>
      <div style={{
        display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0,
        transition: 'grid-template-rows var(--dur-slow) var(--ease-glide), opacity var(--dur-base) var(--ease-standard)'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ padding: '0 clamp(4px,4vw,46px) 21px 4px', font: 'var(--type-body-l)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

const FAQ = [
  { q: 'Why do I need a key?',
    a: 'Because transcription quality falls apart when you scale it faster than you can check it. We hand out keys in weekly batches so every new account is on infrastructure we have actually tested. Leave your email and you will get one — the queue moves.' },
  { q: 'Does it record without telling anyone?',
    a: 'No. Prism announces itself when it starts on a call, and the recording indicator stays visible for the whole session. Consent law varies by state and country, and it is on you to know which one applies — the app will not do it quietly on your behalf.' },
  { q: 'What happens to the audio?',
    a: 'It is transcribed and then kept with the note on your account. Delete a note and its transcript and audio go with it, in full, not into a recycle bin. Nothing is used to train a model.' },
  { q: 'How accurate is it, honestly?',
    a: 'Good on a clear call, weaker with heavy crosstalk or a bad speakerphone. Names it has not heard before are the usual miss. Every note keeps its transcript, so when a summary reads oddly you can check what was actually said rather than guessing.' },
  { q: 'What counts against my hours?',
    a: 'Recording time only — Prism sitting open costs nothing, and asking your notes is unlimited. The free tier is four calls, including the write-up on each. Paid is 30 hours a week with a cap of 8 in any single day, and the app shows both as plain numbers rather than warning you.' },
  { q: 'Is there an iPhone app?',
    a: 'Not yet. It is being built, and the notes are already stored per account so it will pick up everything you have when it lands. Today Prism is the Mac app and the Windows app, and we would rather say that than take your money for a roadmap.' },
  { q: 'Can it handle a call in another language?',
    a: 'English is the only language we will promise today. Spanish and French transcribe well enough in testing that people use them, but we would rather tell you that than sell it as finished.' },
  { q: 'Does it work if I already use Notion or Apple Notes?',
    a: 'Alongside, yes — Prism is where the conversation lands, and plenty of people copy the decision out into wherever their team already lives. There is no two-way sync, and pretending otherwise would just break quietly.' },
  { q: 'What if I stop paying?',
    a: 'Recording stops. Your notes stay readable and exportable for as long as the account exists, because they are yours and holding them hostage is not a business model.' }
];

function Faq() {
  const phone = useVp();
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ background: 'var(--surface-content)', padding: 'clamp(58px,7vw,86px) 0 clamp(62px,7vw,92px)' }}>
      <div style={{ ...wrap, display: 'grid', gap: phone ? 24 : 'clamp(28px,5vw,64px)', gridTemplateColumns: phone ? '1fr' : 'minmax(240px,0.7fr) minmax(320px,1.3fr)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: phone ? 'static' : 'sticky', top: 92 }}>
          <span style={eyebrow}>Questions</span>
          <h2 style={h2}>The ones worth asking.</h2>
          <p style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Anything missing? <a href="#access" style={{ color: 'var(--text-primary)', textDecoration: 'underline', textDecorationColor: 'var(--border-strong)', textUnderlineOffset: 3 }}>Ask us directly</a>.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} first={i === 0} open={open === i} onToggle={() => setOpen(o => o === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CloseSection() {
  return (
    <section id="access" style={{ background: 'var(--surface-canvas)', padding: 'clamp(62px,7vw,92px) 0 clamp(68px,8vw,100px)' }}>
      <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', textAlign: 'center' }}>
        <span style={eyebrow}>Request access</span>
        <h2 style={{ ...h2, maxWidth: 620 }}>Prism is invite only while we keep the transcripts honest.</h2>
        <p style={{ ...lead, maxWidth: 560 }}>
          Leave your email and we will send a key. Already have one? Enter it on first launch and the
          app unlocks on that device.
        </p>
        <RequestField />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, font: 'var(--type-micro)', color: 'var(--text-tertiary)' }}>
          <Kbd>⌃</Kbd><Kbd>K</Kbd>opens search from anywhere in the app
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const col = (title, links) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 130 }}>
      <span style={{ ...eyebrow }}>{title}</span>
      {links.map(l => <a key={l} href="#top" style={{ font: 'var(--type-meta)', color: 'var(--text-secondary)' }}>{l}</a>)}
    </div>
  );
  return (
    <footer style={{ background: 'var(--surface-canvas)', borderTop: '1px solid var(--border-hairline)', padding: '44px 0 40px' }}>
      <div style={{ ...wrap, display: 'flex', gap: 'clamp(28px,5vw,72px)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Wordmark size={18} />
          <span style={{ font: 'var(--type-micro)', color: 'var(--text-tertiary)', maxWidth: 260, lineHeight: 1.6 }}>
            Recordings are processed and stored on your account. You can delete any note, and its
            transcript goes with it.
          </span>
        </div>
        {col('Product', ['Mac app', 'Windows app', 'What is new', 'Status'])}
        {col('Company', ['About', 'Careers', 'Contact'])}
        {col('Legal', ['Privacy', 'Terms', 'Recording consent', 'Security'])}
      </div>
      <div style={{ ...wrap, marginTop: 34, display: 'flex', gap: 14, flexWrap: 'wrap', font: 'var(--type-micro)', color: 'var(--text-tertiary)' }}>
        <span>© 2026 Prism</span><span style={{ opacity: .5 }}>·</span>
        <span>Check your local law before recording a call.</span>
      </div>
    </footer>
  );
}

export { SiteNav, Hero, Steps, FeatureRow, Plans, Faq, FaqItem, CloseSection, SiteFooter, RequestField };
