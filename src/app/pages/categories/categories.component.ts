import {Component, Renderer2} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TitleCasePipe, UpperCasePipe} from "@angular/common";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {MatIcon} from "@angular/material/icon";
import {RequestService} from "../../services/request.service";
import {ChangeMetaThemeColorService} from "../../services/change-meta-theme-color.service";
import {PlayerControllerService} from "../../services/player-controller.service";
import {environment} from "../../../environment/environment";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    LoaderIosComponent,
    MatIcon,
    RouterLink,
    HttpClientModule,
  ],
  providers: [RequestService],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  category: string = 'None';
  imgUrl!: string;
  gradient: string = '';
  protected readonly innerWidth = innerWidth;
  trackList?: any;
  trackPlayIndex!: number;
  token: string | null = localStorage.getItem('token');
  categoryForReq!: string;

  constructor(
    private requestService: RequestService,
    private renderer: Renderer2,
    private setMetaThemeColor: ChangeMetaThemeColorService,
    private playerController: PlayerControllerService,
    private activatedRoute: ActivatedRoute) {
    this.playerController.trackIndex$.subscribe(index => {
      this.trackPlayIndex = index;
    })
    activatedRoute.params.subscribe((p:any) => {
      this.category = p.type;
      this.imgUrl = `assets/images/categories/${p.type}.png`;
      if (p.type === 'rock') {
        this.categoryForReq = 'rock';
        this.gradient = 'linear-gradient(to top, #efbc3f, #d09607)';
      } else if (p.type === 'rap') {
        this.categoryForReq = 'rap';
        this.gradient = 'linear-gradient(to top, #75768a, #434459)';
      } else  if (p.type === 'jazz') {
        this.categoryForReq = 'jazz';
        this.gradient = 'linear-gradient(to top, #35322d, #312817)';
      } else  if (p.type === 'hip-hop') {
        this.categoryForReq = 'hip%20hop';
        this.gradient = 'linear-gradient(to top, #1f1250, #4e067e)';
      }
    })
  }

  ngOnDestroy() {
    this.trackList = null;
    this.trackPlayIndex = 0;
  }

  ngOnInit() {
    this.getFavoriteTracksList();
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getFavoriteTracksList() {
    this.requestService.post<any>(
      environment.getTracksListByCategory + this.categoryForReq,
      { access_token: this.token }
    ).subscribe(tracksList => {
      this.trackList = tracksList;
    })
  }

  setTrack(index: number) {
    this.trackPlayIndex = index;
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
