import {Component, OnInit} from '@angular/core';
import {NewsBlockComponent} from "../../components/news-block/news-block.component";
import {PlaylistsBlockComponent} from "../../components/playlists-block/playlists-block.component";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PcNavPanelComponent} from "../../components/pc-nav-panel/pc-nav-panel.component";
import {RequestService} from "../../services/request.service";
import {environment} from "../../../environment/environment";
import {SearchComponent} from "../search/search.component";
import {PlayerControllerService} from "../../services/player-controller.service";

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
    SearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  token: string | null = localStorage.getItem('token');
  searchHistory: any[] = [];

  constructor(private reqService: RequestService) { this.getSearchHistory() }

  getSearchHistory() {

  }

  protected readonly innerWidth = innerWidth;
}
