import { createRoot } from 'react-dom/client'
import './styles.css'
import PrismSite from './site/Site.jsx'

/* No StrictMode, matching the design project's own mount (site/index.html). It is not
   cosmetic here: StrictMode double-invokes effects, and NodeGraph's force simulation is
   started in one — the second pass restarts it against a settled layout and the graph
   collapses into a knot in the middle of the canvas. */
createRoot(document.getElementById('root')).render(<PrismSite />)
