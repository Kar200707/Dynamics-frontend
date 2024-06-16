import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageColorService {

  constructor() { }

  getAverageRGB(imgURL: string): Promise<{r: number, g: number, b: number}> {
    return new Promise((resolve, reject) => {
      let imgEl = new Image();
      imgEl.src = imgURL;
      imgEl.crossOrigin = "Anonymous";

      imgEl.onload = () => {
        let blockSize = 5, // only visit every 5 pixels
          defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
          canvas = document.createElement('canvas'),
          context = canvas.getContext && canvas.getContext('2d'),
          data, width, height,
          i = -4,
          length,
          rgb = {r:0,g:0,b:0},
          count = 0;

        if (!context) {
          resolve(defaultRGB);
          return;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
          data = context.getImageData(0, 0, width, height);
        } catch(e) {
          resolve(defaultRGB);
          return;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
          ++count;
          rgb.r += data.data[i];
          rgb.g += data.data[i + 1];
          rgb.b += data.data[i + 2];
        }

        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        resolve(rgb);
      };

      imgEl.onerror = (err) => {
        reject(err);
      };
    });
  }
}
