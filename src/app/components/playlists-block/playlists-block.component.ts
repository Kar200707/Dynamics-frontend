import {Component, ElementRef} from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule
  ],
  providers: [
    RequestService
  ],
  templateUrl: './playlists-block.component.html',
  styleUrl: './playlists-block.component.css'
})
export class PlaylistsBlockComponent {

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService) {}

  setPlaylist(playlistNum: number) {
    if (playlistNum === 1) {
      this.playerController.setList([
        {
          track_name: 'Эгоист',
          track_artist: 'Navai',
          track_duration: '3:33',
          track_image: 'https://i.scdn.co/image/ab67616d00001e02475dcf40059d411897dd9197',
          track_url: 'http://api-dynamics.adaptable.app/auth/get/179HcPo6OjqZUzcdVjvgCxgTD-A9RicOd',
        },
        {
          track_name: 'Не люби меня',
          track_artist: 'Navai & Hammali',
          track_duration: '3:33',
          track_image: 'https://i.scdn.co/image/ab67616d00001e020b5f345fbf7423b9e277c75c',
          track_url: 'https://dnl1.drivemusic.club/dl/SEJsNyURecnQfqSbXRaFuA/1718164400/download_music/2020/01/hammali-navai-ne-ljubi-menja.mp3'
        },
        {
          track_name: 'DIAMOND',
          track_artist: 'Xcho',
          track_duration: '3:33',
          track_image: 'https://i.scdn.co/image/ab67616d00001e02d0270a9e7b596206ba59345f',
          track_url: 'http://localhost:8080/auth/get/12_YLFh3ANMWz98OxfY5zeg0cko2gsyRw'
        },
        {
          track_name: 'Ну почему?',
          track_artist: 'Emin, Navai & Hammali',
          track_duration: '3:33',
          track_image: 'https://i.scdn.co/image/ab67616d00001e0203b0080f27efedbca869f243',
          track_url: 'https://sefon.pro/api/mp3_download/direct/356409/3vUCADbipaxUyanaR0fTmW5ukvb1Zj3rhz-jT4FItNWD-nGaQx27BQh-dmZDMm8Hqkqw4cLyI8CTpj7WJDPMI6tCwS4RM-PRrav2SrUnJIaNzosVA4a6nSlakHQXXIp4BeaI1xMsQxXsrcTU1eJKKwMu95eC8_0YLoXGqQ/'
        },
      ]);
    }
  }
}
