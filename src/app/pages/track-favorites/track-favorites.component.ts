import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {PlayerControllerService} from "../../services/player-controller.service";
import {ChangeMetaThemeColorService} from "../../services/change-meta-theme-color.service";
import {MatButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {environment} from "../../../environment/environment";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-track-favorites',
  standalone: true,
    imports: [
        MatIcon,
        RouterLink,
        MatButton,
        HttpClientModule,
        LoaderIosComponent,
        NgIf
    ],
  providers: [
    RequestService
  ],
  templateUrl: './track-favorites.component.html',
  styleUrl: './track-favorites.component.css'
})
export class TrackFavoritesComponent implements OnInit, OnDestroy {
  trackList?: any;
  trackPlayId!: string;
  token: string | null = localStorage.getItem('token');

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService) {
    this.playerController.trackId$.subscribe(id => {
      this.trackPlayId = id;
    })
  }

  ngOnDestroy() {
    this.trackList = null;
    this.trackPlayId = '';
  }

  ngOnInit() {
    this.getFavoriteTracksList();
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getFavoriteTracksList() {
    this.requestService.post<any>(
      environment.getFavoriteTracksList,
      { access_token: this.token }
    ).subscribe(tracksList => {
      this.trackList = tracksList;
    })
  }

  setTrack(id: string, index: number) {
    this.trackPlayId = id;
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
