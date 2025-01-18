import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageDominantColorService {
  constructor() {}

  async getDominantColor(imageUrl: string): Promise<string> {
    try {
      const image = await this.loadImage(imageUrl);
      const vibrantColor = this.getMostVibrantColor(image);
      return `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
    } catch (error) {
      console.error('Error extracting dominant color:', error);
      return 'rgb(0, 0, 0)';
    }
  }

  private loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Error loading image'));
    });
  }

  private getMostVibrantColor(imgEl: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas not supported');

    canvas.width = imgEl.naturalWidth || imgEl.width;
    canvas.height = imgEl.naturalHeight || imgEl.height;
    context.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      return this.findMostVibrantColor(imageData.data);
    } catch (e) {
      throw new Error('Unable to access image data, possible cross-origin issue');
    }
  }

  private findMostVibrantColor(data: Uint8ClampedArray) {
    let maxSaturation = 0;
    let vibrantColor = { r: 0, g: 0, b: 0 };

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const { s, l } = this.rgbToHsl(r, g, b);

      // Условия для выбора приятного цвета
      if (s > maxSaturation && l > 0.3 && l < 0.6) {
        maxSaturation = s;
        vibrantColor = this.adjustBrightness({ r, g, b }, 0.8); // Приглушаем цвет
      }
    }

    return vibrantColor;
  }

  private adjustBrightness(color: { r: number; g: number; b: number }, factor: number) {
    return {
      r: Math.min(255, color.r * factor),
      g: Math.min(255, color.g * factor),
      b: Math.min(255, color.b * factor),
    };
  }

  private rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta) {
      if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h /= 6;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
  }
}
