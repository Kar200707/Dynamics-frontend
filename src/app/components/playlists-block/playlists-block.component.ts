import {Component, ElementRef, OnInit} from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environment/environment";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    MatIcon
  ],
  providers: [
    RequestService
  ],
  templateUrl: './playlists-block.component.html',
  styleUrl: './playlists-block.component.css'
})
export class PlaylistsBlockComponent implements OnInit {
  account: any;
  token: string | null = localStorage.getItem('token');

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService) {}

  ngOnInit() {
    this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
      .subscribe(account => {
        this.account = account;
      })
  }
}
