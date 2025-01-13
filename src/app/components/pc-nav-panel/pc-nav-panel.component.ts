import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {PlayerControllerService} from "../../services/player-controller.service";
import {HttpClientModule} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import localforage from "localforage";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {environment} from "../../../environment/environment";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";

@Component({
  selector: 'app-pc-nav-panel',
  standalone: true,
  imports: [
    MatIcon,
    HttpClientModule,
    RouterLink,
    ResizeHeightDirective
  ],
  templateUrl: './pc-nav-panel.component.html',
  styleUrl: './pc-nav-panel.component.css'
})
export class PcNavPanelComponent implements OnInit {
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
    this.playerController.addFavorite$.subscribe(async track => {
      await this.getFavoriteTracksList();
    })
  }

  async getFavoriteTracksList() {
    if (innerWidth > 850) {
      const cachedHistoryList = await localforage.getItem('favoritesTracksList');
      if (!cachedHistoryList) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
      try {
        if (cachedHistoryList) {
          this.trackList = JSON.parse(cachedHistoryList as string).slice(0, 5);
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
            await localforage.setItem('favoritesTracksList', JSON.stringify(sortedTrackList));
            await Haptics.impact({ style: ImpactStyle.Light });
          }
        });
      } catch (e) {
        console.error('Error loading history list from cache:', e);
        this.trackList = null;
      }
    }
  }

  setTrack(id: string, index: number) {
    this.listIsPlay = true;
    this.trackPlayId = id;
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
