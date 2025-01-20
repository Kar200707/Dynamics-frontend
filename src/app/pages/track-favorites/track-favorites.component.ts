import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {PlayerControllerService} from "../../services/player-controller.service";
import localforage from 'localforage';
import {MatButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {environment, host} from "../../../environment/environment";
import {NgIf} from "@angular/common";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {CdkListbox} from "@angular/cdk/listbox";
import {ImageDominantColorService} from "../../components/player/player_functions/image-dominat-color.service";

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
    ResizeHeightDirective,
    CdkListbox
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
  trackImageBackgroundColor: string = 'rgb(84 38 199)'
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
    private imgColorService: ImageDominantColorService,
    private requestService: RequestService,
    private playerController: PlayerControllerService) {  }

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
    if (!cachedHistoryList) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }
    try {
      if (cachedHistoryList) {
        this.trackList = JSON.parse(cachedHistoryList as string);
        this.playerController.trackId$.subscribe(id => {
          this.trackList.forEach(async (track: any) => {
            if (track.videoId === id) {
              console.log(track.videoId);
              const colorsArray:string[] = await this.imgColorService.getDominantColors(host + 'media/cropImage?url=' + track.image);
              this.trackImageBackgroundColor = colorsArray[0];
            }
          })
          this.trackPlayId = id;
        })
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
          this.playerController.trackId$.subscribe(id => {
            this.trackList.forEach(async (track: any) => {
              if (track.videoId === id) {
                console.log(track.videoId);
                const colorsArray:string[] = await this.imgColorService.getDominantColors(host + 'media/cropImage?url=' + track.image);
                this.trackImageBackgroundColor = colorsArray[0];
              }
            })
            this.trackPlayId = id;
          })
          await localforage.setItem('favoritesTracksList', JSON.stringify(sortedTrackList));
          if (!cachedHistoryList) {
            await Haptics.impact({ style: ImpactStyle.Light });
          }
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
