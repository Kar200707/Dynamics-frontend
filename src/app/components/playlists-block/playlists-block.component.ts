import {Component, ElementRef} from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './playlists-block.component.html',
  styleUrl: './playlists-block.component.css'
})
export class PlaylistsBlockComponent {
  constructor(private playerController: PlayerControllerService) {  }

  setPlaylist(playlistNum: number) {
    if (playlistNum === 1) {
      this.playerController.setList([
        {
          track_name: 'Miloya moya',
          track_artist: 'Navai',
          track_duration: '3:33',
          track_image: 'https://i.scdn.co/image/ab67616d00001e028b07ffa001a2cc510aa469a7',
          track_url: 'https://mp3uk.net/mp3/files/navai-ellai-milaya-moya-mp3.mp3'
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
          track_url: 'https://sefon.pro/api/mp3_download/direct/1259270/3vUCALstTR0CCnnHDt1UO7YeSxAOuoeqen_FYI-Tl1GPVNHMbKvkY4E3fQzHmiibM8oxzGFrnNSDDnAs1lZ4izCgl9pbEP33BrIqeAvIQkFB9hYLi1ndt6IBe8iYcSrhlVBiS3EwLDa9ZoQzjAc550Z-Ufd4JYgvs_dmcYc/'
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
