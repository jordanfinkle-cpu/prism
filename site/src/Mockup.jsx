// The hero "app window" — a static, non-interactive replica of the real
// Prism 2.0 UI built from the same HeroUI components the app uses
// (Disclosure sidebar, ListBox lists, Tabs, Avatar orbs, Kbd search hint).
import { Avatar, Button, Disclosure, Kbd, ListBox, Label, Separator, Tabs, Typography } from '@heroui/react'
import { Tri, SearchIcon, HomeIcon, NotesIcon, FolderOpenIcon, FolderClosedIcon, PlusIcon } from './icons.jsx'

const Dot = ({ c }) => <span className="size-2 shrink-0 rounded-full" style={{ background: c }} />

function Folder({ name, color, open, count, children }) {
  return (
    <Disclosure isExpanded={open}>
      <Disclosure.Heading className="flex items-center">
        <Button slot="trigger" size="sm" variant="tertiary"
          className="h-8 min-w-0 flex-1 justify-start gap-2 border-none bg-transparent px-2 text-[13.5px] font-normal">
          <Dot c={color} />
          {open ? <FolderOpenIcon className="size-4 shrink-0" /> : <FolderClosedIcon className="size-4 shrink-0" />}
          <span className="min-w-0 flex-1 truncate text-left">{name}</span>
          {count > 0 && <span className="shrink-0 text-[11px] tabular-nums text-muted">{count}</span>}
          <Disclosure.Indicator className="size-3.5 shrink-0 text-muted" />
        </Button>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body className="p-0">
          <div className="my-0.5 ml-3 border-l border-border pl-2">{children}</div>
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  )
}

export default function Mockup() {
  return (
    <div aria-hidden="true"
      className="pointer-events-none mx-auto mt-16 hidden h-[620px] max-w-[980px] select-none overflow-hidden rounded-2xl border border-border bg-background text-left shadow-[0_30px_90px_rgba(40,35,25,.16)] lg:flex">

      {/* ---------- sidebar ---------- */}
      <aside className="flex w-[230px] shrink-0 flex-col gap-1 border-r border-border px-3 pt-4 pb-3" style={{ background: 'var(--background-secondary)' }}>
        <div className="mb-2 flex items-center gap-2 px-1.5">
          <Tri className="size-5" />
          <span className="text-[15px] font-semibold tracking-tight">Prism</span>
        </div>

        <Button variant="secondary" fullWidth
          className="mb-2 h-8 justify-start gap-2.5 px-2.5 text-[13px] font-normal text-muted">
          <SearchIcon className="size-4" />
          <span className="flex-1 text-left">Search</span>
          <Kbd className="text-[11px]"><Kbd.Abbr keyValue="ctrl" /><Kbd.Content>K</Kbd.Content></Kbd>
        </Button>

        <ListBox aria-label="Navigation" selectionMode="none" className="border-none bg-transparent p-0">
          <ListBox.Item id="home" textValue="Home" className="gap-2.5 py-1.5 text-[13.5px]">
            <HomeIcon className="size-4.5 shrink-0" />
            <Label>Home</Label>
          </ListBox.Item>
          <ListBox.Item id="list" textValue="All notes" className="gap-2.5 py-1.5 text-[13.5px]">
            <NotesIcon className="size-4.5 shrink-0" />
            <Label>All notes</Label>
            <span className="ml-auto text-[11px] tabular-nums text-muted">12</span>
          </ListBox.Item>
        </ListBox>

        <Separator className="my-3" />

        <div className="mb-1 px-1.5">
          <Typography type="body-xs" color="muted" weight="semibold">Folders</Typography>
        </div>

        <Folder name="Work" color="#2E7FFF" open count={3}>
          <ListBox aria-label="Notes in Work" selectionMode="none" className="border-none bg-transparent p-0">
            <ListBox.Item id="n1" textValue="Meeting with boss"
              className="rounded-md py-1 pl-2 text-[12.5px] font-medium" style={{ background: 'var(--sidebar-active)' }}>
              <span className="truncate">Meeting with boss</span>
            </ListBox.Item>
            <ListBox.Item id="n2" textValue="Call with Jeffrey" className="py-1 pl-2 text-[12.5px] text-muted">
              <span className="truncate">Call with Jeffrey</span>
            </ListBox.Item>
            <ListBox.Item id="n3" textValue="Quarterly budget review" className="py-1 pl-2 text-[12.5px] text-muted">
              <span className="truncate">Quarterly budget review</span>
            </ListBox.Item>
          </ListBox>
          <Button size="sm" variant="ghost" className="h-7 w-full justify-start gap-1.5 px-2 text-[12px] font-normal text-muted">
            <PlusIcon className="size-3" /> Add folder
          </Button>
        </Folder>
        <Folder name="Clients" color="#2EFF6B" count={5} />
        <Folder name="Personal" color="#FF7A1A" count={4} />

        <div className="flex-1" />

        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium leading-tight">Alex Morgan</div>
            <div className="truncate text-[11px] text-muted">alex@example.com</div>
          </div>
          <img src="avatars/blue.jpg" alt="" className="orb size-7" />
        </div>
      </aside>

      {/* ---------- note view ---------- */}
      <main className="flex min-w-0 flex-1 flex-col bg-background">
        <div className="flex items-center justify-between px-6 py-3 text-[12px] text-muted">
          <span>‹ Work</span>
          <span className="flex gap-4"><span>Share</span><span>···</span></span>
        </div>
        <div className="flex flex-1 justify-center overflow-hidden px-8">
          <div className="w-[560px] max-w-full">
            <div className="mb-2.5 text-[11px] text-muted">Work · June 23, 2026</div>
            <h3 className="mb-3 text-2xl font-semibold tracking-tight">Meeting with boss</h3>
            <div className="mb-4 flex items-center gap-2.5 text-[11.5px] text-muted">
              <div className="flex items-center">
                <img src="avatars/green.jpg" alt="" className="orb size-[22px] border-2 border-background" />
                <img src="avatars/blue.jpg" alt="" className="orb -ml-2 size-[22px] border-2 border-background" />
              </div>
              <span>2 attendees</span><span>·</span><span>32 min</span><span>·</span>
              <span className="flex items-center gap-1.5"><span className="size-[5px] rounded-full bg-danger" />Recorded</span>
            </div>

            <Tabs selectedKey="prism" className="mb-4">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Note views">
                  <Tabs.Tab id="prism"><span className="flex items-center gap-1.5"><Tri className="size-3.5" /> Prism notes</span><Tabs.Indicator /></Tabs.Tab>
                  <Tabs.Tab id="my">My notes<Tabs.Indicator /></Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>

            <div className="mb-3 flex items-center justify-between text-[11px] text-muted">
              <span>Synthesized from your notes, the transcript &amp; audio</span>
              <span>↻ Regenerate</span>
            </div>

            <div className="mb-2 text-[12px] font-semibold">Summary</div>
            <div className="mb-1.5 flex gap-2.5 text-[13px] leading-relaxed">
              <span className="text-muted">•</span>
              <span>The Q3 budget is approved at the number discussed — final sign-off lands Friday.</span>
            </div>
            <div className="mb-3 flex gap-2.5 text-[13px] leading-relaxed">
              <span className="text-muted">•</span>
              <span>The launch moves up two weeks, so the design review shifts to next Thursday.</span>
            </div>

            <div className="mb-2 text-[12px] font-semibold">Action items</div>
            <div className="mb-1.5 flex items-start gap-2.5 text-[13px] leading-relaxed">
              <span className="mt-1 size-3.5 shrink-0 rounded border-[1.5px] border-border" />
              <span>Send the revised timeline to Jeffrey by Friday.</span>
            </div>
            <div className="mb-4 flex items-start gap-2.5 text-[13px] leading-relaxed">
              <span className="mt-1 size-3.5 shrink-0 rounded border-[1.5px] border-border" />
              <span>Book the follow-up for Thursday at 2 PM.</span>
            </div>

            <Separator className="mb-3" />
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-muted">TRANSCRIPT</span>
              <span className="text-[11px] text-muted">View full ›</span>
            </div>
            <div className="flex gap-2.5">
              <img src="avatars/green.jpg" alt="" className="orb mt-0.5 size-[26px]" />
              <div className="min-w-0">
                <div className="mb-1 text-[11px] font-semibold text-muted">Dana <span className="font-normal opacity-70">12:31</span></div>
                <div className="w-fit rounded-xl px-3 py-2 text-[12.5px] leading-relaxed" style={{ background: 'var(--surface-secondary)' }}>
                  Let's lock the Q3 number and move the launch up two weeks — can you make that work?
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2.5">
              <img src="avatars/blue.jpg" alt="" className="orb mt-0.5 size-[26px]" />
              <div className="min-w-0">
                <div className="mb-1 text-[11px] font-semibold text-muted">Me <span className="font-normal opacity-70">12:32</span></div>
                <div className="w-fit rounded-xl px-3 py-2 text-[12.5px] leading-relaxed" style={{ background: 'var(--accent-soft)' }}>
                  I can. I'll send you the revised timeline by Friday.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
