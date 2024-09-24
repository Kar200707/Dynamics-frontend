import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {PlayerControllerService} from "../../services/player-controller.service";
import localforage from 'localforage';
import {MatButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {environment} from "../../../environment/environment";
import {NgIf} from "@angular/common";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";

@Component({
  selector: 'app-track-favorites',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatButton,
    HttpClientModule,
    LoaderIosComponent,
    NgIf,
    ResizeHeightDirective
  ],
  providers: [
    RequestService
  ],
  templateUrl: './track-favorites.component.html',
  styleUrl: './track-favorites.component.css'
})
export class TrackFavoritesComponent implements OnInit {
  trackList?: any;
  trackPlayId!: string;
  token: string | null = localStorage.getItem('token');
  listIsPlay:boolean = false;
  loadArray = [
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ]

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService) {
    this.playerController.trackId$.subscribe(id => {
      this.trackPlayId = id;
    })
  }

  ngOnInit() {
    this.getFavoriteTracksList();
    this.playerController.actPlayer$.subscribe(act => {
      if (act === 'pause') {
        this.listIsPlay = false;
      }
      if (act === 'play') {
        this.listIsPlay = true;
      }
    })
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  async getFavoriteTracksList() {
    const cachedHistoryList = await localforage.getItem('favoritesTracksList');
    try {
      if (cachedHistoryList) {
        this.trackList = JSON.parse(cachedHistoryList as string);
      } else {
        this.trackList = null;
      }

      this.requestService.post<any>(
        environment.getFavoriteTracksList,
        { access_token: this.token }
      ).subscribe(async tracksList => {
        if (this.trackList !== tracksList || !cachedHistoryList) {
          const sortedTrackList = tracksList.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
          this.trackList = sortedTrackList;
          console.log(this.trackList)
          await localforage.setItem('favoritesTracksList', JSON.stringify(sortedTrackList));
        }
      });
    } catch (e) {
      console.error('Error loading history list from cache:', e);
      this.trackList = null;
    }
  }

  remFavoriteTrack(id: string) {
    this.requestService.post<any>(environment.remFavorite,
      {
        access_token: this.token,
        trackId: id
      }).subscribe(() => {
        let newTrackArray = []
        this.trackList.forEach(async (track: any) => {
          if (track.videoId !== id) {
            newTrackArray.push(track)
          }
          this.trackList = newTrackArray;
          await localforage.setItem('favoritesTracksList', JSON.stringify(newTrackArray));
        })
    })
  }

  setTrack(id: string, index: number) {
    this.listIsPlay = true;
    this.trackPlayId = id;
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
