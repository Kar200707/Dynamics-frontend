import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {Router, RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import localforage from 'localforage';
import {environment, host} from "../../../environment/environment";
import {MatIcon} from "@angular/material/icon";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AudioCacheService} from "../../services/audio-cache.service";
import {ImageDominantColorService} from "../player/player_functions/image-dominat-color.service";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    MatIcon,
    LoaderIosComponent,
    MatButton,
    MatIconButton
  ],
  providers: [
    RequestService,
    AudioCacheService
  ],
  templateUrl: './playlists-block.component.html',
  styleUrl: './playlists-block.component.css'
})
export class PlaylistsBlockComponent implements OnInit {
  account: any;
  token: string | null = localStorage.getItem('token');
  historyList?: any[];
  newReleasesList?: any[] = [];
  newCollectionsList?: any[] = [];
  podcastsList?: any[] = [];
  isPlaying: boolean = false;
  trackListLoaded: boolean = false;
  trackPlayId: string = '';
  newTrackListLoaded: boolean = false;
  newCollectionsListLoaded: boolean = false;
  isAllSort: boolean = true;
  playlists!: any[];
  isMusicSort: boolean = false;
  isPodcastsSort: boolean = false;
  podcastsListLoaded: boolean = false;
  isLoadedPlaylists: boolean = false;
  isOpenedViewAll1:boolean = false;
  isOpenedViewAll2:boolean = false;
  isOpenedViewAll3:boolean = false;
  isOpenedViewAll4:boolean = false;
  miniPlaylistsArr: number[] = [0, 1]
  isMobile: boolean = innerWidth < 850;
  loadArray: number[] = [
    1,
    2,
    3,
    5,
    6,
    7,
    8,
    9,
    10,
  ]

  constructor(
    private cacheService: AudioCacheService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private imgColorService: ImageDominantColorService,
    private requestService: RequestService,
    private playerController: PlayerControllerService) {}

  async ngOnInit() {
    this.getPlaylistsInCache();
    this.getPlaylists();
    this.loadAccount();
    await this.loadList(
      'historyList',
      { access_token: this.token },
      environment.getPlayHistory,
      (list) => this.historyList = list,
      (v) => this.trackListLoaded = v,
      true
    );

    await this.loadList(
      'newReleasesList',
      { access_token: this.token, searchText: 'новые кальянный рэп music new' },
      environment.searchTracksList,
      (list) => this.newReleasesList = list,
      (v) => this.newTrackListLoaded = v
    );

    await this.loadList(
      'podcastsList',
      { access_token: this.token, searchText: 'Hayeren Podcast' },
      environment.searchTracksList,
      (list) => this.podcastsList = list,
      (v) => this.podcastsListLoaded = v
    );

    await this.loadList(
      'newCollectionsList',
      { access_token: this.token, searchText: 'new Armenian Official Artists Music' },
      environment.searchTracksList,
      (list) => this.newCollectionsList = list,
      (v) => this.newCollectionsListLoaded = v
    );

    this.playerController.trackId$.subscribe(async id => {
      this.trackPlayId = id;
    });
    this.playerController.actPlayer$.subscribe(act => this.isPlaying = act === 'play');

    let lastUpdateTime = new Date();
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const currentTime = new Date();
        const timeDiff = (currentTime.getTime() - lastUpdateTime.getTime()) / (1000 * 60);
        if (timeDiff >= 10) {
          const platform = Capacitor.getPlatform();
          if (platform !== 'web') await Haptics.impact({ style: ImpactStyle.Heavy });

          await localforage.removeItem('historyList');
          await localforage.removeItem('newReleasesList');
          await localforage.removeItem('podcastsList');
          await localforage.removeItem('newCollectionsList');

          this.trackListLoaded = false;
          this.newTrackListLoaded = false;
          this.newCollectionsListLoaded = false;
          this.cdr.detectChanges();

          await this.ngOnInit();
          lastUpdateTime = new Date();
        }
      }
    });
  }

  async getImageColor(trackImage: string) {
   return await this.imgColorService.getDominantColors(host + 'media/cropImage?url=' + trackImage);
  }

  getPlaylists() {
    this.requestService.post<any>(environment.playlistGet, { token: this.token })
      .subscribe(data => {
        this.playlists = data.playlists.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        this.playlists.forEach((playlist: any) => {
          playlist.tracks = playlist.tracks
            .sort((trackA: any, trackB: any) => new Date(trackB.addedAt).getTime() - new Date(trackA.addedAt).getTime());
        });
        this.isLoadedPlaylists = true;
      })
  }

  async getPlaylistsInCache() {
    const keys = await localforage.keys();

    const folderKeys = keys.filter(key => key.startsWith("folder"));

    const folders = await Promise.all(folderKeys.map(async key => {
      const data = await localforage.getItem(key);
      if (data && typeof data === 'string') {
        return JSON.parse(data);
      }
      return data;
    }));
    if (folders.length > 0) {
      this.playlists = folders.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      this.isLoadedPlaylists = true;
    }
  }

  private async loadList<T>(
    cacheKey: string,
    requestPayload: any,
    requestUrl: string,
    listSetter: (list: T[]) => void,
    flagSetter: (value: boolean) => void,
    sortByDate: boolean = false
  ): Promise<void> {
    try {
      const cachedList = await localforage.getItem(cacheKey);
      if (cachedList) {
        listSetter(JSON.parse(cachedList as string));
        flagSetter(true);
      } else if (this.token) {
        this.requestService.post<{ videos: T[] | any }>(requestUrl, requestPayload)
          .subscribe(async (response) => {
            let result = response.videos;

            if (!response.videos) {
              result = response;
            }

            if (sortByDate) {
              result = result.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            }

            listSetter(result);
            flagSetter(true);

            const platform = Capacitor.getPlatform();
            if (platform !== 'web') {
              await Haptics.impact({ style: ImpactStyle.Light });
            }

            this.cdr.detectChanges();
            await localforage.setItem(cacheKey, JSON.stringify(result));
          }, () => {
            flagSetter(false);
          });
      }
    } catch (error) {
      console.error(`Error loading ${cacheKey} list:`, error);
      flagSetter(false);
    }
  }

  loadAccount() {
    if (this.token) {
      this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
        .subscribe(account => {
          this.account = account;
        }, async () => { await this.logout() });
    }
  }

  async logout() {
    localStorage.removeItem('token');
    try {
      await localforage.clear();
      await this.cacheService.clear();
      console.log('localforage cleared');
    } catch (error) {
      console.error('Error clearing localforage:', error);
    }
    this.router.navigate(['/login']);
  }

  setTrack(id: string, index: number, list: any, listName: string) {
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(list as any[], listName);
  }

  protected readonly innerWidth = innerWidth;
  protected readonly console = console;
  protected readonly Haptics = Haptics;
  protected readonly ImpactStyle = ImpactStyle;
}
