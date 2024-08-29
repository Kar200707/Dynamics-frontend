import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class ImageColorService {

  private loadImage(imgURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgURL;
      img.crossOrigin = 'Google'; // Handle cross-origin requests

      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error('Failed to load image.'));
    });
  }

  getAverageRGB(imgURL: string): Promise<{ r: number, g: number, b: number }> {
    return this.loadImage(imgURL).then(img => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Canvas context not supported.');
        return { r: 0, g: 0, b: 0 };
      }

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      context.drawImage(img, 0, 0);

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        return { r, g, b };
      } catch (e) {
        console.error('Error processing image data:', e);
        return { r: 0, g: 0, b: 0 };
      }
    }).catch(err => {
      console.error('Image loading error:', err);
      return { r: 0, g: 0, b: 0 };
    });
  }
}
