import {Component, NgZone, OnInit} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {MobileNavPanelComponent} from "./components/mobile-nav-panel/mobile-nav-panel.component";
import {PlayerComponent} from "./components/player/player.component";
import {LayoutComponent} from "./layout/layout.component";
import localforage from "localforage";
import { App, URLOpenListenerEvent } from '@capacitor/app';
import {Browser} from "@capacitor/browser";

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

  constructor(private router: Router, private zone: NgZone) { this.initializeApp() }

  async ngOnInit() {
    this.setupDeepLinkListener();
    await localforage.removeItem("historyList");
    await localforage.removeItem("newReleasesList");
    await localforage.removeItem("podcastsList");
    await localforage.removeItem("newCollectionsList");
    document.addEventListener('DOMContentLoaded', this.setSafeAreaInsets);
    const safeAreaInsetTop = window.innerHeight - document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--safe-area-inset-top', `${safeAreaInsetTop}px`);
  }

  async setupDeepLinkListener() {
    await App.addListener('appUrlOpen', async (event: any) => {
      const url = event.url;

      const urlParams = new URLSearchParams(new URL(url).search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
        await Browser.close();
        console.log(token)
      }
    });
  }

  setSafeAreaInsets () {
    // Check if visualViewport is supported
    if (window.visualViewport) {
      const { height } = window.visualViewport;
      const safeAreaInsetTop = window.innerHeight - height;

      // Set the safe area top as a CSS variable
      document.documentElement.style.setProperty('--safe-area-inset-top', `${safeAreaInsetTop}px`);
    }
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const slug = event.url.split(".app").pop();
        if (slug) {
          this.router.navigateByUrl(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });
  }
}
