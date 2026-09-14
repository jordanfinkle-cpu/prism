/* From claude.ai/design project 87613f02 — site/Site.jsx, verbatim.
   ADAPTED: imports/export replace the design project's script globals. Page body untouched. */
import React from 'react'
import { SiteNav, Hero, Steps, FeatureRow, Plans, Faq, CloseSection, SiteFooter } from './Sections.jsx'
import { ChatMock, TasksMock, FoldersMock, CallIslandMock } from './Mockups.jsx'

/* The page. Sections alternate white and grey exactly as the app does — chrome grey, content
   white — so the site reads as the same surface as the product. */
function PrismSite() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Steps />

        <FeatureRow id="notes" flip
          eyebrow="Notes"
          title="Your folders. Prism just puts things in them."
          body="Notes arrive titled, dated and filed. Colour is the only decoration in the whole app, and it means one thing: which folder this belongs to."
          points={[
            'Drag a note onto a folder to refile it',
            'Subfolders open beside the list, never nested into nothing',
            'Search every transcript, not just titles'
          ]}
          media={<FoldersMock />} />

        <FeatureRow id="ask" tint
          eyebrow="Ask"
          title="Ask your notes. Read the receipt."
          body="Prism answers from what you actually recorded and shows its work — which notes it read, and how long it took. If it cannot cite an answer, it does not give you one."
          points={[
            'Answers cite the notes they came from',
            'Open any source in one click',
            'Nothing leaves your account to train a model'
          ]}
          media={<ChatMock />} />

        {/* REPLACED THE DESIGN'S GRAPH ROW (Jordan, 2026-08-17): the popup is the moment the
            product is actually judged on, and the note graph is still sold in the Plans list.
            The shot is the design project's `Prism Call Island.html`, on a loop. It runs at a
            fixed 1060px like the hero's Mac window does, so it is scaled to the column rather
            than reflowed, and drops to the card alone on a phone. */}
        <FeatureRow id="calls" wide
          eyebrow="Calls"
          title="The meeting starts. Prism asks once."
          body="A call opens on your Mac and a card appears in the corner — what just started, and one button. Click it and Prism is recording. Ignore it and it drains away. It never joins the meeting as a guest, and it never starts listening on its own."
          points={[
            'Detected on your own Mac — no bot turns up in the participant list',
            'Ignore the card and nothing is recorded',
            'While it runs it is a pill: live level, elapsed time, and stop'
          ]}
          media={<div style={{ marginTop: 'clamp(14px,2.4vw,30px)' }}><CallIslandMock /></div>} />

        {/* WAS THE DESIGN'S iPHONE ROW (Jordan, 2026-08-17): only Mac and Windows ship today,
            so the present-tense phone claims came out. The iPhone is answered honestly in the
            FAQ instead. No shot here for the same reason the design gave: the claim is carried
            by the copy, and the mockups either side of it already show the app. */}
        <FeatureRow id="windows" wide
          eyebrow="Windows"
          title="The same app, twice."
          body="Prism is a native app on macOS and on Windows, and the Windows build mirrors the Mac one rather than wrapping a web page in a window. One account, the same notes and folders, whichever machine you opened."
          points={['macOS 13+ and Windows 10/11', 'Notes and folders sync between them', 'An iPhone app is in the works — not today']} />

        <FeatureRow id="tasks" tint flip
          eyebrow="Tasks"
          title="What you agreed to, pulled out of the conversation."
          body="Prism lifts commitments out of the transcript with the date attached, so the thing you promised on a Tuesday call is waiting for you on Thursday."
          points={['Due dates read the way you said them', 'Check them off on either machine', 'Nothing nags you']}
          media={<TasksMock />} />

        <Plans />
        <Faq />
        <CloseSection />
      </main>
      <SiteFooter />
    </>
  );
}

export default PrismSite
