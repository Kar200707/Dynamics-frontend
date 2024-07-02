import {Component, HostListener, OnInit} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Router, RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environment/environment";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

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
    MatIcon
  ],
  providers: [RequestService],
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
    private router: Router,
    private requestService: RequestService) {  }

  ngOnInit() {
    this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
      .subscribe(account => {
        this.account = account;
        this.role = account.role;
      })

    this.requestService.post<any>(
      environment.getFavoriteTracksList,
      { access_token: this.token }
    ).subscribe(tracksList => {
      this.favoritePlayListLength = tracksList.length;
    })
  }

  toggleAccountInfoBlock(event: Event) {
    event.stopPropagation();
    this.isOpenedAccountInfoBlock = !this.isOpenedAccountInfoBlock;
  }

  @HostListener('document:click', ['$event'])
  closeAccountInfoBlock(event: Event) {
    this.isOpenedAccountInfoBlock = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
