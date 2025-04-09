import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {environment} from "../../../../environment/environment";
import {RequestService} from "../../../services/request.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-add-track-in-playlists',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    HttpClientModule,
  ],
  providers: [
    RequestService,
  ],
  templateUrl: './add-track-in-playlists.component.html',
  styleUrl: './add-track-in-playlists.component.css'
})
export class AddTrackInPlaylistsComponent implements OnInit {
  private bottomSheetRef = inject(MatBottomSheetRef<AddTrackInPlaylistsComponent>);
  token: string | null = localStorage.getItem('token');
  audioInfo: any;
  playlists!: any[];

  constructor(
    private requestService: RequestService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.audioInfo = data;
  }

  ngOnInit(): void {
    this.getPlaylists();
  }

  addTrack(playlist: any) {
    const tracks = playlist.tracks;
    let audio = this.audioInfo;

    const exists = tracks.some((track: any) => track.videoId === audio.videoId);
    if (exists) {
      this.closeSheet();
      return;
    }

    audio.addedAt = Date.now();
    tracks.push(audio);

    this.requestService.put<any>(environment.playlistUpdate + playlist._id, { token: this.token, tracks })
      .subscribe(() => {
      })
    this.closeSheet();
  }

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }

  getPlaylists() {
    this.requestService.post<any>(environment.playlistGet, { token: this.token })
      .subscribe(data => {
        this.playlists = data.playlists.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        this.playlists.forEach((playlist: any) => {
          playlist.tracks = playlist.tracks
            .sort((trackA: any, trackB: any) => new Date(trackB.addedAt).getTime() - new Date(trackA.addedAt).getTime());
        });
      })
  }
}
