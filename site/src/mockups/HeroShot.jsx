import Fit from './Fit.jsx'
import HeroLoop from './HeroLoop.jsx'

/* Kept apart from shots.jsx on purpose: that module reaches for the animation
   library, and this one is above the fold. */
export default function HeroShot() {
  return (
    <Fit w={1040} h={640}>
      <HeroLoop />
    </Fit>
  )
}
