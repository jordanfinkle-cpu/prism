import { ACCENTS } from './fixtures.js'

/* One dot per recording, joined where two calls share a person, a company or a
   topic. Positions are precomputed rather than simulated: a force layout that
   settles while you watch is a different product than the one being described,
   and it costs a frame budget for nothing. */

const NODES = [
  { x: 176, y: 118, d: 5, c: 'blue' },
  { x: 268, y: 84, d: 3, c: 'blue' },
  { x: 118, y: 196, d: 4, c: 'blue' },
  { x: 246, y: 186, d: 6, c: 'blue' },
  { x: 348, y: 148, d: 2, c: 'orange' },
  { x: 420, y: 206, d: 4, c: 'orange' },
  { x: 330, y: 254, d: 3, c: 'orange' },
  { x: 462, y: 124, d: 2, c: 'orange' },
  { x: 208, y: 286, d: 2, c: 'violet' },
  { x: 286, y: 330, d: 3, c: 'violet' },
  { x: 132, y: 312, d: 1, c: 'violet' },
  { x: 398, y: 318, d: 2, c: 'red' },
  { x: 470, y: 278, d: 1, c: 'red' },
  { x: 92, y: 132, d: 1, c: 'blue' },
  { x: 302, y: 124, d: 3, c: 'blue' },
  { x: 386, y: 88, d: 1, c: 'orange' },
]

const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 14], [0, 13], [1, 14], [2, 3], [3, 14], [3, 8],
  [3, 9], [4, 5], [4, 6], [4, 7], [4, 15], [5, 6], [5, 11], [5, 7], [8, 9],
  [8, 10], [9, 11], [11, 12], [3, 4], [9, 10],
]

export default function GraphDots({ w = 560, h = 400 }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block', maxWidth: w }} aria-hidden="true">
      <g stroke="rgba(24,24,25,.14)" strokeWidth="1">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
        ))}
      </g>
      <g>
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={4.5 + Math.sqrt(n.d) * 2.5} fill={ACCENTS[n.c]} opacity="0.9" />
        ))}
      </g>
      <g fill="#9A9A9C" fontSize="11" fontWeight="500" opacity="0.85">
        <text x={246} y={166}>Kestrel Supply</text>
        <text x={420} y={186}>Freight</text>
        <text x={286} y={354}>Hiring</text>
      </g>
    </svg>
  )
}
