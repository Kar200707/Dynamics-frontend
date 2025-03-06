import {Component, ElementRef, inject, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {AdminComponent} from "../admin/admin.component";
import {AddPlaylistComponent} from "../../components/bottom-sheets/add-playlist/add-playlist.component";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {AccountComponent} from "../../components/bottom-sheets/account/account.component";

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
    NgOptimizedImage,
    ResizeHeightDirective
  ],
  providers: [
    RequestService,
    AudioCacheService
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('titleElement') titleElement!: ElementRef;
  favoritePlayListLength: number = 0;
  account: any;
  token: string | null = localStorage.getItem('token');
  isOpenedAccountInfoBlock: boolean = false;
  role!: string;
  avatar!: string;
  playlists!: any[];
  private _bottomSheetPlaylistAdd = inject(MatBottomSheet);
  private _bottomSheetAccount = inject(MatBottomSheet);

  constructor(
    private renderer: Renderer2,
    private requestService: RequestService) {  }

  async ngOnInit() {
    this.getPlaylists();
    const cacheAvatar: any = await localforage.getItem("avatarBlob");
    if (cacheAvatar) {
      this.avatar = URL.createObjectURL(cacheAvatar);
    }

    this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
      .subscribe(async account => {
        this.account = account;
        if (!cacheAvatar) {
          this.cacheAvatar(account.avatar);
        }
      })

    this.getFavoritePlaylistsLength();
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheetPlaylistAdd.open(AddPlaylistComponent, {
      panelClass: "bottom-sheet",
      data: {
        hello: "true"
      }
    });

    bottomSheetRef.afterDismissed().subscribe(() => {
      this.getPlaylists();
    });
  }

  getPlaylists() {
    this.requestService.post<any>(environment.playlistGet, { token: this.token })
    .subscribe(data => {
      this.playlists = data.playlists;
    })
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
    const bottomSheetRef = this._bottomSheetAccount.open(AccountComponent, {
      panelClass: "bottom-sheet",
      data: this.account
    });

    bottomSheetRef.afterDismissed().subscribe(() => {});
    this.isOpenedAccountInfoBlock = !this.isOpenedAccountInfoBlock;
  }

  onScroll() {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    if (scrollTop > 10) {
      this.renderer.setStyle(this.titleElement.nativeElement, 'transform', 'translate(0, 0)');
    } else {
      this.renderer.setStyle(this.titleElement.nativeElement, 'transform', 'translate(-40px, 60px)');
    }
  }
}
