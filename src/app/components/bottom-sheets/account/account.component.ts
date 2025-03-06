import {Component, inject, Inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import localforage from "localforage";
import {AudioCacheService} from "../../../services/audio-cache.service";
import {RequestService} from "../../../services/request.service";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgIf,
    RouterLink
  ],
  providers: [AudioCacheService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  account: any;
  private bottomSheetRef = inject(MatBottomSheetRef<AccountComponent>);

  constructor(
    private cacheService: AudioCacheService,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {  }

  ngOnInit() {
    this.account = this.data;
  }

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }

  async logout() {
    localStorage.removeItem('token');
    try {
      await localforage.clear();
      await this.cacheService.clear();
    } catch (error) {
      console.error('Error clearing localforage:', error);
    }
    this.closeSheet();
    this.router.navigate(['/login']);
  }
}
