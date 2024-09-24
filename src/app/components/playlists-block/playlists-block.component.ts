import {Component, HostListener, OnInit} from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import localforage from 'localforage';
import {environment} from "../../../environment/environment";
import {MatIcon} from "@angular/material/icon";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    MatIcon,
    LoaderIosComponent
  ],
  providers: [
    RequestService
  ],
  templateUrl: './playlists-block.component.html',
  styleUrl: './playlists-block.component.css'
})
export class PlaylistsBlockComponent implements OnInit {
  account: any;
  token: string | null = localStorage.getItem('token');
  historyList?: any[];
  trackListLoaded: boolean = false;
  loadArray = [
    1,
    2,
    3
  ]

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService) {}

  async ngOnInit() {
    this.loadHistoryList();
    this.loadAccount();
    this.setupVisibilityChangeListener();
  }

  setupVisibilityChangeListener() {
    document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
  }

  async onVisibilityChange(event: Event) {
    if (document.visibilityState === 'visible') {
      await localforage.removeItem("historyList");
      this.trackListLoaded = false;
      await this.loadHistoryList();
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
            .subscribe(list => {
              this.trackListLoaded = true;
              const sortedTrackList = list.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
              this.historyList = sortedTrackList;
              localforage.setItem('historyList', JSON.stringify(sortedTrackList));
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
        });
    }
  }

  setTrack(id: string, index: number) {
    // this.trackPlayId = id;
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.historyList as any[]);
  }
}
