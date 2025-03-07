import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {environment, host} from "../../../../environment/environment";
import {RequestService} from "../../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Haptics, NotificationType} from "@capacitor/haptics";

@Component({
  selector: 'app-more-playlist',
  standalone: true,
  imports: [
    HttpClientModule,
    MatIcon,
    MatIconButton,
    MatButton
  ],
  templateUrl: './more-playlist.component.html',
  styleUrl: './more-playlist.component.css',
  providers: [
    RequestService
  ],
})
export class MorePlaylistComponent implements OnInit {
  private bottomSheetRef = inject(MatBottomSheetRef<MorePlaylistComponent>);
  playlistId?: string;
  token: string | null = localStorage.getItem('token');
  playlist?: any;
  selectedPlaylistItemsforDelete: any[] = [];
  selectedPlaylistItems: any[] = [];
  isOpenedEditPlaylistName: boolean = false;

  constructor(
    private requestService: RequestService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {  }

  ngOnInit() {
    this.playlistId = this.data;
    this.getPlaylist();
  }

  isSelected(trackData: any): boolean {
    return this.selectedPlaylistItems.some(t => t.videoId === trackData.videoId);
  }

  async select(trackData: any) {
    const trackIndex = this.selectedPlaylistItems.findIndex(t => t.videoId === trackData.videoId);

    if (trackIndex === -1) {
      trackData.addedAt = Date.now();
      this.selectedPlaylistItems.push(trackData);
      this.selectedPlaylistItemsforDelete = this.playlist.tracks.filter((item: any) => item.videoId !== trackData.videoId);
      await Haptics.notification({ type: NotificationType.Success });
    } else {
      this.selectedPlaylistItems.splice(trackIndex, 1);
      this.selectedPlaylistItemsforDelete.push(trackData);
    }
  }

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }

  delete() {
    this.requestService.post<any>(environment.playlistDelete + this.playlistId, { token: this.token })
    .subscribe(() => {
      this.closeSheet();
    })
  }

  update() {
    this.requestService.put<any>(environment.playlistUpdate + this.playlistId, { token: this.token, tracks: this.selectedPlaylistItemsforDelete })
      .subscribe(() => {
        this.closeSheet();
      })
  }

  changePlaylistName(newName: string) {
    this.requestService.put<any>(environment.playlistUpdate + this.playlistId,
      {
        token: this.token,
        tracks: this.playlist.tracks,
        playlistName: newName
      })
      .subscribe(() => {
        this.playlist.playlistName = newName;
        this.isOpenedEditPlaylistName = false;
      })
  }

  getPlaylist() {
    this.requestService.post<any>(
      environment.playlistGet + '/' + this.playlistId,
      { token: this.token }
    ).subscribe((data) => {
      this.playlist = data.playlist;
    })
  }
}
