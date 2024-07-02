import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {PcNavPanelComponent} from "../../components/pc-nav-panel/pc-nav-panel.component";
import {NewsBlockComponent} from "../../components/news-block/news-block.component";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {PlaylistsBlockComponent} from "../../components/playlists-block/playlists-block.component";
import {PlayerComponent} from "../../components/player/player.component";
import {PlayerControllerService} from "../../services/player-controller.service";
import {MobileNavPanelComponent} from "../../components/mobile-nav-panel/mobile-nav-panel.component";
import {TimerBottomSheetComponent} from "../../components/timer-bottom-sheet/timer-bottom-sheet.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    PcNavPanelComponent,
    NewsBlockComponent,
    ResizeHeightDirective,
    PlaylistsBlockComponent,
    PlayerComponent,
    MobileNavPanelComponent,
    TimerBottomSheetComponent,
    MatIconButton,
    MatIcon,
    RouterOutlet,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  routePath!: string;
  navPanelTimeOff: boolean = true;
  isOpenedPlayer: boolean = false;

  constructor(
    private playerController: PlayerControllerService,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routePath = event.urlAfterRedirects.split('/')[1];
      }
    });

    this.playerController.isOpened$.subscribe(isOpened => {
      this.isOpenedPlayer = isOpened;
      if (isOpened) {
        setTimeout(() => {
          this.navPanelTimeOff = !isOpened;
        }, 250)
      } else {
        this.navPanelTimeOff = !isOpened;
      }
    })
  }
}
