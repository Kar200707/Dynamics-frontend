import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangeMetaThemeColorService {

  setThemeColor(color: string, renderer: any) {
    // let themeMetaTag = document.querySelector('meta[name="theme-color"]');
    // if (themeMetaTag) {
    //   renderer.setAttribute(themeMetaTag, 'content', color);
    // } else {
    //   themeMetaTag = renderer.createElement('meta');
    //   renderer.setAttribute(themeMetaTag, 'name', 'theme-color');
    //   renderer.setAttribute(themeMetaTag, 'content', color);
    //   renderer.appendChild(document.head, themeMetaTag);
    // }
  }
}
