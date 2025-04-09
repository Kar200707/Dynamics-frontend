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
import {MatButton} from "@angular/material/button";
import {AudioCacheService} from "../../services/audio-cache.service";
import {ImageDominantColorService} from "../player/player_functions/image-dominat-color.service";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    MatIcon,
    LoaderIosComponent,
    MatButton
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
  devices: any[] = [];
  newReleasesList?: any[];
  newCollectionsList?: any[];
  isPlaying: boolean = false;
  trackListLoaded: boolean = false;
  trackPlayId: string = '';
  newTrackListLoaded: boolean = false;
  newCollectionsListLoaded: boolean = false;
  isOpenedViewAll1:boolean = false;
  isOpenedViewAll2:boolean = false;
  isOpenedViewAll3:boolean = false;
  typesListDictionary: number[] = [1, 2, 3];
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
    this.loadAccount();
    await this.loadHistoryList();
    await this.loadNewReleasesList();
    await this.loadNewCollectionsList();

    let lastUpdateTime = new Date();

    this.playerController.trackId$.subscribe(id => {
      this.trackPlayId = id;
    })

    this.playerController.actPlayer$.subscribe(act => {
      if (act === 'pause') {
        this.isPlaying = false;
      }
      if (act === 'play') {
        this.isPlaying = true;
      }
    })

    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const currentTime = new Date();
        const timeDifference = (currentTime.getTime() - lastUpdateTime.getTime()) / (1000 * 60);

        if (timeDifference >= 10) {
          await Haptics.impact({ style: ImpactStyle.Heavy });
          await localforage.removeItem("historyList");
          await localforage.removeItem("newReleasesList");
          await localforage.removeItem("newCollectionsList");

          this.trackListLoaded = false;
          this.newTrackListLoaded = false;
          this.newCollectionsListLoaded = false;
          this.cdr.detectChanges();

          await this.loadHistoryList();
          await this.loadNewReleasesList();
          await this.loadNewCollectionsList();

          lastUpdateTime = new Date();
        }
      }
    });
  }

  async getImageColor(trackImage: string) {
   return await this.imgColorService.getDominantColors(host + 'media/cropImage?url=' + trackImage);
  }

  async loadNewReleasesList() {
    try {
      const cachedHistoryList = await localforage.getItem('newReleasesList');

      if (cachedHistoryList) {
        this.newReleasesList = JSON.parse(cachedHistoryList as string);
        this.newTrackListLoaded = true;
      } else {
        if (this.token) {
          this.requestService.post<any[]>(environment.searchTracksList, { access_token: this.token, searchText: 'new music releases lang:am' })
            .subscribe(async list => {
              this.newTrackListLoaded = true;
              await Haptics.impact({ style: ImpactStyle.Light });
              this.newReleasesList = list;
              this.cdr.detectChanges();
              await localforage.setItem('newReleasesList', JSON.stringify(list));
            }, () => { this.newTrackListLoaded = false; });
        }
      }
    } catch (e) {
      console.error('Error loading new releases list from cache:', e);
      this.newTrackListLoaded = false;
    }
  }

  async loadNewCollectionsList() {
    try {
      const cachedHistoryList = await localforage.getItem('newCollectionsList');

      if (cachedHistoryList) {
        this.newCollectionsList = JSON.parse(cachedHistoryList as string);
        this.newCollectionsListLoaded = true;
      } else {
        if (this.token) {
          const currentYear = new Date().getFullYear();
          this.requestService.post<any[]>(environment.searchTracksList,
            { access_token: this.token, searchText: `new armenian tracks` })
            .subscribe(async list => {
              this.newCollectionsListLoaded = true;
              await Haptics.impact({ style: ImpactStyle.Light });
              this.newCollectionsList = list;
              this.cdr.detectChanges();
              await localforage.setItem('newCollectionsList', JSON.stringify(list));
            }, () => { this.newCollectionsListLoaded = false; });
        }
      }
    } catch (e) {
      console.error('Error loading new collections list from cache:', e);
      this.newCollectionsListLoaded = false;
    }
  }

  async loadHistoryList() {
    try {
      const cachedHistoryList = await localforage.getItem('historyList');

      if (cachedHistoryList) {
        this.historyList = JSON.parse(cachedHistoryList as string);
        this.trackListLoaded = true;
      } else {
        if (this.token) {
          this.requestService.post<any[]>(environment.getPlayHistory, { access_token: this.token })
            .subscribe(async list => {
              this.trackListLoaded = true;
              await Haptics.impact({ style: ImpactStyle.Light });
              const sortedTrackList = list.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
              this.historyList = sortedTrackList;
              this.cdr.detectChanges();
              await localforage.setItem('historyList', JSON.stringify(sortedTrackList));
            }, () => { this.trackListLoaded = false; });
        }
      }
    } catch (e) {
      console.error('Error loading history list from cache:', e);
      this.trackListLoaded = false;
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

  setTrack(id: string, index: number, list: any) {
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(list as any[]);
  }

  protected readonly innerWidth = innerWidth;
  protected readonly console = console;
}
