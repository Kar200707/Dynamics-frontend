import {Component, OnInit} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Router, RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environment/environment";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import localforage from "localforage";
import {AudioCacheService} from "../../services/audio-cache.service";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    RouterLink,
    HttpClientModule,
    MatButton,
    NgIf,
    MatIcon,
    MatIconButton,
    NgOptimizedImage
  ],
  providers: [
    RequestService,
    AudioCacheService
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  favoritePlayListLength: number = 0;
  account: any;
  token: string | null = localStorage.getItem('token');
  isOpenedAccountInfoBlock: boolean = false;
  role!: string;
  avatar!: string;

  constructor(
    private cacheService: AudioCacheService,
    private router: Router,
    private requestService: RequestService) {  }

  async ngOnInit() {
    const cacheAvatar: any = await localforage.getItem("avatarBlob");
    if (cacheAvatar) {
      this.avatar = URL.createObjectURL(cacheAvatar);
    }

    this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
      .subscribe(async account => {
        this.account = account;
        this.role = account.role;
        if (!cacheAvatar) {
          this.cacheAvatar(account.avatar);
        }
      })

    this.getFavoritePlaylistsLength();
  }

  cacheAvatar(avatarUrl: string) {
    fetch(avatarUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.blob();
      })
      .then(async blob => {
        await localforage.setItem('avatarBlob', blob);
        this.avatar = URL.createObjectURL(blob);
      })
      .catch(error => {
        console.error('Error while fetching avatar:', error);
      });
  }

  async getFavoritePlaylistsLength () {
    const cachedHistoryList = await localforage.getItem('favoritesTracksListLength');
    try {
      if (cachedHistoryList) {
        this.favoritePlayListLength = JSON.parse(cachedHistoryList as string);
      } else {
        this.favoritePlayListLength = 0;
      }

      this.requestService.post<any>(
        environment.getFavoriteTracksList,
        { access_token: this.token }
      ).subscribe(async tracksList => {
        if (this.favoritePlayListLength !== tracksList.length || !cachedHistoryList) {
          this.favoritePlayListLength = tracksList.length;
          await localforage.setItem('favoritesTracksListLength', JSON.stringify(tracksList.length));
        }
      });
    } catch (e) {
      console.error('Error loading history list from cache:', e);
      this.favoritePlayListLength = 0;
    }
  }

  toggleAccountInfoBlock() {
    this.isOpenedAccountInfoBlock = !this.isOpenedAccountInfoBlock;
  }

  async logout() {
    localStorage.removeItem('token');
    try {
      await localforage.clear();
      await this.cacheService.clear();
    } catch (error) {
      console.error('Error clearing localforage:', error);
    }
    this.router.navigate(['/login']);
  }
}
