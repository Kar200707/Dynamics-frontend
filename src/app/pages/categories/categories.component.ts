import {Component, Renderer2} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {MatIcon} from "@angular/material/icon";
import {RequestService} from "../../services/request.service";
import {ChangeMetaThemeColorService} from "../../services/change-meta-theme-color.service";
import {PlayerControllerService} from "../../services/player-controller.service";
import {environment} from "../../../environment/environment";
import {HttpClientModule} from "@angular/common/http";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";

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
    ResizeHeightDirective,
    NgIf,
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
  trackPlayId!: string;
  token: string | null = localStorage.getItem('token');
  categoryForReq!: string;

  constructor(
    private requestService: RequestService,
    private playerController: PlayerControllerService,
    private activatedRoute: ActivatedRoute) {
    this.playerController.trackId$.subscribe(id => {
      this.trackPlayId = id;
    })
    this.activatedRoute.params.subscribe((p:any) => {
      this.category = p.type;
      this.imgUrl = `assets/images/categories/${p.type}.png`;
      if (p.type === 'rock') {
        this.categoryForReq = 'rock';
        this.gradient = 'linear-gradient(to bottom, #d09607, rgba(239, 188, 63, 0.30), transparent)';
      } else if (p.type === 'rap') {
        this.categoryForReq = 'rap';
        this.gradient = 'linear-gradient(to bottom, #434459, rgba(117, 118, 138, 0.42), transparent)';
      } else  if (p.type === 'jazz') {
        this.categoryForReq = 'jazz';
        this.gradient = 'linear-gradient(to bottom, #312817, #35322d, transparent)';
      } else  if (p.type === 'hip-hop') {
        this.categoryForReq = 'hip%20hop';
        this.gradient = 'linear-gradient(to bottom, #4e067e, #1f1250, transparent)';
      }
    })
  }

  ngOnDestroy() {
    this.trackList = null;
    this.trackPlayId = '';
  }

  ngOnInit() {
    this.getTracksList();
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // getIsFavorite(trackId: string, index: number) {
  //   this.requestService.post<any>(environment.getIsFavoriteTrack, { trackId: trackId, access_token: this.token })
  //     .subscribe(data => {
  //       this.isFavoriteList = [];
  //       this.isFavoriteList[index] = data.isFavorite;
  //     })
  // }

  getTracksList() {
    this.requestService.post<any>(
      environment.getTracksListByCategory + this.categoryForReq,
      { access_token: this.token }
    ).subscribe(tracksList => {
      this.trackList = tracksList;
    })
  }

  setTrack(id: string, index: number) {
    this.trackPlayId = id;
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.trackList);
  }
}
