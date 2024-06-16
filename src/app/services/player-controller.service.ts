import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ImageColorService} from "./image-color.service";

@Injectable({
  providedIn: 'root'
})
export class PlayerControllerService {
  private playerInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  playerInfo$:Observable<any> = this.playerInfo.asObservable();
  private backgroundUrl: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  backgroundUrl$:Observable<any> = this.backgroundUrl.asObservable();
  private color: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  color$:Observable<any> = this.color.asObservable();

  constructor(private imageColor: ImageColorService) {}

  setList (list: any[]) {
    this.playerInfo.next(list);
  }

  setBackground(bgUrl: string) {
    this.backgroundUrl.next(bgUrl);
  }

  setImageColor(imgUrl: string) {
    this.imageColor.getAverageRGB(imgUrl).then(rgb => {
      this.color.next(rgb);
    });
  }
}
