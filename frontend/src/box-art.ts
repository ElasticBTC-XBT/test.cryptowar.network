import img1 from './assets/common-box.png'
import img2 from './assets/rare-box.png'
import img3 from './assets/epic-box.png'
import img4 from './assets/blind-box.png'

const allImages = [img1, img2, img3, img4]

export function getBoxArt(idBox: number) {
    for (const i in allImages) {
        if (Number(i) === idBox) {
            return allImages[i]
        }
    }
}
