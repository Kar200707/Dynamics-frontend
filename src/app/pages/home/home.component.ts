import {Component, inject, OnInit} from '@angular/core';
import {NewsBlockComponent} from "../../components/news-block/news-block.component";
import {PlaylistsBlockComponent} from "../../components/playlists-block/playlists-block.component";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {PcNavPanelComponent} from "../../components/pc-nav-panel/pc-nav-panel.component";
import {RequestService} from "../../services/request.service";
import {SearchComponent} from "../search/search.component";
import localforage from "localforage";
import {AudioCacheService} from "../../services/audio-cache.service";
import {environment} from "../../../environment/environment";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {AccountComponent} from "../../components/bottom-sheets/account/account.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NewsBlockComponent,
    PlaylistsBlockComponent,
    ResizeHeightDirective,
    NgOptimizedImage,
    RouterLink,
    PcNavPanelComponent,
    SearchComponent,
    MatButton,
    MatIcon,
    NgIf,
    RouterOutlet
  ],
  providers: [
    RequestService,
    AudioCacheService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private _bottomSheetAccount = inject(MatBottomSheet);
  token: string | null = localStorage.getItem('token');
  account: any;
  role!: string;
  avatar!: string;

  constructor(
    private router: Router,
    private requestService: RequestService,
    private cacheService: AudioCacheService,
    private reqService: RequestService) { }

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

  async toggleAccountInfoBlock() {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      await Haptics.impact({style: ImpactStyle.Medium});
    }
    const bottomSheetRef = this._bottomSheetAccount.open(AccountComponent, {
      panelClass: "bottom-sheet",
      data: this.account
    });

    bottomSheetRef.afterDismissed().subscribe(() => {});
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

  protected readonly innerWidth = innerWidth;
}
