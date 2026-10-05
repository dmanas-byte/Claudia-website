import { Floor } from './objects/Floor'
import { Lights } from './objects/Lights'
import { Smoke } from './objects/Smoke'
import { Spotlights } from './objects/Spotlights'
import { CursorSpot } from './objects/CursorSpot'
import { GoldDust } from './objects/GoldDust'
import { Backpack } from './objects/Backpack'
import { Octagon } from './objects/Octagon'
import { Towers } from './objects/Towers'
import { City } from './objects/City'
import { GoldParticles } from './objects/GoldParticles'
import { Constellation } from './objects/Constellation'
import { TerminalWall } from './objects/TerminalWall'
import { Phone } from './objects/Phone'
import { Seats } from './objects/Seats'
import { LightRig } from './objects/LightRig'
import { Round1 } from './objects/rounds/Round1'
import { Round2 } from './objects/rounds/Round2'
import { Round3 } from './objects/rounds/Round3'
import { Round4 } from './objects/rounds/Round4'
import { Round5 } from './objects/rounds/Round5'
import { Round6 } from './objects/rounds/Round6'

/**
 * The whole set, always mounted. Every object decides its own visibility
 * from `readScene()` inside useFrame (never by mounting/unmounting), so the
 * canvas never hitches on a cut.
 */
export function Set() {
  return (
    <>
      <Lights />
      <Floor />
      <Smoke />
      <Spotlights />
      <CursorSpot />
      <GoldDust />
      <Octagon />
      <Backpack />
      <GoldParticles />
      <Towers />
      <City />
      <Constellation />
      <TerminalWall />
      <Phone />
      <Seats />
      <LightRig />
      <Round1 />
      <Round2 />
      <Round3 />
      <Round4 />
      <Round5 />
      <Round6 />
    </>
  )
}
