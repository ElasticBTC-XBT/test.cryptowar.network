import img1 from './assets/images/fire.png';
import img2 from './assets/images/earth.png';
import img3 from './assets/images/lightning.png';
import img4 from './assets/images/water.png';


const allImages = [img1, img2, img3, img4];

export function getEnemyArtAround(enemyID: number) {
  for(const i in allImages){
    if(Number(i) === enemyID){
      return allImages[i];
    }
  }
}
