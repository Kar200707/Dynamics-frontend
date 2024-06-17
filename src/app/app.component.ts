import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterModule, RouterOutlet} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {MobileNavPanelComponent} from "./components/mobile-nav-panel/mobile-nav-panel.component";
import {PlayerComponent} from "./components/player/player.component";
import {PlayerControllerService} from "./services/player-controller.service";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [
        RouterOutlet,
        MainComponent,
        MobileNavPanelComponent,
        RouterModule,
        PlayerComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dynamics';
  routePath!: string;
  isOpenedPlayer: boolean = false;

  constructor(private router: Router, private playerController: PlayerControllerService) {
    this.playerController.isOpened$.subscribe(isOpened => {
      this.isOpenedPlayer = isOpened;
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routePath = event.urlAfterRedirects.split('/')[1];
      }
    });
  }
}
