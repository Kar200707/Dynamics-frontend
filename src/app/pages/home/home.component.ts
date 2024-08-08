import { Component } from '@angular/core';
import {NewsBlockComponent} from "../../components/news-block/news-block.component";
import {PlaylistsBlockComponent} from "../../components/playlists-block/playlists-block.component";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NewsBlockComponent,
    PlaylistsBlockComponent,
    ResizeHeightDirective,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  protected readonly innerWidth = innerWidth;
}
