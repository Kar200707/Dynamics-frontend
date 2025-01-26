import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {HttpClientModule} from "@angular/common/http";
import {RequestService} from "../../services/request.service";
import {Keyboard} from "@capacitor/keyboard";
import {Capacitor} from "@capacitor/core";
import {NgStyle} from "@angular/common";

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
    HttpClientModule,
    MatIcon,
    RouterOutlet,
    NgStyle,
  ],
  providers: [ RequestService ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  routePath!: any;
  navPanelTimeOff: boolean = true;
  isOpenedPlayer: boolean = false;
  keyboardHeight: number = 0;

  constructor(
    private reqServ: RequestService,
    private playerController: PlayerControllerService,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routePath = event.urlAfterRedirects;
      }
    });

    this.playerController.isOpened$.subscribe(isOpened => {
      if (this.isOpenedPlayer) {
        this.isOpenedPlayer = isOpened;
      } else {
        this.isOpenedPlayer = isOpened;
      }
      if (isOpened) {
        setTimeout(() => {
          this.navPanelTimeOff = !isOpened;
        }, 200)
      } else {
        this.navPanelTimeOff = !isOpened;
      }
    })
  }

  async ngOnInit() {
    if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
      await Keyboard.addListener('keyboardWillShow', (info: any) => {
        this.keyboardHeight = info.keyboardHeight;
      });
      await Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardHeight = 0;
      });
    }
  }

  protected readonly innerHeight = innerHeight;
  protected readonly innerWidth = innerWidth;
}
