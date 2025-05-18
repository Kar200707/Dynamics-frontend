import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {environment} from "../../../environment/environment";
import {HttpClientModule} from "@angular/common/http";
import {SearchListModel} from "../../../models/search_list.model";
import {PlayerControllerService} from "../../services/player-controller.service";
import {debounceTime, Subject, switchMap} from "rxjs";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import localforage from "localforage";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {Keyboard} from "@capacitor/keyboard";
import {Capacitor} from "@capacitor/core";
import {Channel2Model} from "../../../models/channel2.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatButton,
    HttpClientModule,
    LoaderIosComponent,
    MatIcon,
    RouterLink,
    MatIconButton
  ],
  providers: [
    RequestService
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, AfterViewInit {
  @Input('place') place: any;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private searchSubject: Subject<any> = new Subject<string>();
  token: string | null = localStorage.getItem('token');
  isLoaded: boolean = false;
  search: SearchListModel[] = [];
  channels: any[] = [];
  searchHistory:any = [];
  isOpenedKeyBoard: boolean = false;
  isClickedSearchResBlock: boolean = false;
  isOpenedSearchResBlock: boolean = false;
  searchText: string = '';
  helpTexts: string[] = [
    'New Musics',
    'Armenian Hits',
    'Rock Classics',
    'Jazz Vibes',
    'Pop Hits',
    'Electronic Beats',
    'Classical Favorites',
    'Chill Vibes',
    'Indie Sounds'
  ];
  loadList: number[] = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ]

  constructor(
    private location: Location,
    private playerController: PlayerControllerService,
    private reqServ: RequestService) {
    this.searchSubject.pipe(
      debounceTime(350),
      switchMap((value: string) => this.reqServ.post<{ videos: SearchListModel[], channels: any[] }>(environment.searchTracksList, { searchText: value }))
    ).subscribe(async (data: { videos: SearchListModel[], channels: Channel2Model[] }) => {
      this.search = data.videos;
      const seenNames = new Set();
      this.channels = data.channels.filter(channel => {
        if (seenNames.has(channel.name)) {
          return false;
        }
        seenNames.add(channel.name);
        return true;
      });
      console.log(this.channels)
      this.isLoaded = true;
      const platform = Capacitor.getPlatform();

      if (platform !== 'web') {
        await Haptics.impact({style: ImpactStyle.Light});
      }
    });
  }

  ngAfterViewInit() {
    if (this.place !== 'home') {
      setTimeout(() => this.searchInput.nativeElement.focus(), 100);
    }
  }

  async ngOnInit() {
    if (this.place !== 'home') {
      this.isOpenedSearchResBlock = true;
    }
    this.getSearchHistory();
    if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
      await Keyboard.addListener('keyboardWillShow', () => {
        this.isOpenedKeyBoard = true;
      });

      await Keyboard.addListener('keyboardWillHide', () => {
        this.isOpenedKeyBoard = false;
      });
    }
  }

  routeBack() {
    this.location.back();
  }

  handleBlur(): void {
    if (this.place === 'home') {
      this.isClickedSearchResBlock = false;
        setTimeout(() => {
          if (!this.isClickedSearchResBlock) {
            this.isOpenedSearchResBlock = false;
          }
        }, 200)
    }
  }

  async getSearchHistory() {
    const cachedSearchHistory = await localforage.getItem('searchHistory');
    try {
      if (cachedSearchHistory) {
        this.searchHistory = JSON.parse(cachedSearchHistory as string)
      } else {
        this.searchHistory = [];
      }

      this.reqServ.post<any>(environment.getSearchHistory, { access_token: this.token })
        .subscribe(async (history) => {
          if (this.searchHistory !== history || !cachedSearchHistory) {
            this.searchHistory = history;
            await localforage.setItem('searchHistory', JSON.stringify(history));
          }
        })
    } catch (e) {
      console.error('Error loading history list from cache:', e);
      this.searchHistory = [];
    }
  }

  setSearchHistory(search: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = search;
      this.searchTrackList(search);
    }
  }

  searchTrackList(value: string) {
    if (value === '') {
      this.getSearchHistory();
    }
    if (value.trim()) {
      this.search = [];
      this.isLoaded = false;
      this.searchSubject.next(value);
      this.searchText = value;
    } else {
      this.isLoaded = false;
      this.search = [];
    }
  }

  setTrack(id: string, index: number) {
    this.reqServ.post<any>(environment.setSearchHistory, { access_token: this.token, text: this.searchText })
      .subscribe(() => {})
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.search, "");
  }
}
