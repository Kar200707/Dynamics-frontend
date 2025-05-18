import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {PlayerControllerService} from "../../services/player-controller.service";
import {HttpClientModule} from "@angular/common/http";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import localforage from "localforage";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {environment} from "../../../environment/environment";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {filter} from "rxjs";
import {NgOptimizedImage} from "@angular/common";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-pc-nav-panel',
  standalone: true,
  imports: [
    MatIcon,
    HttpClientModule,
    RouterLink,
    ResizeHeightDirective,
    NgOptimizedImage
  ],
  templateUrl: './pc-nav-panel.component.html',
  styleUrl: './pc-nav-panel.component.css'
})
export class PcNavPanelComponent implements OnInit {
  trackList?: any;
  trackPlayId!: string;
  token: string | null = localStorage.getItem('token');
  listIsPlay:boolean = false;
  routePath: string = 'home';
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
    private router: Router,
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentRoutePath = event.urlAfterRedirects.split('?')[0];

      switch (currentRoutePath) {
        case '/home/playlists':
          this.routePath = 'home';
          break;
        case '/home/library':
          this.routePath = 'library';
          break;
        case '/home/search':
          this.routePath = 'search';
          break;
        default:
          this.routePath = '';
      }
    });
  }

  async getFavoriteTracksList() {
    if (innerWidth > 850) {
      const cachedHistoryList = await localforage.getItem('favoritesTracksList');
      if (!cachedHistoryList) {
        const platform = Capacitor.getPlatform();

        if (platform !== 'web') {
          await Haptics.impact({style: ImpactStyle.Light});
        }
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
            const platform = Capacitor.getPlatform();

            if (platform !== 'web') {
              await Haptics.impact({style: ImpactStyle.Light});
            }
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
    this.playerController.setList(this.trackList, "Favorites");
  }
}
