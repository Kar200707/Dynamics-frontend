import {Component, OnInit, Renderer2} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {PlayerControllerService} from "../../services/player-controller.service";
import {ChangeMetaThemeColorService} from "../../services/change-meta-theme-color.service";
import {MatButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-track-favorites',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatButton,
    HttpClientModule
  ],
  providers: [
    RequestService
  ],
  templateUrl: './track-favorites.component.html',
  styleUrl: './track-favorites.component.css'
})
export class TrackFavoritesComponent implements OnInit {
  trackList: any = [
    {
      track_name: 'loading',
      track_artist: 'loading',
      track_image: 'assets/images/loading_image.webp'
    }
  ]

  constructor(
    private requestService: RequestService,
    private renderer: Renderer2,
    private setMetaThemeColor: ChangeMetaThemeColorService,
    private playerController: PlayerControllerService) {
    this.setMetaThemeColor.setThemeColor('rgba(0, 89, 222, 0.68)', this.renderer);
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
      'http://localhost:8080/media/track-details/get-favorites-list',
      { access_token: "$2b$13$S8Cf8aEwAmwb70VdH5MUXuWA2QS6Lzq/z8ITwE74wv1HijpdTaxES" }
    ).subscribe(tracksList => {
      this.trackList = tracksList;
    })
  }

  setTrack(index: number) {
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
