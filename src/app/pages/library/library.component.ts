import {Component, HostListener, OnInit} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Router, RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environment/environment";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
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
    MatIconButton
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

  constructor(
    private cacheService: AudioCacheService,
    private router: Router,
    private requestService: RequestService) {  }

  ngOnInit() {
    this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
      .subscribe(account => {
        this.account = account;
        this.role = account.role;
      })

    this.getFavoritePlaylistsLength();
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

  toggleAccountInfoBlock(event: Event) {
    event.stopPropagation();
    this.isOpenedAccountInfoBlock = !this.isOpenedAccountInfoBlock;
  }

  @HostListener('document:click', ['$event'])
  closeAccountInfoBlock(event: Event) {
    this.isOpenedAccountInfoBlock = false;
  }

  async logout() {
    localStorage.removeItem('token');
    try {
      await localforage.clear();
      await this.cacheService.clear();
      console.log('localforage cleared');
    } catch (error) {
      console.error('Error clearing localforage:', error);
    }
    this.router.navigate(['/login']);
  }
}
