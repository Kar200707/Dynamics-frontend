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

@Component({
  selector: 'app-track-favorites',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatButton,
    HttpClientModule,
    LoaderIosComponent
  ],
  providers: [
    RequestService
  ],
  templateUrl: './track-favorites.component.html',
  styleUrl: './track-favorites.component.css'
})
export class TrackFavoritesComponent implements OnInit, OnDestroy {
  trackList?: any;
  trackPlayIndex!: number;
  token: string | null = localStorage.getItem('token');

  constructor(
    private requestService: RequestService,
    private renderer: Renderer2,
    private setMetaThemeColor: ChangeMetaThemeColorService,
    private playerController: PlayerControllerService) {
    this.playerController.trackIndex$.subscribe(index => {
      this.trackPlayIndex = index;
    })
  }

  ngOnDestroy() {
    this.trackList = null;
    this.trackPlayIndex = 0;
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

  setTrack(index: number) {
    this.trackPlayIndex = index;
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
