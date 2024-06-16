import { Component } from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [],
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
      ]);
    }
  }
}
