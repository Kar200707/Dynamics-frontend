import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerControllerService {
  private playerInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  playerInfo$:Observable<any> = this.playerInfo.asObservable();
  private actPlayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  actPlayer$:Observable<any> = this.actPlayer.asObservable();
  private addFavorite: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  addFavorite$:Observable<any> = this.addFavorite.asObservable();
  private trackId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  trackId$:Observable<any> = this.trackId.asObservable();
  private trackIndex: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  trackIndex$:Observable<any> = this.trackIndex.asObservable();
  private backgroundUrl: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  backgroundUrl$:Observable<any> = this.backgroundUrl.asObservable();
  private color: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  color$:Observable<any> = this.color.asObservable();
  private isOpened: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isOpened$:Observable<any> = this.isOpened.asObservable();
  private timer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  timer$:Observable<any> = this.timer.asObservable();

  constructor() {}

  setList (list: any[], listName: string) {
    this.playerInfo.next({ name: listName, list });
  }

  setTrackId(trackId: string) {
    this.trackId.next(trackId);
  }

  onActPlayer(act:string) {
    this.actPlayer.next(act);
  }

  addFavoriteTrack(track: any) {
    this.addFavorite.next(track);
  }

  setBackground(bgUrl: string) {
    this.backgroundUrl.next(bgUrl);
  }

  setTrackIndex(index: number) {
    this.trackIndex.next(index);
  }

  setImageColor(imgUrl: string) {
    // this.imageColor.getAverageRGB(imgUrl).then(rgb => {
    //   this.color.next(rgb);
    // });
  }

  setIsOpenedPlayer(isOpened: boolean) {
    this.isOpened.next(isOpened);
  }

  setTimer(timer: number | null | string) {
    this.timer.next(timer);
  }
}
