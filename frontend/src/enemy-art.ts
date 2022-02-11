import img1 from './assets/enemies/ElfFemale_Spearwoman.png'
import img2 from './assets/enemies/GoblinFemale_Light.png'
import img3 from './assets/enemies/GoblinMale_Heavy.png'
import img4 from './assets/enemies/GoblinMale_Light.png'
import img5 from './assets/enemies/HumanFemale_Archer.png'
import img6 from './assets/enemies/HumanMale_Bandit.png'
import img7 from './assets/enemies/HumanMale_Knight.png'
import img8 from './assets/enemies/monster-12.png'
import img9 from './assets/enemies/monster-06.png'

const allImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

export function getEnemyArt(enemyID: number) {
  return allImages[enemyID % allImages.length]
}
