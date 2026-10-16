/* Every invented name, number and date on the site lives here.

   They are fiction and should read like it on inspection: no real company, no
   real person, no figure anyone could mistake for a Prism metric. Deal-desk
   flavour, because that is who the app is for. */

export const ACCENTS = {
  blue: '#0A84FF',
  red: '#FF3B30',
  green: '#30D158',
  violet: '#8A2BFF',
  orange: '#FF9500',
  yellow: '#FFD60A',
  pink: '#FF2DA6',
}

export const DISC = {
  blue: 'linear-gradient(135deg,#0A84FF,#6AA0FF)',
  red: 'linear-gradient(135deg,#FF3B30,#FF2DA6)',
  green: 'linear-gradient(135deg,#30D158,#4DD6E8)',
  violet: 'linear-gradient(135deg,#8A2BFF,#E879C6)',
  orange: 'linear-gradient(135deg,#FF9500,#FFD60A)',
}

export const FOLDERS = [
  { name: 'Clients', color: 'blue' },
  { name: 'Vendors', color: 'orange' },
  { name: 'Hiring', color: 'violet' },
  { name: 'Ideas', color: 'red' },
]

export const NOTES = [
  {
    title: 'Renewal call — Kestrel Supply',
    folder: 'Clients',
    color: 'blue',
    time: '9:40 AM',
    snippet:
      'Agreed to hold the annual rate through March. Their finance lead wants the payoff letter before the board packet goes out on the 18th.',
  },
  {
    title: 'Ship dates, Q3 containers',
    folder: 'Vendors',
    color: 'orange',
    time: 'Yesterday',
    snippet:
      'Two of the four containers slip a week. They will cover the freight difference if we confirm the revised window by Friday.',
  },
  {
    title: 'Second round — ops manager',
    folder: 'Hiring',
    color: 'violet',
    time: 'Yesterday',
    snippet: 'Strong on warehouse systems, thin on vendor negotiation. Wants a decision by the 22nd.',
  },
  {
    title: 'Rate lock expiring',
    folder: 'Clients',
    color: 'blue',
    time: 'Monday',
    snippet:
      'Lock runs out the 30th. They asked what an extension costs and whether the appraisal can be reused.',
  },
  {
    title: 'Warehouse walkthrough',
    folder: 'Vendors',
    color: 'orange',
    time: 'Monday',
    snippet: 'Dock two is still down. They think three weeks, which reads optimistic.',
  },
  {
    title: 'Pricing, second pass',
    folder: 'Ideas',
    color: 'red',
    time: 'Last week',
    snippet: 'Per-seat is wrong for the smaller accounts. Worth modelling a floor.',
  },
  {
    title: 'Escrow timing question',
    folder: 'Clients',
    color: 'blue',
    time: 'Last week',
    snippet: 'Funding moves to the 5th if the payoff letter lands late. Nobody wants that.',
  },
  {
    title: 'Freight contract — redline',
    folder: 'Vendors',
    color: 'orange',
    time: 'Last week',
    snippet: 'They struck the fuel surcharge cap. Going back with a middle number.',
  },
]

/* The note the hero writes, and the note chapter 3 takes apart. */
export const NOTE = {
  title: 'Renewal call — Kestrel Supply',
  date: 'Thursday, 11 September',
  folder: 'Clients',
  color: 'blue',
  duration: '41:12',
  summary: [
    'Kestrel is renewing for twelve months. They asked to hold the current annual rate through March and you agreed, on the condition that the signed order lands before the quarter closes.',
    'Their finance lead needs the payoff letter in hand before the board packet goes out on the 18th. That is the date everything else hangs off.',
    'Onboarding for the second site was not settled. They want it inside the same contract; you said you would check what that does to the start date.',
  ],
  actions: [
    { text: 'Send the payoff letter to Dana before the 18th', who: 'You', due: 'Sep 16' },
    { text: 'Confirm whether site two can share the contract start date', who: 'You', due: 'Sep 17' },
    { text: 'Dana to return the signed order form', who: 'Kestrel', due: 'Sep 24' },
  ],
  transcript: [
    { who: 'You', side: 'you', text: 'So the rate you have now runs through March. I can hold that if the order is signed this quarter.' },
    { who: 'Dana', side: 'them', text: 'That works. The thing I need is the payoff letter before our board packet, which goes out on the eighteenth.' },
    { who: 'You', side: 'you', text: 'The sixteenth then, so you have a day either side.' },
    { who: 'Dana', side: 'them', text: 'And the second site — can that sit inside this contract, or is that a separate start date?' },
  ],
}

export const TASKS = [
  { text: 'Send the payoff letter to Dana', note: 'Renewal call — Kestrel Supply', folder: 'Clients', color: 'blue', due: 'Sep 16', done: true },
  { text: 'Confirm the revised container window', note: 'Ship dates, Q3 containers', folder: 'Vendors', color: 'orange', due: 'Sep 15', late: true },
  { text: 'Check whether site two shares the start date', note: 'Renewal call — Kestrel Supply', folder: 'Clients', color: 'blue', due: 'Sep 17' },
  { text: 'Decision on the ops manager', note: 'Second round — ops manager', folder: 'Hiring', color: 'violet', due: 'Sep 22' },
  { text: 'Price the rate-lock extension', note: 'Rate lock expiring', folder: 'Clients', color: 'blue', due: 'Sep 29' },
]

export const CHAT = {
  question: 'What did I promise Kestrel, and when is it due?',
  trace: [
    'Read 3 notes from Clients',
    'Renewal call — Kestrel Supply',
    'Escrow timing question',
  ],
  answer:
    'Two things. You agreed to hold the annual rate through March if the order is signed this quarter, and you said the payoff letter would reach Dana before their board packet on the 18th — you offered the 16th. You also owe an answer on whether the second site can share the contract start date.',
  cites: [
    { title: 'Renewal call — Kestrel Supply', color: 'blue' },
    { title: 'Escrow timing question', color: 'blue' },
  ],
  refusal: {
    question: 'Did they say anything about the freight surcharge?',
    answer: 'Your notes do not say. The Kestrel calls never mention freight, and the surcharge only comes up in the vendor redline, which is a different account.',
  },
}
