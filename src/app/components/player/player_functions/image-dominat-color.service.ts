import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageDominantColorService {
  constructor() {}

  async getDominantColor(imageUrl: string): Promise<string> {
    try {
      const image = await this.loadImage(imageUrl);
      const dominantColor = this.getAverageColor(image);
      return `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`;
    } catch (error) {
      throw new Error(`Failed to get dominant color: ${error}`);
    }
  }

  private loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = () => resolve(img);
      img.onerror = () => reject('Error loading image');
    });
  }

  private getAverageColor(imgEl: HTMLImageElement) {
    const blockSize = 5; // Process every 5th pixel
    const defaultRGB = { r: 0, g: 0, b: 0 }; // Default color for non-supporting environments
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    let data, width, height;
    let i = -4;
    let length;
    let rgb = { r: 0, g: 0, b: 0 };
    let count = 0;

    if (!context) {
      return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      return defaultRGB; // Security error when image is from a different domain
    }

    length = data.data.length;

    // Loop over every blockSize-th pixel
    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // Average the RGB values and return the result
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }
}
