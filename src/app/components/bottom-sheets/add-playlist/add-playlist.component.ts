import {ChangeDetectorRef, Component, ElementRef, inject, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {AudioCacheService} from "../../../services/audio-cache.service";
import {ImageDominantColorService} from "../../player/player_functions/image-dominat-color.service";
import {RequestService} from "../../../services/request.service";
import {PlayerControllerService} from "../../../services/player-controller.service";
import {Haptics, ImpactStyle, NotificationType} from "@capacitor/haptics";
import localforage from "localforage";
import {environment} from "../../../../environment/environment";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SearchComponent} from "../../../pages/search/search.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-add-playlist',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    HttpClientModule,
    SearchComponent,
    MatIcon
  ],
  providers: [RequestService, AudioCacheService, HttpClient],
  templateUrl: './add-playlist.component.html',
  styleUrl: './add-playlist.component.css'
})
export class AddPlaylistComponent implements OnInit {
  account: any;
  token: string | null = localStorage.getItem('token');
  @ViewChild('playlistNameInput') playlistNameInput!: ElementRef<HTMLInputElement>;
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
  selectedTracks: any[] = [];
  private bottomSheetRef = inject(MatBottomSheetRef<AddPlaylistComponent>);
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
    private playerController: PlayerControllerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  async ngOnInit() {
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

  closeSheet() {
    this.bottomSheetRef.dismiss();
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
            { access_token: this.token, searchText: `Armenian Songs ${currentYear}` })
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

  isSelected(trackData: any): boolean {
    return this.selectedTracks.some(t => t.videoId === trackData.videoId);
  }

  createPlaylist() {
    if (this.playlistNameInput.nativeElement.value !== '' && this.selectedTracks.length !== 0) {
      this.closeSheet();
      this.requestService.post<any>(environment.playlistCreate,
        {
          playlistName: this.playlistNameInput.nativeElement.value,
          token: this.token,
          tracks: this.selectedTracks,
      }).subscribe(async data => {
        console.log(data);
        await Haptics.notification({ type: NotificationType.Success });
      })
    }
  }

  async select(trackData: any, index: number) {
    const trackIndex = this.selectedTracks.findIndex(t => t.videoId === trackData.videoId);

    if (trackIndex !== -1) {
      this.selectedTracks.splice(trackIndex, 1);
    } else {
      trackData.addedAt = Date.now();
      this.selectedTracks.push(trackData);
      await Haptics.notification({ type: NotificationType.Success });
    }
    console.log(this.selectedTracks);
  }

  protected readonly innerWidth = innerWidth;
  protected readonly console = console;
}
