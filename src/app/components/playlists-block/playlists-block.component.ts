import {Component, ElementRef, OnInit} from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {RouterLink} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environment/environment";
import {MatIcon} from "@angular/material/icon";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";

@Component({
  selector: 'app-playlists-block',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    MatIcon,
    LoaderIosComponent
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
  historyList?: any[];
  trackListLoaded: boolean = false;

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService) {}

  ngOnInit() {
    this.requestService.post<any>(environment.getPlayHistory, { access_token: this.token })
      .subscribe(list => {
        this.trackListLoaded = true;
        const sortedTrackList = list.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        this.historyList = sortedTrackList;
      }, () => { this.trackListLoaded = false; })

    this.requestService.post<any>(environment.getAccount, { acsses_token: this.token })
      .subscribe(account => {
        this.account = account;
      })
  }

  setTrack(id: string, index: number) {
    // this.trackPlayId = id;
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.historyList as any[]);
  }
}
