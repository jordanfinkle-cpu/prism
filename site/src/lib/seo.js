import { FAQ } from './faq.js'

export const TITLE = 'Prism — You take the call. Prism takes the notes.'
export const DESCRIPTION =
  'Prism records your calls from your own computer and writes the note seconds after you hang up. No bot joins the meeting. Free and invite only — request access.'

export const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Prism',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'macOS, Windows',
  url: 'https://www.downloadprism.com/',
  description:
    'A call-notes app that records both sides from your own computer and writes the note when you hang up. No bot joins the meeting.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/LimitedAvailability',
  },
}

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}
