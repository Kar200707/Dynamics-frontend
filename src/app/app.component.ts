import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule, RouterOutlet} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {MobileNavPanelComponent} from "./components/mobile-nav-panel/mobile-nav-panel.component";
import {PlayerComponent} from "./components/player/player.component";
import {LayoutComponent} from "./layout/layout.component";
import localforage from "localforage";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MainComponent,
    MobileNavPanelComponent,
    RouterModule,
    PlayerComponent,
    LayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dynamics';

  async ngOnInit() {
    await localforage.removeItem("historyList");
  }
}
