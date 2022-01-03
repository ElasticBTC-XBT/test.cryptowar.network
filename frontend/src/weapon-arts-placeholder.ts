import swordAir01 from './assets/sword/sword-air-01.png';
import swordAir02 from './assets/sword/sword-air-02.png';
import swordAir03 from './assets/sword/sword-air-03.png';
import swordAir04 from './assets/sword/sword-air-04.png';
import swordAir05 from './assets/sword/sword-air-05.png';
import swordAir06 from './assets/sword/sword-air-06.png';

import swordWater01 from './assets/sword/sword-water-01.png';
import swordWater02 from './assets/sword/sword-water-02.png';
import swordWater03 from './assets/sword/sword-water-03.png';
import swordWater04 from './assets/sword/sword-water-04.png';
import swordWater05 from './assets/sword/sword-water-05.png';
import swordWater06 from './assets/sword/sword-water-06.png';

import swordFire01 from './assets/sword/sword-fire-01.png';
import swordFire02 from './assets/sword/sword-fire-02.png';
import swordFire03 from './assets/sword/sword-fire-03.png';
import swordFire04 from './assets/sword/sword-fire-04.png';
import swordFire05 from './assets/sword/sword-fire-05.png';
import swordFire06 from './assets/sword/sword-fire-06.png';

import swordEarth01 from './assets/sword/sword-earth-01.png';
import swordEarth02 from './assets/sword/sword-earth-02.png';
import swordEarth03 from './assets/sword/sword-earth-03.png';
import swordEarth04 from './assets/sword/sword-earth-04.png';
import swordEarth05 from './assets/sword/sword-earth-05.png';
import swordEarth06 from './assets/sword/sword-earth-06.png';


import { IWeapon } from './interfaces';

const WeaponArt = {
  Lightning: [
    swordAir01,
    swordAir02,
    swordAir03,
    swordAir04,
    swordAir05,
    swordAir06,
  ],
  Water: [
    swordWater01,
    swordWater02,
    swordWater03,
    swordWater04,
    swordWater05,
    swordWater06,
  ],
  Fire: [
    swordFire01,
    swordFire02,
    swordFire03,
    swordFire04,
    swordFire05,
    swordFire06,
  ],
  Earth: [
    swordEarth01,
    swordEarth02,
    swordEarth03,
    swordEarth04,
    swordEarth05,
    swordEarth06,
  ]
};

export function getWeaponArt(weapon: IWeapon) {
  if (!weapon) {
    return null;
  }

  if (!Object.keys(WeaponArt).includes(weapon.element)){
    return null;
  }
  // @ts-ignore
  return WeaponArt[weapon.element][weapon.stars];
}
