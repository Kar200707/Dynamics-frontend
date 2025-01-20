import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageDominantColorService {
  constructor() {}

  async getDominantColors(imageUrl: string): Promise<string[]> {
    try {
      const image = await this.loadImage(imageUrl);
      const colors = this.getMostVibrantAndSecondColor(image);
      return colors.map(
        (color) => `rgb(${color.r}, ${color.g}, ${color.b})`
      );
    } catch (error) {
      console.error('Error extracting dominant colors:', error);
      return ['rgb(0, 0, 0)', 'rgb(0, 0, 0)'];
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

  private getMostVibrantAndSecondColor(imgEl: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas not supported');

    canvas.width = imgEl.naturalWidth || imgEl.width;
    canvas.height = imgEl.naturalHeight || imgEl.height;
    context.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      return this.findMostVibrantAndSecondColor(imageData.data);
    } catch (e) {
      throw new Error('Unable to access image data, possible cross-origin issue');
    }
  }

  private findMostVibrantAndSecondColor(data: Uint8ClampedArray) {
    let maxSaturation = 0;
    let vibrantColor = { r: 0, g: 0, b: 0 };
    let secondColor = { r: 0, g: 0, b: 0 };

    // Массив цветов с насыщенностью и яркостью
    const colors: Array<{ r: number; g: number; b: number; s: number; l: number }> = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const { s, l } = this.rgbToHsl(r, g, b);

      // Добавляем цвета с нужными параметрами
      if (l > 0.3 && l < 0.7 && s > 0.3) {
        colors.push({ r, g, b, s, l });
      }

      // Ищем самый насыщенный цвет
      if (s > maxSaturation && l > 0.3 && l < 0.6) {
        maxSaturation = s;
        vibrantColor = { r, g, b };
      }
    }

    // Корректируем второй цвет с небольшим отличием в оттенке
    const vibrantHsl = this.rgbToHsl(vibrantColor.r, vibrantColor.g, vibrantColor.b);

    // Изменяем оттенок второго цвета на небольшой угол
    const adjustedHsl = {
      h: (vibrantHsl.h + 0.05) % 1, // Увеличиваем оттенок на 5% (можно изменить для большей разницы)
      s: vibrantHsl.s, // Оставляем насыщенность без изменений
      l: vibrantHsl.l, // Яркость оставляем без изменений
    };

    const adjustedRgb = this.hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    secondColor = {
      r: adjustedRgb.r,
      g: adjustedRgb.g,
      b: adjustedRgb.b,
    };

    return [vibrantColor, secondColor];
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

  private hslToRgb(h: number, s: number, l: number) {
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }
}
